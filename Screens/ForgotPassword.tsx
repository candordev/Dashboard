import React, { useState } from "react";
import { TextInput, View, StyleSheet, Pressable } from "react-native";
import Button from "../Components/Button";
import Text from "../Components/Text";
import colors from "../Styles/colors";
import styles from "../Styles/styles";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

type Props = {
    route: any;
    navigation: any;
};

function ForgotPassword({ route, navigation }: Props): JSX.Element {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = getAuth();

    const forgotPassword = async () => {
        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, email);
            // errorModalDispatch({
            //     type: "OPEN_MODAL",
            //     payload: {
            //         title: "Password Reset Email Sent",
            //         content: "Please check your email to reset your password.",
            //         buttonText: "Okay",
            //     },
            // });
            navigation.navigate("launch");
        } catch (error: any) {
            if (
                error.code === "auth/invalid-email" ||
                error.code === "auth/user-not-found"
            ) {
                setError("That email address is invalid!");
            } else {
                setError(String(error));
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
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
                <View style={{width: "100%"}}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "normal",
                            marginBottom: 10,
                            color: colors.white,
                            fontFamily: "Montserrat",
                            textAlign: "left",
                        }}
                    >
                        Forgot password?
                    </Text>
                </View>
                <View style={currStyles.inputContainer}>
                    <TextInput
                        style={currStyles.input}
                        placeholder="Email"
                        placeholderTextColor={colors.gray}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <Button
                    text="Next"
                    onPress={forgotPassword}
                    style={{ marginTop: 10, marginBottom: 5 }}
                />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {/* Include loading state and other UI components */}
        </View>
    );
}

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

export default ForgotPassword;
