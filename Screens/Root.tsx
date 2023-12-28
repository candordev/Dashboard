import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LHN from "../Components/LHN";
import AllScreen from "./AllScreen";
import YourScreen from "./YourScreen";
import { useUserContext } from "../Hooks/useUserContext";

const Drawer = createDrawerNavigator();

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
