import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import LinkButton from "../Components/LinkButton";
import Text from "../Components/Text";
import colors from "../Styles/colors";
import { useSignup } from "../Hooks/useSignup";

type LaunchcreenProps = {
  route: any;
  navigation: any;
};

function LaunchScreen({route, navigation}: LaunchcreenProps): JSX.Element {

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
        console.log("NEED TO SIGN UP..");
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

  const handleSignup = () => {
    setError('');
    navigation.navigate('signupStack');
  };



  return (
    <View style={styles.container}>
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
          width: "30%",
          borderRadius: 20,
          paddingVertical: 15,
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity style={{ backgroundColor: colors.white }} onPress={onGoogleButtonPress}>
          <Image
            source={require("../assets/socialIcons/google.png")}
            style={{ height: 17, width: 17 }}
          />
          <Text
            style={{ color: colors.black, fontWeight: "650", fontSize: 17 }}
          >
            Continue with Google
          </Text>
        </TouchableOpacity>
        <LinkButton route={"/all"} style={{ backgroundColor: colors.white }}>
          <Image
            source={require("../assets/socialIcons/apple.png")}
            style={{ height: 17, width: 17 }}
          />
          <Text
            style={{ color: colors.black, fontWeight: "650", fontSize: 17 }}
          >
            Continue with Apple
          </Text>
        </LinkButton>
        <TouchableOpacity
          style={{ backgroundColor: colors.black, padding: 10, borderRadius: 10, width: '100%', alignItems: 'center', justifyContent: 'center'}}
          onPress={handleSignup} // Add this line
        >
          <Text style={{ color: colors.white, fontWeight: "650", fontSize: 17}}>
            Sign up with Email
          </Text>
      </TouchableOpacity>
      <TouchableOpacity
          onPress={() => navigation.navigate('login')}
          style={{ backgroundColor: colors.black, padding: 10, borderRadius: 10, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 4}}
        >
          <Text
            style={{ color: colors.white, fontWeight: "650", fontSize: 17 }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.purple,
    paddingBottom: 100,
  },
  input: {
    width: "60%",
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
    outlineStyle: "none",
  },
});

export default LaunchScreen;
