import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import "react-native-gesture-handler";
import LHN from "./Components/LHN";
import AllScreen from "./Screens/AllScreen";
import YourScreen from "./Screens/YourScreen";

const Drawer = createDrawerNavigator();

const linking = {
  prefixes: [
    /* your linking prefixes */
  ],
  config: {
    screens: {
      /* configuration for matching screens with paths */
      all: "all",
      your: "your",
      NotFound: "404",
    },
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("./assets/fonts/Montserrat-VariableFont_wght.ttf"),
    OpenSans: require("./assets/fonts/OpenSans-VariableFont_wdth,wght.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer linking={linking}>
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
    </NavigationContainer>
  );
}
