import auth, {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithRedirect,
} from "firebase/auth";
import { useState } from "react";
import { Endpoints } from "../utils/Endpoints";
import { setUser } from "./setUser";
import { useUserContext } from "./useUserContext";

export const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { dispatch } = useUserContext();
    const [isSignupOperation, setIsSignupOperation] = useState(false);
    const provider = new GoogleAuthProvider();

    const signUpWithEmail = async (
        email: string,
        password: string
    ): Promise<string | undefined> => {
        let token;
        try {
            setIsSignupOperation(true);
            const auth = getAuth();
            await createUserWithEmailAndPassword(auth, email, password);
            token = await auth.currentUser?.getIdToken();
            console.info("FIREBASE TOKEN:", token);
            if (!token) {
                throw new Error("No token found");
            } else {
                return token;
            }
        } catch (error: any) {
            if (error?.code === "auth/weak-password") {
                setError(
                    "Your password is too weak. Please choose a stronger password."
                );
            } else {
                console.error(error);
                setError(String(error));
            }
            return token;
        }
    };

    const logInWithGoogle = async (): Promise<{
        token: string | undefined;
        firstName: string | undefined;
        lastName: string | undefined;
        email: string | undefined;
        isLogin: boolean;
    }> => {
        let firstName,
            lastName,
            token,
            email,
            isLogin = false;
        try {
            setLoading(true);
            // Check if your device supports Google Play
            // await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

            // Get the users ID token
            const auth = getAuth();
            const result = await signInWithPopup(auth, provider);

            // Create a Google credential with the token
            const credential = GoogleAuthProvider.credentialFromResult(result);

            // Sign-in the user with the credential
            const accessToken = credential?.accessToken;

            // The signed-in user info.
            const user = result.user;

            token = await auth.currentUser?.getIdToken();
            console.log("TOKEN found after google log in is", token)


            if (!token) {
                throw new Error("No token found in logInWithGoogle");
            } else {
                [firstName, lastName] = user?.displayName?.split(" ") ?? [];
                email = user?.email ?? "";
                if (!firstName) {
                    firstName = "Anonymous";
                }
                if (!lastName) {
                    lastName = "";
                }
            }
            isLogin = await checkIfLogin(token);
            console.log("IS LOGIN", isLogin)
            setLoading(false);
        } catch (error: any) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);

            setLoading(false);
            // if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
            //   // User cancelled the sign-in flow
            //   setError('Sign-in cancelled');
            // } else if (error?.code === statusCodes.IN_PROGRESS) {
            //   // Sign-in is already in progress
            //   setError('Sign-in is already in progress');
            // } else {
            //   console.error(error);
            //   setError(String(error));
            // }
            setLoading(false);
        } finally {
            return { token, firstName, lastName, email, isLogin };
        }
    };

    const signupUser = async (
        firstName: string,
        lastName: string,
        email: string,
        username: string,
        firebaseToken: string,
        inputError: string = ""
    ) => {
        setLoading(true);
        setError("");

        if (inputError) {
            setError(inputError);
            setLoading(false);
            return;
        }
        setIsSignupOperation(true);

        try {
            const resJson = await signupUserDB(
                firstName,
                lastName,
                email,
                username,
                firebaseToken
            );
            setUser({ resJson, setError, dispatch });
        } catch (error: any) {
            setLoading(false);
            console.error(error);
            setError(String(error));
        }
        setLoading(false);
    };

    const signupUserDB = async (
        firstName: string,
        lastName: string,
        email: string,
        username: string,
        firebaseToken: string
    ) => {
        try {
            setIsSignupOperation(true);
            console.log("SIGNUP USER DB", firstName, lastName, email, username, firebaseToken)
            let res = await fetch(Endpoints.signupFirebase, {
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    email: email,
                    firebaseToken: firebaseToken,
                }),
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            let resJson = await res.json();
            if (!res.ok) {
                throw new Error(resJson.error);
            }
            if (res.ok) {
                return resJson;
            }
        } catch (error: any) {
            console.error(error);
            throw String(error);
        }
    };

    return {
        loading,
        error,
        setLoading,
        setError,
        signupUser,
        signUpWithEmail,
        isSignupOperation,
        logInWithGoogle
        //logInWithApple,
    };
};

const checkIfLogin = async (firebaseToken: string): Promise<boolean> => {
    console.log("CHECK IF LOGIN", firebaseToken)
    try {
        let res = await fetch(Endpoints.loginFirebase, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firebaseToken: firebaseToken,
            }),
        });
        let resJson = await res.json();
        if (!res.ok) {
            throw resJson.error;
        }
        if (res.ok) {
            console.info('CHECK IF LOGIN', ' WAS TRUE')
            return true;
        }
        console.log('CHECK IF LOGIN', ' WAS FALSE')
        return false;
    } catch (e) {
        console.warn(e);
        return false;
    }
};
