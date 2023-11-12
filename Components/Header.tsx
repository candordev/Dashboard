import { Link } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../Styles/colors";

const Header = ({ navigation, route }: any) => {
  const activeTab = route.name;

  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: colors.background,
        paddingTop: 20,
        paddingBottom: 15,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "70%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontSize: 30, fontWeight: "500", fontFamily: "Montserrat" }}
        >
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + " Issues"}
        </Text>
        <View style={styles.container}>
          <Link to="/all">
            <View
              style={[
                styles.tabButton,
                activeTab === "all" && styles.activeTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "all" && styles.activeTabText,
                ]}
              >
                All
              </Text>
            </View>
          </Link>
          <Link to="/your">
            <View
              style={[
                styles.tabButton,
                activeTab === "your" && styles.activeTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "your" && styles.activeTabText,
                ]}
              >
                Your
              </Text>
            </View>
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  tabButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  activeTabButton: {
    backgroundColor: "#000",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#fff",
  },
});

export default Header;
