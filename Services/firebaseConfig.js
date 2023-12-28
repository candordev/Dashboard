import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { initializeAuth } from "firebase/auth";
import { auth } from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBm_R9VjtEnZvsC5M0JZLO3_xNBOT38NM4",
  authDomain: "candor-9863e.firebaseapp.com",
  // databaseURL: 'https://project-id.firebaseio.com',
  projectId: "candor-9863e",
  storageBucket: "candor-9863e.appspot.com",
  messagingSenderId: "230275243650",
  appId: "1:230275243650:web:401b24c1ec5628f9cf1e9b",
  measurementId: "G-DCSB46Z23D"
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// const auth = initializeAuth(app, {
//   // persistence: getReactNativePersistence(AsyncStorage),
// });

export const authFB = getAuth();

// export { app, auth }
