import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";

type ChatLinkButtonProps = {
    navigation: any;
    sessionId: string;
  };

const ChatLinkButton = ({ navigation, sessionId }: ChatLinkButtonProps): JSX.Element => {

  async function handlePress() {
    navigation.navigate('chats', { sessionId });
  }

  return (
    <View style={{ rowGap: 10 }}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>
            Go To Chat
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.purple,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Montserrat",
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ChatLinkButton;
