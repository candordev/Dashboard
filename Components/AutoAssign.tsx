import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../Styles/colors";
import Button from "./Button";

interface AutoAssignProps {
  department: string;
}

function AutoAssign(props: AutoAssignProps): JSX.Element {
  return (
    <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 15, marginHorizontal: 5, }}>
      <Text
        style={{ fontFamily: "Montserrat", fontWeight: "500", fontSize: 16, flex: 1}}
      >
        Auto Assign to {props.department}?
      </Text>
      <Button
        text="Yes"
        onPress={() => {}}
        style={{ backgroundColor: colors.purple, width: 50, marginRight: 5, height: 33,}}
        textStyle={{ fontSize: 16 }}
      />
      <Button
        text="No"
        onPress={() => {}}
        style={{ backgroundColor: colors.red, width: 50, height: 33}}
        textStyle={{ fontSize: 16 }}
      />
    </View>
  );
}

export default AutoAssign;