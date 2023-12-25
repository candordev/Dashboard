import { createDrawerNavigator } from "@react-navigation/drawer";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import React, { useCallback, useEffect, useState } from "react";
import LHN from "../Components/LHN";
import AllScreen from "./AllScreen";
import SuggestedScreen from "./SuggestedScreen";
import YourScreen from "./YourScreen";
import InboxScreen from "./InboxScreen";
import {event, eventNames} from '../Events';
import {AppState, Pressable} from 'react-native';
import {getUnreadNotifs} from '../utils/utils';


const Drawer = createDrawerNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyBm_R9VjtEnZvsC5M0JZLO3_xNBOT38NM4",
  authDomain: "candor-9863e.firebaseapp.com",
  projectId: "candor-9863e",
  storageBucket: "candor-9863e.appspot.com",
  messagingSenderId: "230275243650",
  appId: "1:230275243650:web:401b24c1ec5628f9cf1e9b",
  measurementId: "G-DCSB46Z23D",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


function Root() {
  console.log("AABBCCDD")
  // const [unread, setUnread] = useState<number>(0);

  // useEffect(() => {
  //   // event.on(eventNames.FOREGROUND_NOTIFICATION, incrementLocal);
  //     getUnreadDB()

  // }, []);
  
  // const getUnreadDB = useCallback(async () => {
  //   try {
  //     console.log("GET UNREAD NOTIF")
  //     setUnread(await getUnreadNotifs());  
  //   } catch (err) {
  //     console.error('Error getting notification count', err);
  //   }
  // }, []);

  return (
    <Drawer.Navigator
      useLegacyImplementation={false}
      //get the route name and pass it into LHN
      drawerContent={(props) => <LHN {...props} />}
      screenOptions={{
        drawerType: "permanent",
        drawerStyle: { width: 200, borderRightWidth: 0 },
        headerShown: false,
      }}
    >
      <Drawer.Screen name="all" component={AllScreen} />
      {/* <Drawer.Screen name="your" component={YourScreen} />
      <Drawer.Screen name="suggested" component={SuggestedScreen} /> */}
      <Drawer.Screen name="inbox" component={InboxScreen} />
    </Drawer.Navigator>
  );
}

export default Root;
