import React, { useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import colors from "../Styles/colors";

const ExpandableTextInput = () => {
  const [height, setHeight] = useState(40);
  return (
    <TextInput
      style={[
        styles.input,
        { height: Math.max(40, height), borderBottomWidth: 1 },
      ]}
      placeholder="Add a comment..."
      placeholderTextColor={colors.gray}
      multiline={true}
      onContentSizeChange={(event) => {
        setHeight(event.nativeEvent.contentSize.height);
      }}
    />
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
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: colors.white,
    outlineStyle: "none",
  },
});

export default ExpandableTextInput;
