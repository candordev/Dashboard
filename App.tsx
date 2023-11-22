import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import "react-native-gesture-handler";
import AllScreen from "./Screens/AllScreen";
import YourScreen from "./Screens/YourScreen";
import { View } from "react-native";
import colors from "./Styles/colors";
import Header from "./Components/Header";
import LHN from "./Components/LHN";

const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();

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
        drawerContent={() => <LHN />}
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
