import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import Text from "./Text";
import colors from "../Styles/colors";
import styles from "../Styles/styles";

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  style,
  textStyle,
  onPress,
  loading,
}) => {
  return (
    <TouchableOpacity
      style={[styles.bigButton, style]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={[styles.bigButtonText, textStyle, {opacity: loading ? 0 : 1}]}>{text}</Text>
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
