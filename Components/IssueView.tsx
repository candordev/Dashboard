import React from "react";
import { View, Text, StyleSheet } from "react-native";

const IssueView = () => {
  return (
    <View style={{ padding: 10, alignItems: "center" }}>
      <Text>Accept Issue</Text>
      <Text>Redirect Issue</Text>
      <Text>Report Issue</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default IssueView;
