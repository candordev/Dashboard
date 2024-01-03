import React, { useState } from "react";
import { TextInput } from "react-native";
import colors from "../Styles/colors";
import styles from "../Styles/styles";

interface ExpandableTextInputProps {
  onInputChange: (text: string) => void;
  onSubmit: () => void;
}

function ExpandableTextInput(props: ExpandableTextInputProps): JSX.Element {
  const [height, setHeight] = useState(40);
  return (
    <TextInput
      style={[styles.textInput, { height: Math.max(40, height) }]}
      placeholder="Add a comment..."
      placeholderTextColor={colors.gray}
      multiline={true}
      onContentSizeChange={(event) => {
        setHeight(event.nativeEvent.contentSize.height);
      }}
      onChangeText={props.onInputChange}
      onSubmitEditing={props.onSubmit}
    />
  );
}

export default ExpandableTextInput;
