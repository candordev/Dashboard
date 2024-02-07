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
import ErrorMessage from "../Components/Native/ErrorMessage";

type SignupScreenSocialProps = {
    route: any;
    navigation: any;
};

function SignupScreenSocial({
    route,
    navigation,
}: SignupScreenSocialProps): JSX.Element {
    const { passedFirstName, passedLastName, passedEmail, firebaseToken, userId, postId, groupId } =
        route.params;

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(passedEmail || "");
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [firstName, setFirstName] = useState(passedFirstName || "");
    const [lastName, setLastName] = useState(passedLastName || "");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [checkBox, setCheckBox] = useState(false);
    const [loading, setLoading] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { signupUser, error, signUpWithEmail, setError } = useSignup();


    const handleSignup = async () => {
        setLoading(true);

        // console.log("DEBUG");

        if (!checkBox) {
            setError("Please agree to our terms");
            setLoading(false);
            return;
        }

        // console.log("we got here no error so should signup");

        await signupUser(firstName, lastName, email, username.trim(), firebaseToken ?? "", "", userId, postId, groupId);
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

            const usernameValid = await validateUsername();
            const nameValid = validateName();

            // console.log(
            //     "We here boi",
            //     usernameValid,
            //     nameValid,
            // );
            if (usernameValid && nameValid) {
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
    <View style={styles.containerAkshat}>
      <View style={{ alignItems: "center", marginTop: 100, marginBottom: 10 }}>
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
          }}
        >
          Simplify Change
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ flex: 1, width: "80%", }}>
          {/* Name Input */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Container for First Name Input and Error */}
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
            <ErrorMessage
                style={{
                    fontSize: 11,
                    textAlign: "center",
                }}
                error={emailError}
            />

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
            <ErrorMessage
                style={{
                    fontSize: 11,
                    textAlign: "center",
                }}
                error={usernameError}
            />


          <View style={{ alignItems: "center", marginHorizontal: 30 }}>
          <ErrorMessage
                style={{
                    fontSize: 11,
                    textAlign: "center",
                }}
                error={error}
            />
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
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={validateFields}
            style={{
              backgroundColor: colors.black,
              padding: 10,
              borderRadius: 10,
              width: 315,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 13,
            }}
            disabled={loading} // Disable button while loading
          >
            <Text
              style={{ fontSize: 17, fontWeight: "600", color: colors.white }}
            >
              Done
            </Text>
          </TouchableOpacity>


        </View>
      </View>
    </View>
   )
}

export default SignupScreenSocial;
