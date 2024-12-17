import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import colors from "../Styles/colors";
import styles from "../Styles/styles";
import Text from "./Text";

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
  loading?: boolean;
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  text,
  style,
  textStyle,
  onPress,
  loading,
  disabled
}) => {
  return (
    <TouchableOpacity
      style={[styles.bigButton, style]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      <Text
        style={[styles.bigButtonText, textStyle, { opacity: loading ? 0 : 1 }]}
      >
        {text}
      </Text>
      {loading && (
        <View
          style={{
            position: "absolute",
            right: 0,
            left: 0,
            bottom: 0,
            top: 0,
          }}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="small" color={colors.white} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
