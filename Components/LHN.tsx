import React from "react";
import { View, TouchableOpacity } from "react-native";
import Text from "./Text";
import { Link } from "@react-navigation/native";
import colors from "../Styles/colors";

const LHN = () => {
  const handleNavigation = (screenName: string) => {
    // Handle navigation logic here
    console.log(`Navigating to ${screenName}`);
  };

  return (
    <View style={styles.container}>
      <Link to="/all" style={styles.navItem}>
        <Text style={styles.navItemText}>All Issues</Text>
      </Link>
      <Link to="/your" style={styles.navItem}>
        <Text style={styles.navItemText}>Your Issue</Text>
      </Link>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  navItem: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
  },
  navItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
};

export default LHN;
