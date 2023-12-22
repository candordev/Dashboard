import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import SignupScreenEmailDob from './SignupScreenEmailDob';
// import SignupScreenLocation from './SignupScreenLocation';
// import SignupScreenName from './SignupScreenName';
// import SignupScreenPassword from './SignupScreenPassword';
// import SignupScreenUsername from './SignupScreenUsername';

const Stack = createStackNavigator();

function SignupStack(): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
      })}>
      <Stack.Screen name="signupemail" component={SignupScreenEmailDob} />
      {/* <Stack.Screen name="signupname" component={SignupScreenName} /> */}
      {/* <Stack.Screen name="signupusername" component={SignupScreenUsername} /> */}
      {/* <Stack.Screen name="signuplocation" component={SignupScreenLocation} /> */}
      {/* <Stack.Screen name="signuppassword" component={SignupScreenPassword} /> */}
      {/* <Stack.Screen name="oldLogin" component={OldLogin} />
      <Stack.Screen name="mergeScreen" component={MergeScreen} />
      <Stack.Screen name="forgotPassword" component={ForgotPassword} /> */}
      {/* <Stack.Screen name="location" component={GetLocation} /> */}
    </Stack.Navigator>
  );
}

export default SignupStack;
