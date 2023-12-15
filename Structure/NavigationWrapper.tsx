import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useUserContext } from '../Hooks/useUserContext';
import { useLogin } from '../Hooks/useLogin';
import Root from '../Screens/Root';
import LoginScreen from '../Screens/LoginScreen';
import LaunchScreen from '../Screens/LaunchScreen';
import {useSignout} from '../Hooks/useSignout';
import SignupStack from '../Screens/SignupStack';
import { useSignup } from '../Hooks/useSignup';




const Stack = createNativeStackNavigator();



function NavigationWrapper() {
  const { isSignupOperation } = useSignup();
  const { state, dispatch } = useUserContext();
  const { loginUser } = useLogin();

  useEffect(() => {
    console.log('Component is initially rendered in the DOM');
    // Your code here
  }, []); // The empty dependency array ensures it runs only once


  // Set an initializing state while Firebase connects
  const [loading, setLoading] = React.useState(true);

  

  // Handle user state changes
  async function onAuthStateChangedCallback(authUser: User | null) {
    console.log('onAuthStateChangedCallback', authUser);

    if (authUser && authUser != null && !isSignupOperation) {
      try {
        console.log("THIS WAS CALLED AYY")
        // Retrieve user token
        const token = await authUser.getIdToken();
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
    console.log("Atleast called")
    const auth = getAuth();
    console.log("The auth changed", auth)
    const unsubscribe = onAuthStateChanged(auth, onAuthStateChangedCallback);

    return () => {
      // Unsubscribe when component unmounts
      unsubscribe();
    };
  }, []);



  if (loading) {
    return <>{/* You can add a loading indicator here */}</>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.token ? (
          // If authenticated, show the Root screen
          <Stack.Screen name="root" component={Root} />
        ) : (
          // If not authenticated, show the LoginScreen
          <>
          <Stack.Screen name="launch" component={LaunchScreen} />
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen
                name="signupStack"
                component={SignupStack}
                options={() => ({
                  headerShown: false,
                  animation: 'slide_from_bottom',
                })}
              />
        </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );

}

export default NavigationWrapper;
