import { useState } from 'react';
import { Endpoints } from '../utils/Endpoints';
import { setUser } from './setUser';
import { useUserContext } from './useUserContext';
import { authFB } from "../Services/firebaseConfig";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithRedirect,
} from "firebase/auth";

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {dispatch} = useUserContext();
  const provider = new GoogleAuthProvider();

  // const signUpWithEmail = async (
  //   email: string,
  //   password: string,
  // ): Promise<string | undefined> => {
  //   let token;
  //   try {
  //     await auth().createUserWithEmailAndPassword(email, password);
  //     token = await auth().currentUser?.getIdToken();
  //     // console.info('FIREBASE TOKEN:', token);
  //     if (!token) {
  //       throw new Error('No token found');
  //     } else {
  //       return token;
  //     }
  //   } catch (error: any) {
  //     if (error?.code === 'auth/weak-password') {
  //       setError(
  //         'Your password is too weak. Please choose a stronger password.',
  //       );
  //     } else {
  //       console.error(error);
  //       setError(String(error));
  //     }
  //     return token;
  //   }
  // };

  const logInWithGoogle = async (): Promise<{
    token: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    isLogin: boolean;
  }> => {
    let firstName, lastName, token, email, isLogin = false;
    try {
      setLoading(true);
      // Get the users ID token
      const result = await signInWithPopup(authFB, provider);

      // Create a Google credential with the token
      const credential = GoogleAuthProvider.credentialFromResult(result);

      // Sign-in the user with the credential
      token = credential?.accessToken;

      // The signed-in user info.
      const user = result.user;

      if (!token) {
        throw new Error('No token found in logInWithGoogle');
      } else {
        [firstName, lastName] = user?.displayName?.split(' ') ?? [];
        email = user?.email ?? '';
        if (!firstName) {
          firstName = 'Anonymous';
        }
        if (!lastName) {
          lastName = '';
        }
      }
      isLogin = await checkIfLogin(token);
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
      return {token, firstName, lastName, email, isLogin};
    }
  };

  // const logInWithApple = async (): Promise<{
  //   token: string | undefined;
  //   firstName: string | undefined;
  //   lastName: string | undefined;
  //   email: string | undefined;
  //   isLogin: boolean;
  // }> => {
  //   let firstName, lastName, token, email, isLogin = false;
  //   try {
  //     setLoading(true);
  //     // 1). start a apple sign-in request
  //     const appleAuthRequestResponse = await appleAuth.performRequest({
  //       requestedOperation: appleAuth.Operation.LOGIN,
  //       requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  //     });

  //     // 2). if the request was successful, extract the token and nonce
  //     let {
  //       identityToken,
  //       nonce,
  //       fullName,
  //       email: newEmail,
  //     } = appleAuthRequestResponse;

  //     email = newEmail ?? undefined;
  //     // console.info('APPLE EMAIL:', email);
  //     let {givenName, familyName} = fullName ?? {};

  //     // can be null in some scenarios
  //     if (identityToken) {
  //       // 3). create a Firebase `AppleAuthProvider` credential
  //       const appleCredential = auth.AppleAuthProvider.credential(
  //         identityToken,
  //         nonce,
  //       );

  //       // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
  //       //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
  //       //     to link the account to an existing user
  //       const userCredential = await auth().signInWithCredential(
  //         appleCredential,
  //       );

  //       // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
  //       // console.info(
  //       //   `Firebase authenticated via Apple, UID: ${userCredential.user.uid}`,
  //       // );

  //       const user = auth().currentUser;
  //       token = (await user?.getIdToken()) ?? '';
  //       // console.info('FIREBASE TOKEN:', token);


  //       if (email == undefined) {
  //         email = user?.email ?? undefined;
  //         // console.info('APPLE EMAIL NOW SET TO:', email);
  //       }
  //       if (givenName == undefined) {
  //         firstName = user?.displayName?.split(' ')[0] ?? 'Anonymous';
  //       } else {
  //         firstName = givenName;
  //       }
  //       if (familyName == undefined) {
  //         lastName = user?.displayName?.split(' ')[1] ?? '';
  //       } else {
  //         lastName = familyName;
  //       }
  //       // console.info('FIRST NAME', firstName, 'LAST NAME', lastName, 'EMAIL', email);
  //       isLogin = await checkIfLogin(token);
  //     } else {
  //       throw new Error('No token created in logInWithApple');
  //     }
  //     setLoading(false);
  //   } catch (error: any) {
  //     setLoading(false);
  //     if (error?.code === appleAuth.Error.CANCELED) {
  //       // User cancelled the sign-in flow
  //       setError('Sign-in cancelled');
  //     } else {
  //       console.error(error);
  //       setError('Something went wrong. Please try again.');
  //     }
  //     setLoading(false);
  //   } finally {
  //     return {token, firstName, lastName, email, isLogin};
  //   }
  // };

  const signupUser = async (
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    firebaseToken: string,
    inputError: string = '',
  ) => {
    setLoading(true);
    setError('');

    if (inputError) {
      setError(inputError);
      setLoading(false);
      return;
    }

    try {
      const resJson = await signupUserDB(
        firstName,
        lastName,
        email,
        username,
        firebaseToken,
      );
      setUser({resJson, setError, dispatch});
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      setError(String(error));
    }
    setLoading(false);
  };

  return {
    loading,
    error,
    setLoading,
    setError,
    signupUser,
    // signUpWithEmail,
    logInWithGoogle,
    // logInWithApple,
  };
};

const signupUserDB = async (
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  firebaseToken: string,
) => {
  try {
    let res = await fetch(Endpoints.signupFirebase, {
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        firebaseToken: firebaseToken,
      }),
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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

const checkIfLogin = async (firebaseToken: string) : Promise<boolean> => {
  try {
    console.log("CHECKING IF LOGIN", firebaseToken)
    let res = await fetch(Endpoints.loginFirebase, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseToken: firebaseToken,
      }),
    });
    let resJson = await res.json();
    if (!res.ok) {
      throw resJson.error;
    } else {
      // console.info('CHECK IF LOGIN', ' WAS TRUE')
      return true;
    }
    return false;
  } catch (e) {
    console.warn(e);
    return false;
  }
}