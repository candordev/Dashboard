import React from "react";
import { View } from "react-native";
import colors from "../Styles/colors";

type OuterViewProps = {
  children: React.ReactNode;
};

const OuterView: React.FC<OuterViewProps> = ({ children }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.black }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          margin: 10,
          marginLeft: 0,
          borderRadius: 20,
          padding: 10,
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default OuterView;
