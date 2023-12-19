import { useState } from 'react';
import { Endpoints } from '../utils/Endpoints';
import { setUser } from './setUser';
import { useUserContext } from './useUserContext';

type SignupProps = {
  token: string;
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {dispatch} = useUserContext();

  const loginUser = async ({token}: SignupProps) => {
    setLoading(true);
    setError('');

    try {
      let res = await fetch(Endpoints.loginFirebase, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseToken: token,
        }),
      });
      let resJson = await res.json();
      if (!res.ok) {
        setLoading(false);
        setError(resJson.error);
        console.error(resJson.error)
      }
      if (res.ok) {
        await setUser({resJson, setError, dispatch});
      }
    } catch (error) {
      setError(String(error));
      setLoading(false);
      console.error(error)
    }
    setLoading(false);
  };
  return {loading, error, loginUser};
};