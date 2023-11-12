import React from "react";
import { View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";
import ProfileRow from "./ProfileRow";

const Assignees = () => {
  return (
    <View
      style={{
        borderColor: colors.lightestgray,
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "550",
          fontFamily: "Montserrat",
        }}
      >
        Assignees
      </Text>
      <ProfileRow />
      <ProfileRow />
    </View>
  );
};

export default Assignees