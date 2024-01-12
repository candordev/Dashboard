import React from "react";
import { View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";

type OuterComponentViewProps = {
  title?: string;
  children: React.ReactNode;
  style?: any;
};

const OuterComponentView: React.FC<OuterComponentViewProps> = ({
  title,
  children,
  style,
}) => {
  return (
    <View
      style={[{
        borderColor: colors.lightestgray,
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
      }, style]}
    >
      {title && (
        <Text
          style={{
            fontSize: 18,
            fontWeight: "550",
            fontFamily: "Montserrat",
            marginBottom: 10,
          }}
        >
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};

export default OuterComponentView;
