// import messaging from '@react-native-firebase/messaging';
import {NotificationData, NotificationType} from '../utils/interfaces';
import {Endpoints} from './Endpoints';
import {constants} from './constants';
import {Linking, Platform} from 'react-native';

export const customFetch = async (
  endpoint: string,
  options: {method: string; body?: any},
  attempt: number = 0,
  multiPart: boolean = false,
): Promise<Response> => {
  try {
    const adminPassword: String = getAdminPassword();
    if (!adminPassword || adminPassword == '') {
      throw new Error('No admin password provided on fetch');
    }
    // console.log('Fetching from: ', endpoint, options);
    let headers : any = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (multiPart) {
      headers = {
        'Content-Type': 'multipart/form-data',
      };
    }
    options.body.adminPassword = adminPassword;
    let res = await Promise.race([
      fetch(endpoint, {
        ...options,
        headers: headers
      }),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), constants.TIMEOUT),
      ),
    ]);
    if (res.status === 403) {
      // authentication error
      // event.emit(eventNames.FORCE_SIGNOUT);
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
        console.log('Retrying fetch...');
        return await customFetch(endpoint, options, attempt + 1, true);
      }
    } else {
      throw error;
    }
  }
};

const getAdminPassword = (): String => {
  return constants.ADMIN_PASSWORD;
}

export const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));
