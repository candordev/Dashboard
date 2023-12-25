import React from "react";
import { View } from "react-native";
import colors from "../Styles/colors";

type OuterViewProps = {
  children: React.ReactNode;
  style?: any;
};

const OuterView: React.FC<OuterViewProps> = ({ children, style }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.black }}>
      <View
        style={[{
          flex: 1,
          backgroundColor: colors.background,
          margin: 10,
          marginLeft: 0,
          borderRadius: 20,
          padding: 10,
        }, style]}
      >
        {children}
      </View>
    </View>
  );
};

export default OuterView;
