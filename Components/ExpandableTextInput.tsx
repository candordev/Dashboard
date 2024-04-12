import React, { useState } from "react";
import { TextInput } from "react-native";
import colors from "../Styles/colors";
import { debounce } from "lodash";
import styles from "../Styles/styles";


interface ExpandableTextInputProps {
  onInputChange: (text: string) => void;
  onSubmit: () => void;
  style: any;
}

function ExpandableTextInput(props: ExpandableTextInputProps): JSX.Element {
  const [height, setHeight] = useState(40);

  const updateFirstInputHeight = debounce((height) => {
    console.log(height);
    setHeight(height);
  }, 1); // Adjust the debounce time as needed

  return (
    <TextInput
      style={[styles.textInput, { height: Math.max(40, height) }, props.style]}
      placeholder="Add a comment..."
      placeholderTextColor={colors.gray}
      multiline={true}
      onContentSizeChange={(event) => {
        console.log("CONTENT SIZE CHANGED")
        updateFirstInputHeight(event.nativeEvent.contentSize.height);
      }}
      onChangeText={props.onInputChange}
      onSubmitEditing={props.onSubmit}
    />
  );
}

export default ExpandableTextInput;
