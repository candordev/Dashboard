import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { useSignout } from "../Hooks/useSignout";
import { useUserContext } from "../Hooks/useUserContext";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { Post, Status, UserProfile } from "../utils/interfaces";
import { customFetch } from "../utils/utils";
import CreatePost from "./CreatePost";
import DropDown from "./DropDown";
import OptionPicker from "./OptionPicker";
import SearchBar from "./SearchBar";
import StatusPicker from "./StatusPicker";
import Text from "./Text";
import DownloadPDF from "./DownloadPDF";
import CSVImportComponent from "./CSVImportComponent";

interface HeaderProps {
  onStatusChange: (status: Status) => void;
  headerTitle: string;
  groupID?: string; // groupID is optional and can be undefined
  onHeaderOptionChange: (option: string) => void;
  onAssigneeSelection: (option: string[]) => void;
  onSearchChange: (option: string) => void;
  onPopoverCloseComplete: () => void; // Add this line
}

const Header = ({
  onStatusChange,
  headerTitle,
  onHeaderOptionChange,
  onAssigneeSelection,
  groupID,
  onSearchChange,
  onPopoverCloseComplete,
}: HeaderProps) => {
  const { state, dispatch } = useUserContext();
  const [searchPhrase, setSearchPhrase] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("SEARCH PHRASE CHANGED: ", searchPhrase);
      onSearchChange(searchPhrase);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchPhrase]);

  const [leaders, setLeaders] = useState<UserProfile[]>([]); // State to store leaders

  useEffect(() => {
    // Update assigneeItems based on the fetched leaders
    console.log("THESE ARE THE FETCHED LEADERS", leaders);
    const newAssigneeItems = leaders.map((leader) => ({
      label: `${leader.firstName} ${leader.lastName}`,
      value: leader.user,
    }));
    setAssigneeItems(newAssigneeItems);
  }, [leaders]);

  useEffect(() => {
    fetchLeaders(); // Fetch leaders when the component mounts or when groupID changes
  }, [groupID]);

  const handleAssigneeSelection = (selectedValues: string[]) => {
    setAssigneeValues(selectedValues);
    console.log("THESE ARE THE SELECTED ID: ", assigneeValues);
    // Call a prop function to send the selected IDs to the parent component
    onAssigneeSelection(selectedValues);
  };

  const fetchLeaders = async () => {
    try {
      const queryParams = new URLSearchParams();

      // Append groupID only if it is not undefined
      if (groupID) {
        queryParams.append("groupID", groupID);
      }

      console.log("THESE THE LEADER GROUPS", state.leaderGroups[0]);
      let endpoint = Endpoints.getGroupLeaders + queryParams.toString(); // backend route does it by page, might need to j get all of the leaders

      const res = await customFetch(endpoint, { method: "GET" });
      const resJson = await res.json();

      if (!res.ok) {
        console.error(resJson.error);
      }
      if (res.ok) {
        const result: UserProfile[] = resJson;
        console.log("leaders are", result);

        setLeaders(result);
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    }
  };

  const [assigneeValues, setAssigneeValues] = useState<string[]>([]); // Explicitly specify the type as string[]

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

  const handlePopoverClose = () => {
    console.log();
    //fetchPosts(currStatus, selectedHeaderOption);
  };

  const handleImportSuccess = () => {
    console.log("Import successful");
    onPopoverCloseComplete(); // Call the callback on successful import
    // You may want to refresh the data or perform other actions here
  };


  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: colors.background,
        paddingVertical: 15,
        zIndex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text
          style={{
            alignSelf: "flex-start",
            fontWeight: "600",
            fontSize: 27,
            fontFamily: "Montserrat",
          }}
        >
          {headerTitle}
        </Text>
          {groupID && <DownloadPDF groupID={groupID as string} />}
          <OptionPicker onOptionChange={onHeaderOptionChange} />
      </View>
      <View
        style={{
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          columnGap: 10,
        }}
      >
        <View style={{ width: "40%" }}>
          <SearchBar
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
            placeholder="Search Issue..."
          />
        </View>
        <StatusPicker onStatusChange={onStatusChange} />
        <View style={{ flex: 1 }}>
          <DropDown
            placeholder="Select assignee"
            value={assigneeValues}
            setValue={handleAssigneeSelection}
            items={assigneeItems}
            setItems={setAssigneeItems}
            multiple={true}
          />
        </View>
        <CreatePost onPopoverCloseComplete={onPopoverCloseComplete} />
        <CSVImportComponent 
        onImportSuccess={handleImportSuccess} 
      />
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
  searchResultsContainer: {
    position: "absolute",
    top: 28, // Adjust this to be just below the search bar
    left: 0,
    right: 0,
    height: 600, // Fixed height for the container (adjust as needed)
    backgroundColor: "white", // Background color for the container
    zIndex: 1,
    borderWidth: 1, // Width of the border
    borderColor: "#d1d1d1", // Color of the border
    borderTopColor: "white",
  },
  itemSeparator: {
    height: 1,
    backgroundColor: "#ccc", // Color for the dividers
    zIndex: 1000,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 15,
    backgroundColor: colors.purple,
  },
  title: {
    fontSize: 15,
    fontWeight: "650" as any,
    color: "white",
  },
});

export default Header;
