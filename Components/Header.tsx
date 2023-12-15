import { Link } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import colors from "../Styles/colors";
import DropDown from "./DropDown";
import SearchBar from "./SearchBar";
import StatusPicker from "./StatusPicker";
import Text from "./Text";
import {useSignout} from '../Hooks/useSignout';
import { useUserContext } from "../Hooks/useUserContext";

const Header = ({ navigation, route }: any) => {
  const {state, dispatch} = useUserContext();
  const activeTab = "all";

  const [issueSearchPhrase, setIssueSearchPhrase] = React.useState("");

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
  const handleSignOut = () => {
    // Call the signout function when the button is pressed
    useSignout({ dispatch });
  };

  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: colors.background,
        paddingTop: 15,
        paddingBottom: 15,
        zIndex: 100,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
        <Text style={{ alignSelf: 'flex-start', fontWeight: '600', fontSize: 27, fontFamily: 'Montserrat' }}>All Issues</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={{ color: colors.black , fontWeight: '600', fontSize: 16 }}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
          width: "90%",
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
          width: "90%",
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
    borderRadius: 10,
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
