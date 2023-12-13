import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import colors from "../Styles/colors";

interface DoubleTextInputProps {
  onFirstInputChange: (text: string) => void;
  onSecondInputChange: (text: string) => void;
  onSubmit: () => void;
}

function DoubleTextInput(props: DoubleTextInputProps): JSX.Element {
  const [heightFirstInput, setHeightFirstInput] = useState(40);
  const [heightSecondInput, setHeightSecondInput] = useState(40);

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          { height: Math.max(40, heightFirstInput), borderBottomWidth: 1 },
        ]}
        placeholder="Title"
        placeholderTextColor={colors.gray}
        multiline
        onContentSizeChange={(event) => {
          setHeightFirstInput(event.nativeEvent.contentSize.height);
        }}
        onChangeText={props.onFirstInputChange}
      />
      <TextInput
        style={[
          styles.input,
          { height: Math.max(40, heightSecondInput), borderBottomWidth: 1, borderBottomColor: "white" },
        ]}
        placeholder="Content"
        placeholderTextColor={colors.gray}
        // multiline
        onContentSizeChange={(event) => {
          setHeightSecondInput(event.nativeEvent.contentSize.height);
        }}
        onChangeText={props.onSecondInputChange}
        onSubmitEditing={props.onSubmit}
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
    backgroundColor: colors.white,
  },
  input: {
    borderColor: colors.lightgray,
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlignVertical: "top", // ensures text starts from the top
    outlineStyle: "none",
  },
});

export default DoubleTextInput;
