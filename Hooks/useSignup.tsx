import auth, { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useState } from 'react';
import { Endpoints } from '../utils/Endpoints';
import { setUser } from './setUser';
import { useUserContext } from './useUserContext';

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {dispatch} = useUserContext();
  const [isSignupOperation, setIsSignupOperation] = useState(false);



  const signUpWithEmail = async (
    email: string,
    password: string,
  ): Promise<string | undefined> => {
    let token;
    try {
      setIsSignupOperation(true);
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password)
      token = await auth.currentUser?.getIdToken();
       console.info('FIREBASE TOKEN:', token);
      if (!token) {
        throw new Error('No token found');
      } else {
        return token;
      }
    } catch (error: any) {
      if (error?.code === 'auth/weak-password') {
        setError(
          'Your password is too weak. Please choose a stronger password.',
        );
      } else {
        console.error(error);
        setError(String(error));
      }
      return token;
    }
  };


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
    setIsSignupOperation(true);

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

  const signupUserDB = async (
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    firebaseToken: string,
  ) => {
    try {
       setIsSignupOperation(true);
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


  return {
    loading,
    error,
    setLoading,
    setError,
    signupUser,
    signUpWithEmail,
    isSignupOperation,
    // logInWithGoogle
    //logInWithApple,
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

const mergeUserDB = async (
  userID: string,
  email: string,
  firebaseToken: string,
) => {
  try {
    let res = await fetch(Endpoints.finishFirebaseLogin, {
      body: JSON.stringify({
        userID: userID,
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
    }
    if (res.ok) {
      // console.info('CHECK IF LOGIN', ' WAS TRUE')
      return true;
    }
    return false;
  } catch (e) {
    console.warn(e);
    return false;
  }
}