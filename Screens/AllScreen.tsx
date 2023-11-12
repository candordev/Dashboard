import React from "react";
import { Button, Text, View } from "react-native";

const AllScreen = ({ navigation }: any) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("your")}
      />
    </View>
  );
};

export default AllScreen;
