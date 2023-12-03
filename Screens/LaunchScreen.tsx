import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import LinkButton from "../Components/LinkButton";
import Text from "../Components/Text";
import colors from "../Styles/colors";

const LaunchScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Perform login logic here
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
        <LinkButton route={"/all"} style={{ backgroundColor: colors.white }}>
          <Image
            source={require("../assets/socialIcons/google.png")}
            style={{ height: 17, width: 17 }}
          />
          <Text
            style={{ color: colors.black, fontWeight: "650", fontSize: 17 }}
          >
            Continue with Google
          </Text>
        </LinkButton>
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
        <LinkButton route={"/all"} style={{ backgroundColor: colors.black }}>
          <Text
            style={{ color: colors.white, fontWeight: "650", fontSize: 17 }}
          >
            Sign up with Email
          </Text>
        </LinkButton>
        <LinkButton route={"/login"} style={{ backgroundColor: colors.black }}>
          <Text
            style={{ color: colors.white, fontWeight: "650", fontSize: 17 }}
          >
            Login
          </Text>
        </LinkButton>
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
