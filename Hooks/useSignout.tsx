import { getAuth, signOut } from 'firebase/auth';

export const useSignout = async ({ dispatch }: any) => {
  try {
    //const messagingInstance = getMessaging();  // Get the Messaging instance
    const authInstance = getAuth();  // Get the Auth instance

    //const currentToken = await getToken(messagingInstance);
    
    // if (currentToken) {
    //   await deleteToken(messagingInstance); // Corrected: deleteToken only requires the messaging instance
    // }

    await signOut(authInstance);
    dispatch({ type: 'SET_USER', payload: {} });
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};


