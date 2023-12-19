import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useState } from "react";
import "react-native-gesture-handler";
import NavigationWrapper from "./Structure/NavigationWrapper";
import { UserProvider } from "./Structure/UserContext";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const linking = {
  prefixes: [
    /* your linking prefixes */
  ],
  config: {
    screens: {
      /* configuration for matching screens with paths */
      root: "root",
      all: "all",
      your: "your",
      launch: "launch",
      login: "login",
      NotFound: "404",
    },
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("./assets/fonts/Montserrat-VariableFont_wght.ttf"),
    OpenSans: require("./assets/fonts/OpenSans-VariableFont_wdth,wght.ttf"),
  });

  const [loading, setLoading] = useState(true);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  // return (
  //   <NavigationContainer linking={linking}>
  //     <Stack.Navigator>
  //       <Stack.Screen
  //         name="launch"
  //         component={LaunchScreen}
  //         options={{ headerShown: false }}
  //       />
  //       <Stack.Screen
  //         name="login"
  //         component={LoginScreen}
  //         options={{ headerShown: false }}
  //       />
  //       <Stack.Screen
  //         name="root"
  //         component={Root}
  //         options={{ headerShown: false }}
  //       />
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
  return (
    <UserProvider>
      <NavigationWrapper />
    </UserProvider>
  );
}
