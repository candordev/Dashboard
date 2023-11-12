import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import colors from "../Styles/colors";

const DoubleTextInput = () => {
  const [heightFirstInput, setHeightFirstInput] = useState(40);
  const [heightSecondInput, setHeightSecondInput] = useState(40);

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          { height: Math.max(40, heightFirstInput), borderBottomWidth: 1 },
        ]}
        placeholder="Update Title"
        placeholderTextColor={colors.gray}
        multiline
        onContentSizeChange={(event) => {
          console.log("size set to:");
          console.log(event.nativeEvent.contentSize.height);
          setHeightFirstInput(event.nativeEvent.contentSize.height);
        }}
      />
      <TextInput
        style={[
          styles.input,
          { height: Math.max(40, heightSecondInput), borderBottomWidth: 1, borderBottomColor: "white" },
        ]}
        placeholder="Update Content"
        placeholderTextColor={colors.gray}
        multiline
        onContentSizeChange={(event) => {
          console.log("size set to:");
          console.log(event.nativeEvent.contentSize.height);
          setHeightSecondInput(event.nativeEvent.contentSize.height);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    borderColor: colors.lightgray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    borderColor: colors.lightgray,
    padding: 10,
    textAlignVertical: "top", // ensures text starts from the top
    outlineStyle: "none",
  },
});

export default DoubleTextInput;
