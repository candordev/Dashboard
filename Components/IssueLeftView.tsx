import React from "react";
import { View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";

const IssueLeftView = () => {
  return (
    <View
      style={{
        borderColor: colors.lightestgray,
        borderWidth: 2,
        borderRadius: 10,
        height: "100%",
        flex: 1,
        padding: 10,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Issue Title</Text>
      <Text style={{ fontSize: 14 }}>Issue Description</Text>
    </View>
  );
};

export default IssueLeftView;
