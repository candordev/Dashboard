import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import colors from "../Styles/colors";
import Text from "../Components/Text";
import { Link } from "@react-navigation/native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Perform login logic here
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: colors.purple,
          flex: 1,
          height: "100%",
          alignItems: "center",
          paddingTop: 100,
        }}
      >
        <Text
          style={{
            fontSize: 60,
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

        <LinkButton route={"/all"} style={{ backgroundColor: colors.white }}>
          <Text style={{ color: colors.black, fontWeight: '600', fontSize: 17 }}>Continue with Google</Text>
        </LinkButton>
        <LinkButton route={"/all"} style={{ backgroundColor: colors.white }}>
          <Text style={{ color: colors.black, fontWeight: '600', fontSize: 17 }}>Continue with Apple</Text>
        </LinkButton>
        <LinkButton route={"/all"} style={{ backgroundColor: colors.black }}>
          <Text style={{ color: colors.white, fontWeight: '600', fontSize: 17 }}>Sign up with Email</Text>
        </LinkButton>
        <LinkButton route={"/all"} style={{ backgroundColor: colors.black }}>
          <Text style={{ color: colors.white, fontWeight: '600', fontSize: 17 }}>Login</Text>
        </LinkButton>
      </View>
      <View
        style={{ backgroundColor: colors.black, flex: 1, height: "100%" }}
      ></View>
    </View>
  );
};

type LinkButtonProps = {
  route: string;
  style: any;
  children: React.ReactNode;
};

const LinkButton = ({ route, style, children }: LinkButtonProps) => {
  return (
    <Link to={"/all"} style={{ width: "60%" }}>
      <View
        style={[
          {
            marginBottom: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,
            flexDirection: "row" as any,
            alignItems: "center" as any,
            justifyContent: 'center' as any,
            columnGap: 10,
            backgroundColor: colors.white,
            width: "100%",
            height: 40,
            borderRadius: 10,
          },
          style,
        ]}
      >
        {children}
      </View>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
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

export default LoginScreen;
