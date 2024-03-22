import React, { useState } from "react";
import { View, TextInput, StyleSheet, Image, Pressable } from "react-native";
import colors from "../Styles/colors";
import Text from "../Components/Text";
import { Link, useNavigation } from "@react-navigation/native";
import Button from "../Components/Button";
//import auth from '@react-native-firebase/auth';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Icon from "react-native-vector-icons/Feather";
import styles from "../Styles/styles";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation: any = useNavigation();

  const handleForgotPassword = () => {
    setError("");
    navigation.navigate("signupStack", { screen: "forgotPassword" });
  };

  const handleLogin = async () => {
    const initialAuthState = getAuth().currentUser;
    console.log("Initial Auth State:", initialAuthState);
    setLoading(true);
    setError("");
    try {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("This is the user credentials", userCredential);
          const newState = getAuth().currentUser;
          console.log("New State:", newState);
          // Signed in

          const user = userCredential.user;
          //navigation.navigate('root'); // Navigate to the desired screen
          // ...
        })
        .catch((error) => {
          setError(error.message); // Update the error message
        });
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
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
          width: "30%",
          borderRadius: 20,
          paddingVertical: 15,
          paddingHorizontal: 20,
        }}
      >
        <View style={currStyles.inputContainer}>
          <TextInput
            style={currStyles.input}
            placeholder="Email"
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={currStyles.inputContainer}>
          <TextInput
            style={currStyles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            placeholderTextColor={colors.gray}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={toggleShowPassword} style={{ padding: 12 }}>
            <Icon
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={colors.lightgray}
            />
          </Pressable>
        </View>
        <Pressable
          style={{
            paddingVertical: 5,
            marginLeft: 5,
            alignSelf: "flex-start",
          }}
          onPress={handleForgotPassword}
        >
          <Text
            style={{
              fontSize: 14,
              color: colors.lightestgray,
              fontWeight: "500",
            }}
          >
            Forgot your password?
          </Text>
        </Pressable>
        <Button
          text="Login"
          onPress={handleLogin}
          style={{ marginTop: 10, marginBottom: 5, width: "100%"}}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {/* Include loading state and other UI components */}
    </View>
  );
};

const currStyles = StyleSheet.create({
  input: {
    width: "100%",
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 15,
    outlineStyle: "none",
    paddingTop: 3,
    paddingHorizontal: 13,
  },
  inputContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 15,
    outlineStyle: "none",
    height: 40,
    marginVertical: 5,
  },
});

export default LoginScreen;
