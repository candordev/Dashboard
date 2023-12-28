import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import "react-native-gesture-handler";
import LHN from "./Components/LHN";
import AllScreen from "./Screens/AllScreen";
import YourScreen from "./Screens/YourScreen";
import { createStackNavigator } from "@react-navigation/stack";
import LaunchScreen from "./Screens/LaunchScreen";
import Root from "./Screens/Root";
import LoginScreen from "./Screens/LoginScreen";
import { UserProvider } from "./Structure/UserContext";
import { useUserContext } from "./Hooks/useUserContext";
import { getIdToken, onAuthStateChanged } from "firebase/auth";

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

    const { state, dispatch } = useUserContext();
    const [loading, setLoading] = useState(true);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    // Handle user state changes
    async function myOnAuthStateChanged(user: any) {
        let token = "";
        // console.log('User at open app is:', user);
        if (user && user != null) {
            try {
                token = await user.getIdToken();
                // await loginUser({token: token});
            } catch (e) {
                console.error(e);
            }
        }
        setLoading(false); // error so go to signup screen
    }

    // useEffect(() => {
    //     if (!state?.token) {
    //         // Alert.alert("no auth token found");
    //         return;
    //     }
    // }, [state.token]);

    // useEffect(() => {
    //     const subscriber = myOnAuthStateChanged(onAuthStateChanged);
    //     return subscriber; // unsubscribe on unmount
    // }, []);

    return (
        <UserProvider>
            <NavigationContainer linking={linking}>
                <Stack.Navigator>
                    {!state || state.token == null ? (
                        <>
                            <Stack.Screen
                                name="launch"
                                component={LaunchScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="login"
                                component={LoginScreen}
                                options={{ headerShown: false }}
                            />
                        </>
                    ) : (
                        <>
                            <Stack.Screen
                                name="root"
                                component={Root}
                                options={{ headerShown: false }}
                            />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </UserProvider>
    );
}
