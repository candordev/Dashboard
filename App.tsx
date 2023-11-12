import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./Components/Header";
import AllScreen from "./Screens/AllScreen";
import YourScreen from "./Screens/YourScreen";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from "react";

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
    'Montserrat': require('./assets/fonts/Montserrat-VariableFont_wght.ttf'),
    "Open-Sans": require("./assets/fonts/OpenSans-VariableFont_wdth,wght.ttf"),
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
      <Stack.Navigator
        initialRouteName="all"
        screenOptions={({ navigation, route }) => ({
          header: (props) => <Header {...props} />,
        })}
      >
        <Stack.Screen name="all" component={AllScreen} />
        <Stack.Screen name="your" component={YourScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
