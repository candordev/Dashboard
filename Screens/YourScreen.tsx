import { Link } from "@react-navigation/native";
import React from "react";
import { Button, Text, View } from "react-native";

const YourScreen = ({ navigation }: any) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <Text>Details Screen</Text>
      <Link to="/all">
        <Text>Go to All Screen</Text>
      </Link>
      <Button title="Go to Home" onPress={() => navigation.navigate("all")} />
    </View>
  );
};

export default YourScreen;
