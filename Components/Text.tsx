import React, { forwardRef } from "react";
import { Text as RNText } from "react-native";
import colors from "../Styles/colors";

type TextProps = {
  children: any;
  style: any;
};

const Text = forwardRef<TextProps, any>(
  ({ style, children, ...props }, ref) => {
    return (
      <RNText
        style={[{ color: colors.black, fontFamily: "OpenSans" }, style]}
        ref={ref}
        {...props}
      >
        {children}
      </RNText>
    );
  }
);

Text.displayName = "Text";

export default Text;
