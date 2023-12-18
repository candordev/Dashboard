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
import SuggestedScreen from "./SuggestedScreen"
import {CategoriesStateType, setCategories} from '../Structure/CategoriesContext';
import {useCategoryContext} from '../Hooks/useCategoryContext';


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
        const {
          categoriesState,
          categoriesDispatch,
        }: {categoriesState: CategoriesStateType; categoriesDispatch: any} = useCategoryContext();

        useEffect(() => {
          console.log("INFNITE LOOP F")
          setCategories(categoriesDispatch);
        }, []);

        console.log("THESE ARE THE YYUU: ", categoriesState.categories)

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
        <Drawer.Screen name="suggested" component={SuggestedScreen} />
      </Drawer.Navigator>
  );
}

export default Root;
