import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../Styles/colors";

const ProgressBar = ({ percentage }: any) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: "75%" }]} />
      </View>
      <Text
        style={{
          fontSize: 25,
          fontWeight: "500",
          color: colors.purple,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginLeft: 20,
        }}
      >
        75%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 27,
    width: "85%",
    backgroundColor: "#e0e0e0",
    borderRadius: 15,
    overflow: "hidden", // This ensures the inner view stays within the container's border radius
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.otherPurple,
    borderRadius: 15, // Same as container to keep the look consistent
  },
});

// Usage
const SatisfactionProgress = () => (
  <View style={{ marginVertical: 20 }}>
    <ProgressBar percentage={50} />
  </View>
);

export default SatisfactionProgress;
