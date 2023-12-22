import React, { useState } from "react";
import { View, TextInput, StyleSheet, Image } from "react-native";
import colors from "../Styles/colors";
import Text from "../Components/Text";
import { Link, useNavigation } from "@react-navigation/native";
import Button from "../Components/Button";
//import auth from '@react-native-firebase/auth';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";




const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation : any = useNavigation();

  const handleLogin = async () => {
    const initialAuthState = getAuth().currentUser;
    console.log("Initial Auth State:", initialAuthState);
    setLoading(true);
    setError("");
    try {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("This is the user credentials", userCredential)
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
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {/* Include loading state and other UI components */}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    // ... Other styling for error text
  },
  
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
