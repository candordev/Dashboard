import { fetchSignInMethodsForEmail, getAuth } from "firebase/auth";
import React, { useState } from "react";
import { Pressable, TextInput, TouchableOpacity, View } from "react-native";
import Text from "../Components/Text";

import { useSignup } from "../Hooks/useSignup";
import colors from "../Styles/colors";
import styles from "../Styles/styles";
import { Endpoints } from "../utils/Endpoints";
import { openTermsAndConditions } from "../utils/utils";
import FeatherIcon from "react-native-vector-icons/Feather";
import Button from "../Components/Button";

type SignupScreenEmailDobProps = {
  route: any;
  navigation: any;
};

function SignupScreenEmailDob({
  route,
  navigation,
}: SignupScreenEmailDobProps): JSX.Element {
  const {
    masterId,
    groupId,
    postId,
    userId,
    firstName: initialFirstName,
    lastName: initialLastName,
    email: initialEmail,
  } = route.params;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(initialEmail || "");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [firstName, setFirstName] = useState(initialFirstName || "");
  const [lastName, setLastName] = useState(initialLastName || "");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [checkBox, setCheckBox] = useState(false);
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState([
    colors.white,
    colors.white,
    colors.white,
    colors.white,
    colors.white,
    colors.white,
  ]);

  const { signupUser, error, signUpWithEmail, setError } = useSignup();

  const updatePassword = (inputPassword: string) => {
    let arr = [...passwordError];

    if (inputPassword.length >= 8) {
      arr[0] = colors.white;
    } else {
      arr[0] = colors.red;
    }

    if (/[A-Z]/.test(inputPassword)) {
      arr[1] = colors.white;
    } else {
      arr[1] = colors.red;
    }

    if (/[a-z]/.test(inputPassword)) {
      arr[2] = colors.white;
    } else {
      arr[2] = colors.red;
    }

    if (/\d/.test(inputPassword)) {
      arr[3] = colors.white;
    } else {
      arr[3] = colors.red;
    }

    if (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g.test(inputPassword)) {
      arr[4] = colors.white;
    } else {
      arr[4] = colors.red;
    }

    if (inputPassword == confirmPassword) {
      arr[5] = colors.white;
    } else {
      arr[5] = colors.red;
    }

    setPasswordError(arr);

    setPassword(inputPassword);
  };

  const updateConfirmPassword = (inputPassword: string) => {
    let arr = [...passwordError];

    if (inputPassword == password) {
      arr[5] = colors.white;
    } else {
      arr[5] = colors.red;
    }

    setPasswordError(arr);

    setConfirmPassword(inputPassword);
  };

  const handleSignup = async () => {
    setLoading(true);

    // console.log("DEBUG");

    if (passwordError.some((color) => color !== colors.white)) {
      setError("Please fulfill the password requirements below");
      setLoading(false);
      return;
    } else if (!checkBox) {
      setError("Please agree to our terms");
      setLoading(false);
      return;
    }

    // console.log("we got here no error so should signup");

    const token: string | undefined = await signUpWithEmail(email, password);

    await signupUser(
      firstName,
      lastName,
      email,
      username,
      token ?? "",
      "",
      userId,
      postId,
      groupId,
      masterId
    );
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const verifyPassword = async () => {
    // console.log("The colors", passwordError);
    if (passwordError.some((color) => color !== colors.white)) {
      setError("Please fulfill the password requirements below");
      setLoading(false);
      return false;
    } else if (!checkBox) {
      setError("Please agree to our terms");
      setLoading(false);
      return false;
    }
    return true;
  };

  const validateFields = async () => {
    try {
      setLoading(true);
      setEmailError("");
      setUsernameError("");
      setFirstNameError("");
      setLastNameError("");
      setError("");
      //   setFormError('');

      const emailValid = await doesEmailExistFirebase();
      const usernameValid = await validateUsername();
      const nameValid = validateName();
      const passwordValid = await verifyPassword();
      // console.log("username error", passwordValid);

      // console.log(
      //   "We here boi",
      //   emailValid,
      //   usernameValid,
      //   nameValid,
      //   passwordValid
      // );
      if (emailValid && usernameValid && nameValid && passwordValid) {
        // console.log("We here boi Ayy");
        handleSignup();
      }

      //   else {
      //     setFormError('Please correct the errors before proceeding.');
      //   }
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateUsername = async () => {
    setUsernameError("");
    setLoading(true);

    try {
      let res = await fetch(
        Endpoints.validUsername +
          new URLSearchParams({
            username: username.trim(),
          }),
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      let resJson = await res.json();
      setLoading(false);
      if (!res.ok) {
        setUsernameError("Invalid username");
        setLoading(false);
        return false;
      }
      if (res.ok) {
        setLoading(false);
        return true;
      }
    } catch (error) {
      setLoading(false);
      setUsernameError(String(error));
      return false;
    }
  };

  const doesEmailExistFirebase = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      setLoading(false);

      if (signInMethods.length) {
        // Email is taken, set the appropriate error
        if (signInMethods.includes("google.com")) {
          setEmailError(
            "This email is taken. Please sign in with Google or try a different email."
          );
        } else if (signInMethods.includes("apple.com")) {
          setEmailError(
            "This email is taken. Please sign in with Apple or try a different email."
          );
        } else {
          setEmailError(
            "This email is taken. Please log in or try a different email."
          );
        }
        return false;
      }

      return true; // Email is not taken
    } catch (error) {
      setLoading(false);
      setEmailError("That email address is invalid!");
      return false;
    }
  };

  const validateName = () => {
    let isValid = true;
    if (firstName.trim().length === 0) {
      setFirstNameError("Please enter your first name");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    if (lastName.trim().length === 0) {
      setLastNameError("Please enter your last name");
      isValid = false;
    } else {
      setLastNameError("");
    }

    return isValid;
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: colors.purple,
      }}
    >
      <Text
        style={{
          fontSize: 75,
          fontWeight: "bold",
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
          color: colors.white,
          fontFamily: "Montserrat",
          marginBottom: 20,
        }}
      >
        Simplify Change
      </Text>
      <View style={{ width: "30%", alignItems: "center" }}>
        {/* First Name Input */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View style={{ flex: 1, marginRight: 10, marginBottom: 5 }}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor={colors.lightgray}
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  setFirstNameError("");
                }}
              />
            </View>
            <Text
              style={{
                position: "absolute", // Position absolute
                bottom: -20, // Adjust this value as needed
                left: 0,
                right: 0,
                color: firstNameError ? colors.red : "transparent",
                fontSize: 11,
                textAlign: "center",
                height: 35, // Increase height as needed
              }}
            >
              {firstNameError || null}
            </Text>
          </View>

          {/* Container for Last Name Input and Error */}
          <View style={{ flex: 1, marginBottom: 5 }}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor={colors.lightgray}
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  setLastNameError("");
                }}
              />
            </View>
            <Text
              style={{
                position: "absolute", // Position absolute
                bottom: -20, // Adjust this value as needed
                left: 0,
                right: 0,
                color: lastNameError ? colors.red : "transparent",
                fontSize: 11,
                textAlign: "center",
                height: 35, // Increase height as needed
              }}
            >
              {lastNameError || " "}
            </Text>
          </View>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={colors.lightgray}
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
            }}
            autoFocus={true}
            autoCapitalize="none"
          />
        </View>
        <Text
          style={{
            position: "absolute", // Position absolute
            bottom: -20, // Adjust this value as needed
            left: 0,
            right: 0,
            color: emailError ? colors.red : "transparent",
            fontSize: 11,
            textAlign: "center",
            height: 448, // Increase height as needed
          }}
        >
          {emailError || " "}
        </Text>
        {/* Username Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={colors.lightgray}
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError("");
            }}
          />
        </View>
        <Text
          style={{
            position: "absolute", // Position absolute
            bottom: -20, // Adjust this value as needed
            left: 0,
            right: 0,
            color: usernameError ? colors.red : "transparent",
            fontSize: 11,
            textAlign: "center",
            height: 389, // Increase height as needed
          }}
        >
          {usernameError || " "}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={colors.lightgray}
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={updatePassword}
            secureTextEntry={!showPassword}
            autoFocus={true}
          />
          <Pressable onPress={toggleShowPassword} style={{ padding: 12 }}>
            {showPassword ? (
              <FeatherIcon name={"eye-off"} size={20} color={colors.gray} />
            ) : (
              <FeatherIcon name={"eye"} size={20} color={colors.gray} />
            )}
          </Pressable>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={colors.lightgray}
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={updateConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <Pressable
            onPress={toggleShowConfirmPassword}
            style={{ padding: 12 }}
          >
            {showConfirmPassword ? (
              <FeatherIcon name={"eye-off"} size={20} color={colors.gray} />
            ) : (
              <FeatherIcon name={"eye"} size={20} color={colors.gray} />
            )}
          </Pressable>
        </View>
        <Text
          style={{
            position: "absolute", // Position absolute
            bottom: -20, // Adjust this value as needed
            left: 0,
            right: 0,
            color: error ? colors.red : "transparent",
            fontSize: 11,
            textAlign: "center",
            height: 205, // Increase height as needed
          }}
        >
          {error || " "}
        </Text>

        <View style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={checkBox}
              onChange={(e) => setCheckBox(e.target.checked)}
              style={
                {
                  /* your styles here */
                }
              }
            />
            <Pressable onPress={openTermsAndConditions}>
              <Text
                style={{
                  marginLeft: 10,
                  color: colors.white,
                  fontSize: 15,
                  textAlign: "left",
                }}
              >
                Please agree to our terms{" "}
                <Text
                  style={{
                    color: colors.white,
                    textDecorationLine: "underline",
                  }}
                >
                  here
                </Text>
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={{}}>
          <Text
            style={{
              color: colors.white,
              fontSize: 15,
              //textAlign: 'left',
              marginLeft: -20,
            }}
          >
            Passwords must contain:
          </Text>
          <View>
            <Text style={{ color: passwordError[0], fontSize: 15 }}>
              8 characters
            </Text>
            <Text style={{ color: passwordError[1], fontSize: 15 }}>
              1 uppercase
            </Text>
            <Text style={{ color: passwordError[2], fontSize: 15 }}>
              1 lowercase
            </Text>
            <Text style={{ color: passwordError[3], fontSize: 15 }}>
              1 number
            </Text>
            <Text style={{ color: passwordError[4], fontSize: 15 }}>
              1 special character
            </Text>
            <Text style={{ color: passwordError[5], fontSize: 15 }}>
              Passwords match
            </Text>
          </View>
        </View>

        <Button
          text="Sign Up"
          onPress={validateFields}
          style={{ marginTop: 10, width: "100%" }}
          loading={loading}
        />
      </View>
    </View>
  );
}

export default SignupScreenEmailDob;
