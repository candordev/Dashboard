import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useLogin } from "../Hooks/useLogin";
import { useUserContext } from "../Hooks/useUserContext";
import Root from "../Screens/Root";
// import YourScreen from "../Screens/YourScreen";
import { useNavigationContainerRef } from "@react-navigation/native";
import { useSignup } from "../Hooks/useSignup";
import LaunchScreen from "../Screens/LaunchScreen";
import LoginScreen from "../Screens/LoginScreen";
import SignupStack from "../Screens/SignupStack";
import ChatsScreen from "../Screens/ChatsScreen";

const Stack = createStackNavigator();

function NavigationWrapper() {
  const navigationRef = useNavigationContainerRef();
  const { isSignupOperation } = useSignup();
  const { state, dispatch } = useUserContext();
  const { loginUser } = useLogin();
  // const navigation = useNavigation();

  useEffect(() => {
    // // console.log("INFNITE LOOP H");
    // // console.log("Component is initially rendered in the DOM");
    // Your code here
  }, []); // The empty dependency array ensures it runs only once

  // Set an initializing state while Firebase connects
  const [loading, setLoading] = React.useState(true);

  // Handle user state changes
  async function onAuthStateChangedCallback(authUser: User | null) {
    console.log("onAuthStateChangedCallback", authUser);

    if (authUser && authUser != null && !isSignupOperation) {
      try {
        // console.log("IS SIGNUP OPERATION RAN");
        // Retrieve user token
        const token = await authUser.getIdToken();
        // console.log("found token", token);

        // Log in user with the obtained token
        await loginUser({ token: token });
      } catch (e) {
        console.error(e);
        // Handle login error if needed
      }
    }
    setLoading(false); // Set loading to false once authentication is checked
  }

  // Check for authentication state changes
  useEffect(() => {
    const auth = getAuth();
    // console.log("The auth changed", auth);
    const unsubscribe = onAuthStateChanged(auth, onAuthStateChangedCallback);

    return () => {
      // Unsubscribe when component unmounts
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <>{/* You can add a loading indicator here */}</>;
  }

  const linking = {
    prefixes: [
      "http://localhost:19006",
      "https://candorteam.netlify.app",
      "https://www.dashboard.candornow.com",
      /* your linking prefixes */
    ],
    config: {
      screens: {
        /* configuration for matching screens with paths */
        root: "root",
        all: "all",
        settings: "settings",
        phoneSettings: "phoneSettings",
        support: "support",
        // your: "your",
        // suggested: "suggested",
        inbox: "inbox",
        launch: "launch/:userId?/:postId?/:groupId?/:masterId?",
        login: "login",
        groupSettings: "groupSettings",
        chats: "chats",
        trainChat: "trainChat",
        chatInsights: "chatInsights",
        master: "master",
        leads: "leads",
        NotFound: "404",
      },
    },
  };

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="launch" component={LaunchScreen} /> */}
        {state.token ? (
          <>
            <Stack.Screen name="launch" component={LaunchScreen} />
            <Stack.Screen name="root" component={Root} />
            <Stack.Screen name="chats" component={ChatsScreen} /> 
          </>
        ) : (
          <>
            <Stack.Screen name="launch" component={LaunchScreen} />
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen
              name="signupStack"
              component={SignupStack}
              options={{ headerShown: false }}
            />
            {/* <Stack.Screen name="all" component={AllScreen} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NavigationWrapper;
