//TODO: Kind of tough, make this text input generalizable for comment box

import React, { forwardRef, useImperativeHandle } from "react";
import { TextInput, TextInputProps } from "react-native";
import colors from "../../Styles/colors";

interface CustomTextInputProps extends TextInputProps {
  // Add any additional props specific to your custom TextInput component
}

export interface CustomTextInputRef {
  // Add any methods or properties you want to expose to the parent component
  focus: () => void;
}

const CustomTextInput = forwardRef<CustomTextInputRef, CustomTextInputProps>(
  (props, ref) => {
    const textInputRef = React.useRef<TextInput>(null);

    // Expose the 'focus' method to the parent component
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      },
    }));

    return (
      <TextInput
        {...props}
        ref={textInputRef}
        style={{
          borderWidth: 1,
          borderColor: colors.gray,
          borderRadius: 4,
          padding: 10,
        }}
      />
    );
  }
);

export default CustomTextInput;
