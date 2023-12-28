import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import LinkButton from "../Components/LinkButton";
import Text from "../Components/Text";
import colors from "../Styles/colors";
import Button from "../Components/Button";
import { useSignup } from "../Hooks/useSignup";

const LaunchScreen = () => {
    const {error, setLoading, setError, logInWithGoogle} = useSignup();

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
                <Button
                    onPress={onGoogleButtonPress}
                    style={{ backgroundColor: colors.white }}
                    text="Continue with Google"
                >
                    <Image
                        source={require("../assets/socialIcons/google.png")}
                        style={{ height: 17, width: 17 }}
                    />
                </Button>
                <LinkButton
                    route={"/all"}
                    style={{ backgroundColor: colors.white }}
                >
                    <Image
                        source={require("../assets/socialIcons/apple.png")}
                        style={{ height: 17, width: 17 }}
                    />
                    <Text
                        style={{
                            color: colors.black,
                            fontWeight: "650",
                            fontSize: 17,
                        }}
                    >
                        Continue with Apple
                    </Text>
                </LinkButton>
                <LinkButton
                    route={"/all"}
                    style={{ backgroundColor: colors.black }}
                >
                    <Text
                        style={{
                            color: colors.white,
                            fontWeight: "650",
                            fontSize: 17,
                        }}
                    >
                        Sign up with Email
                    </Text>
                </LinkButton>
                <LinkButton
                    route={"/login"}
                    style={{ backgroundColor: colors.black }}
                >
                    <Text
                        style={{
                            color: colors.white,
                            fontWeight: "650",
                            fontSize: 17,
                        }}
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
