// import messaging from '@react-native-firebase/messaging';
import {NotificationData, NotificationType} from '../utils/interfaces';
import {Endpoints} from './Endpoints';
import {constants} from './constants';
import {Linking, Platform} from 'react-native';
import { getAuth } from "firebase/auth";


export const getAuthToken = async (): Promise<string> => {
  try {
    const auth = getAuth();
    // console.log("THIS IS THE AUTH", auth)
    const token = await auth.currentUser?.getIdToken() ?? '';
     console.log("THIS IS THE TOKEN", token)
    return token;
  } catch (error) {
    console.error('Error getting auth token: ', error);
    throw error;
  }
};
export const customFetch = async (
  endpoint: string,
  options: {method: string; body?: any},
  attempt: number = 0,
): Promise<Response> => {
  try {
    const token: string = await getAuthToken();
    if (!token || token == '') {
      throw new Error('No auth token provided on fetch');
    }
    let res = await Promise.race([
      fetch(endpoint, {
        ...options,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), constants.TIMEOUT),
      ),
    ]);
    if (res.status === 403) {
      // authentication error
      //event.emit(eventNames.FORCE_SIGNOUT);
      throw new Error('Authentication error, signing out...');
    }
    return res;
  } catch (error: any) {
    if (
      error.message === 'Timeout' ||
      error.message === 'Network request failed'
    ) {
      if (attempt >= constants.MAX_RETRIES) {
        throw new Error(
          'There is a problem with your connection. Please try again later or contact us if this problem persists.',
        );
      } else {
        // retry
        await delay(constants.RETRY_WAIT_TIME);
        // console.log('Retrying fetch...');
        return await customFetch(endpoint, options, attempt + 1);
      }
    } else {
      throw error;
    }
  }
};

export const openTermsAndConditions = () => {
  const url = 'https://www.candornow.com/request-a-demo';
  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        return Linking.openURL(url);
      }
    })
    .catch();
};


export const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));
