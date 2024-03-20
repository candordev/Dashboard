import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import LinkButton from "../Components/LinkButton";
import Text from "../Components/Text";
import colors from "../Styles/colors";
import { useSignup } from "../Hooks/useSignup";
import { Endpoints } from "../utils/Endpoints";
import { useDrawerProgress } from "@react-navigation/drawer";
// import { usePostId } from '../Structure/PostContext';
import { usePostContext } from "../Hooks/usePostContext";
import { useUserContext } from "../Hooks/useUserContext";
import NotificationPopup from "../Components/NotificationPopup";
import Icon from 'react-native-vector-icons/Feather';
import styles from "../Styles/styles";

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
}


type LaunchcreenProps = {
  route: any;
  navigation: any;
};

function LaunchScreen({route, navigation}: LaunchcreenProps): JSX.Element {

  const userId = route.params?.userId || '';
  const routePostId = route.params?.postId || '';
  const groupId = route.params?.groupId || '';
  const masterId = route.params?.masterId || '';
  const { state } = useUserContext();


  const { postId, setPostId } = usePostContext(); // Ensure this hook returns both postId and setPostId

  // Update postId in context when routePostId changes
  // useEffect(() => {
  //   console.log("GOT HEREEEE" )
  //   if (routePostId && routePostId !== postId) {
  //     setPostId(routePostId);
  //   }
  // }, [routePostId, postId, setPostId]);

  //http://localhost:19006/launch/undefined/6590f6dff2861756c5e1b941

  useEffect(() => {
    // console.log("Checking route for postId: ", routePostId);
    if (routePostId && routePostId !== postId) {
      setPostId(routePostId);
    }
  }, [routePostId, postId, setPostId]); // Depend on routePostId, postId, and setPostId


  useEffect(() => {
    if (postId && state.token) {
      // console.log("PostId is set, navigating to root");
      navigation.navigate('root');
    }else if(state.token){
      // console.log("no post ID but going to root")
      navigation.navigate('root');
    }
  }, [postId, state.token, navigation]); // Depend on postId and state.token





  async function onGoogleButtonPress() {
    try {
      setError('');
      setLoading(true);
      const {token, firstName, lastName, email, isLogin} =
        await logInWithGoogle();
      if (!firstName || !email || !token) {
        console.warn(
          'Missing information from Google' +
            token +
            firstName +
            lastName +
            email,
        );
        setLoading(false);
        return;
      }
      if (!isLogin) {
        // console.log("going to signupname")
        navigation.navigate('signupStack', {
            screen: 'signupsocial',
            params: {
              passedFirstName: firstName,
              passedLastName: lastName,
              passedEmail: email,
              firebaseToken: token,
              ...(userId && { userId }),
              ...(postId && { postId }),
              ...(groupId && { groupId }),
              ...(masterId && { masterId }),

            },
          });
      }
    } catch (error: any) {
      console.error(error);
      setError(String(error.message));
    } finally {
      setLoading(false);
    }
  }

  const {
    loading,
    error,
    setLoading,
    setError,
    logInWithGoogle,
    // logInWithApple,
  } = useSignup();




  async function getUserData(userId: string): Promise<UserData | null> {
    try {
      // console.log("THIS THE USER ID", userId)

      const queryParams = new URLSearchParams({ userID: userId });

      const response = await fetch(`${Endpoints.getUser}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(resJson.error);
      }

      return resJson as UserData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }


  const handleSignup = async () => {
    setError('');
    let userData: UserData | null = null;
    // console.log("THIS THE user Id", userId)
    if (userId.length > 0 && userId != '' && userId != 'undefined' && userId != null) {
      userData = await getUserData(userId);
    }

    // console.log("This the user data: ", userData)

    navigation.navigate('signupStack', {
      screen: 'signupemail',
      params: {
        ...(masterId && { masterId }),
        ...(groupId && { groupId }),
        ...(postId && { postId }),
        ...(userId && { userId }),
        ...(userData?.firstName && { firstName: userData.firstName }),
        ...(userData?.lastName && { lastName: userData.lastName }),
        ...(userData?.email && { email: userData.email }),
      },
    });
  };





  return (
    <>
    <NotificationPopup navigation={navigation}/>
    <View style={styles.purpleGeneralContainer}>
      <Text
        style={{
          fontSize: 75,
          fontWeight: "bold",
          marginBottom: 10,
          color: colors.white,
          fontFamily: "Montserrat",
        }}
      >
        Candor
      </Text>
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 40,
          color: colors.white,
          fontFamily: "Montserrat",
        }}
      >
        Simplify Change
      </Text>
      <View
        style={{
          backgroundColor: colors.purple4,
          alignItems: "center",
          minWidth: "30%",
          maxWidth: "80%",
          borderRadius: 20,
          paddingVertical: 15,
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          style={{ backgroundColor: colors.white, padding: 10, borderRadius: 10, width: '100%', alignItems: 'center', justifyContent: 'center', marginVertical: 5,
          paddingVertical: 10, flex: 1, flexDirection: 'row', columnGap: 8, marginBottom: 4}}
          onPress={onGoogleButtonPress} // Add this line
        >
          <Image
            source={require("../assets/socialIcons/google.png")}
            style={{ height: 17, width: 17 }}
          />
          <Text style={{ color: colors.black, fontWeight: "650", fontSize: 17}}>
            Continue with Google
          </Text>
      </TouchableOpacity>
        {/* <LinkButton route={"/all"} style={{ backgroundColor: colors.white }}>
          <Image
            source={require("../assets/socialIcons/apple.png")}
            style={{ height: 17, width: 17 }}
          />
          <Text
            style={{ color: colors.black, fontWeight: "650", fontSize: 17 }}
          >
            Continue with Apple
          </Text>
        </LinkButton> */}
        <TouchableOpacity
          style={{ backgroundColor: colors.black, padding: 10, borderRadius: 10, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 4, flexDirection: 'row',}}
          onPress={handleSignup} // Add this line
        >
          <View style={{alignItems: 'flex-end'}}>
            <Icon name="mail" size={20} color={colors.white} />
          </View>``
          <Text style={{ color: colors.white, fontWeight: "650", fontSize: 17}}>
            Sign up with email
          </Text>
      </TouchableOpacity>
      <TouchableOpacity
          onPress={() => navigation.navigate('login')}
          style={{ backgroundColor: colors.black, padding: 10, borderRadius: 10, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 4}}
        >
          <Text
            style={{ color: colors.white, fontWeight: "650", fontSize: 17 }}
          >
            Log in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
};

export default LaunchScreen;
