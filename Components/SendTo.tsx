import React from "react";
import { Pressable, TextInput, View, StyleSheet } from "react-native";

import colors from "../Styles/colors";

import Text from "./Text";

const SendTo = () => {
  return (
    <View
      style={{
        borderColor: colors.lightestgray,
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        rowGap: 10,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "550",
          fontFamily: "Montserrat",
        }}
      >
        Send to:
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter emails separated by commas"
        placeholderTextColor={colors.gray}
        multiline={true}
      />
      <Pressable
        style={{
          backgroundColor: colors.purple,
          borderRadius: 10,
          paddingVertical: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Montserrat",
            color: colors.white,
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          Send
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: colors.lightgray,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    outlineStyle: "none",
  },
});

export default SendTo;
