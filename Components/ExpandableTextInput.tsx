import React, { useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import colors from "../Styles/colors";
import { debounce } from "lodash";

interface ExpandableTextInputProps {
  onInputChange: (text: string) => void;
  onSubmit: () => void;
}

function ExpandableTextInput(props: ExpandableTextInputProps): JSX.Element {
  const [height, setHeight] = useState(40);


  const updateFirstInputHeight = debounce((height) => {
    setHeight(height);
  }, 1); // Adjust the debounce time as needed




  return (
    <TextInput
      style={[
        styles.input,
        { height: Math.max(40, height)},
      ]}
      placeholder="Add a comment..."
      placeholderTextColor={colors.gray}
      multiline={true}
      onContentSizeChange={(event) => {
        updateFirstInputHeight(event.nativeEvent.contentSize.height);
      }}
      onChangeText={props.onInputChange}
      onSubmitEditing={props.onSubmit}
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
    backgroundColor: colors.white,
    outlineStyle: "none",
  },
});

export default ExpandableTextInput;
