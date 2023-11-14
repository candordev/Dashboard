import { Link } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";
import SearchBar from "./SearchBar";
import FeatherIcon from "react-native-vector-icons/Feather";
import DropDownPicker from "react-native-dropdown-picker";
import StatusPicker from "./StatusPicker";
import DropDown from "./DropDown";

const Header = ({ navigation, route }: any) => {
  const activeTab = route.name;

  const [issueSearchPhrase, setIssueSearchPhrase] = React.useState("");
  const [assigneeSearchPhrase, setAssigneeSearchPhrase] = React.useState("");

  const [categoryValue, setCategoryValue] = useState<string[]>([]);
  const [categoryItems, setCategoryItems] = useState([
    { label: "Transportation", value: "Tanuj Dunthuluri" },
    { label: "Agriculture", value: "Atishay Jain" },
    { label: "Rural Development", value: "Rishi Bengani" },
    { label: "Safety", value: "A Person" },
  ]);

  const [tagValues, setTagValues] = useState<string[]>([]);
  const [tagItems, setTagItems] = useState([
    { label: "High Priority", value: "Tanuj Dunthuluri" },
    { label: "Medium Priority", value: "Atishay Jain" },
    { label: "Low Priority", value: "Rishi Bengani" },
    { label: "No Priority", value: "A Person" },
  ]);

  const [assigneeValues, setAssigneeValues] = useState<string[]>([]);
  const [assigneeItems, setAssigneeItems] = useState([
    { label: "Tanuj Dunthuluri", value: "Tanuj Dunthuluri" },
    { label: "Atishay Jain", value: "Atishay Jain" },
    { label: "Rishi Bengani", value: "Rishi Bengani" },
    { label: "Srikar Parsi", value: "Srikar Parsi" },
  ]);

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
      <View
        style={{
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
          width: "70%",
          columnGap: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <SearchBar
            searchPhrase={issueSearchPhrase}
            setSearchPhrase={setIssueSearchPhrase}
            placeholder="Search Issue..."
          />
        </View>
        <StatusPicker />
      </View>
      <View
        style={{
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
          width: "70%",
          columnGap: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <DropDown
            placeholder="Select category"
            value={categoryValue}
            setValue={setCategoryValue}
            items={categoryItems}
            setItems={setCategoryItems}
            multiple={true}
          />
        </View>
        <View style={{ flex: 1 }}>
          <DropDown
            placeholder="Select tag"
            value={tagValues}
            setValue={setTagValues}
            items={tagItems}
            setItems={setTagItems}
            multiple={true}
          />
        </View>
        <View style={{ flex: 1 }}>
          <DropDown
            placeholder="Select assignee"
            value={assigneeValues}
            setValue={setAssigneeValues}
            items={assigneeItems}
            setItems={setAssigneeItems}
            multiple={true}
          />
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
    width: 200,
  },
  tabButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  activeTabButton: {
    backgroundColor: colors.black,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activeTabText: {
    color: colors.white,
  },
});

export default Header;
