import { Link } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";
import SearchBar from "./SearchBar";
import FeatherIcon from "react-native-vector-icons/Feather";
import DropDownPicker from "react-native-dropdown-picker";
import StatusPicker from "./StatusPicker";

const Header = ({ navigation, route }: any) => {
  const activeTab = route.name;

  const [issueSearchPhrase, setIssueSearchPhrase] = React.useState("");
  const [assigneeSearchPhrase, setAssigneeSearchPhrase] = React.useState("");

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const [items, setItems] = useState([
    { label: "Transportation", value: "Tanuj Dunthuluri" },
    { label: "Agriculture", value: "Atishay Jain" },
    { label: "Rural Development", value: "Rishi Bengani" },
    { label: "Safety", value: "A Person" },
  ]);

  const [open2, setOpen2] = useState(false);
  const [value2, setValue2] = useState<string[]>([]);
  const [items2, setItems2] = useState([
    { label: "High Priority", value: "Tanuj Dunthuluri" },
    { label: "Medium Priority", value: "Atishay Jain" },
    { label: "Low Priority", value: "Rishi Bengani" },
    { label: "No Priority", value: "A Person" },
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
        style={{ marginTop: 15, flexDirection: "row", alignItems: "center" }}
      >
        <SearchBar
          searchPhrase={issueSearchPhrase}
          setSearchPhrase={setIssueSearchPhrase}
          placeholder="Search Issue..."
        />
        <View style={{ width: 200 }}>
          <DropDownPicker
            maxHeight={165}
            multiple={true}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            dropDownDirection="BOTTOM"
            style={{
              borderColor: colors.lightgray,
              borderWidth: 1,
              backgroundColor: colors.white,
              minHeight: 36,
            }}
            placeholder="Select category"
            placeholderStyle={{ color: colors.black }}
            textStyle={{
              fontSize: 15,
              color: colors.black,
              fontFamily: "OpenSans",
            }}
            listMode="SCROLLVIEW"
            dropDownContainerStyle={[
              {
                borderTopWidth: 1,
                backgroundColor: colors.white,
                borderColor: colors.lightgray,
              },
            ]}
            ArrowDownIconComponent={() => (
              <FeatherIcon
                name={"chevron-down"}
                size={20}
                color={colors.gray}
              />
            )}
            ArrowUpIconComponent={() => (
              <FeatherIcon name={"chevron-up"} size={20} color={colors.gray} />
            )}
            TickIconComponent={() => (
              <FeatherIcon name={"check"} size={17} color={colors.gray} />
            )}
          />
        </View>
        <StatusPicker />
        <View style={{ width: 200, marginLeft: 10 }}>
          <DropDownPicker
            maxHeight={165}
            multiple={true}
            open={open2}
            value={value2}
            items={items2}
            setOpen={setOpen2}
            setValue={setValue2}
            setItems={setItems2}
            dropDownDirection="BOTTOM"
            style={{
              borderColor: colors.lightgray,
              borderWidth: 1,
              backgroundColor: colors.white,
              minHeight: 36,
            }}
            placeholder="Select tags"
            placeholderStyle={{ color: colors.black }}
            textStyle={{
              fontSize: 15,
              color: colors.black,
              fontFamily: "OpenSans",
            }}
            listMode="SCROLLVIEW"
            dropDownContainerStyle={[
              {
                borderTopWidth: 1,
                backgroundColor: colors.white,
                borderColor: colors.lightgray,
              },
            ]}
            ArrowDownIconComponent={() => (
              <FeatherIcon
                name={"chevron-down"}
                size={20}
                color={colors.gray}
              />
            )}
            ArrowUpIconComponent={() => (
              <FeatherIcon name={"chevron-up"} size={20} color={colors.gray} />
            )}
            TickIconComponent={() => (
              <FeatherIcon name={"check"} size={17} color={colors.gray} />
            )}
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
