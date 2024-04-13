import React, { useEffect, useState } from "react";
import { TextInput } from "react-native";
import colors from "../Styles/colors";
import { debounce } from "lodash";
import styles from "../Styles/styles";

interface ExpandableTextInputProps {
  onInputChange: (text: string) => void;
  onSubmit: () => void;
  style: any;
  value: string;
}

function ExpandableTextInput(props: ExpandableTextInputProps): JSX.Element {
  const inputRef = React.createRef<TextInput>();

  useEffect(() => {
    if (!props.value) {
      resetHeight(inputRef.current);
    }
  }, [props.value]);

  const _handleChange = (e: any) => {
    if (e) {
      e.target.style.height = 0;
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const resetHeight = (e: any) => {
    if (e) {
      e.style.height = 0;
      e.style.height = `${e.scrollHeight}px`;
    }
  };

  return (
    <TextInput
      ref={inputRef}
      style={[styles.textInput, props.style]}
      placeholder="Add a comment..."
      placeholderTextColor={colors.gray}
      multiline={true}
      onChangeText={props.onInputChange}
      blurOnSubmit={true}
      onSubmitEditing={props.onSubmit}
      onChange={_handleChange}
      value={props.value}
    />
  );
}

export default ExpandableTextInput;
