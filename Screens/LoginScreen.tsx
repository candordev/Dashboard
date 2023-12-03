import React, { useState } from "react";
import { View, TextInput, StyleSheet, Image } from "react-native";
import colors from "../Styles/colors";
import Text from "../Components/Text";
import { Link, StackActions, useNavigation } from "@react-navigation/native";
import Button from "../Components/Button";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation : any = useNavigation();

  const handleLogin = () => {
    navigation.navigate('root');
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
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.gray}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor={colors.gray}
          value={password}
          onChangeText={setPassword}
        />
        <Button
          text="Login"
          onPress={handleLogin}
          style={{ marginTop: 15, marginBottom: 5 }}
        />
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
    width: "100%",
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 15,
    marginVertical: 5,
    paddingHorizontal: 13,
    outlineStyle: "none",
  },
});

export default LoginScreen;
