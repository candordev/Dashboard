import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LHN from "../Components/LHN";
import AllScreen from "./AllScreen";
import YourScreen from "./YourScreen";
import LaunchScreen from "./LaunchScreen";
import { useLogin } from "../Hooks/useLogin";
import { getAuth } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const Drawer = createDrawerNavigator();


const firebaseConfig = {
  apiKey: "AIzaSyBm_R9VjtEnZvsC5M0JZLO3_xNBOT38NM4",
  authDomain: "candor-9863e.firebaseapp.com",
  projectId: "candor-9863e",
  storageBucket: "candor-9863e.appspot.com",
  messagingSenderId: "230275243650",
  appId: "1:230275243650:web:401b24c1ec5628f9cf1e9b",
  measurementId: "G-DCSB46Z23D"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function Root() {

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
        <Drawer.Screen name="your" component={YourScreen} />
      </Drawer.Navigator>
  );
}

export default Root;
