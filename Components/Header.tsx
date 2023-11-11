import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Header = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState("all");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigation.navigate(tab);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.tabButton,
          activeTab === "all" && styles.activeTabButton,
        ]}
        onPress={() => handleTabClick("all")}
        disabled={activeTab === "all"}
      >
        <Text
          style={[styles.tabText, activeTab === "all" && styles.activeTabText]}
        >
          All
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.tabButton,
          activeTab === "your" && styles.activeTabButton,
        ]}
        onPress={() => handleTabClick("your")}
        disabled={activeTab === "your"}
      >
        <Text
          style={[styles.tabText, activeTab === "your" && styles.activeTabText]}
        >
          Your
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
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
