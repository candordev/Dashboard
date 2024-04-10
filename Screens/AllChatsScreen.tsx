import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import colors from "../Styles/colors";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { useUserContext } from "../Hooks/useUserContext";
import OuterView from "../Components/OuterView";
import NotificationPopup from "../Components/NotificationPopup";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import ChatComponent from "./ChatComponent";
import Button from "../Components/Button";
import SearchBar from "../Components/SearchBar";

// Step 1: Define the interface
interface NumberItem {
  number: string;
  priority: string;
}

const AllChatsScreen = ({ navigation }: any) => {
  const { state } = useUserContext();

  // Step 2: Use the interface to type your state
  const [sortedNumbers, setSortedNumbers] = useState<NumberItem[]>([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (
      state.leaderGroups &&
      state.leaderGroups[0] &&
      state.leaderGroups[0].numbers
    ) {
      // Assuming numbers have a structure that matches the NumberItem interface
      const sorted: NumberItem[] = [...state.leaderGroups[0].numbers].sort(
        (a, b) => {
          if (a.priority === "High") return -1;
          if (b.priority === "High") return 1;
          return 0;
        }
      );
      setSortedNumbers(sorted);
    }
  }, [state.leaderGroups]);

  async function fetchAIChat(phoneNumber: any) {
    try {
      const queryParams = new URLSearchParams({
        phoneNumber: phoneNumber,
      });
      const url = `${Endpoints.getChatForNumber}${queryParams.toString()}`;
      const response = await customFetch(url, { method: "GET" });
      const data = await response.json();
      console.log("DATA: ", data);
      if (response.ok) {
      } else {
        console.error("Error fetching members: ", data.error);
      }
    } catch (error) {
      console.error("Network error while fetching members: ", error);
    }
  }

  return (
    <>
      {/* NotificationPopup and the rest of your component... */}
      <OuterView
        style={{
          backgroundColor: colors.white,
          flexDirection: "row",
          flex: 1,
          borderRadius: 20,
          overflow: "visible",
          padding: 0,
        }}
      >
        {/* Numbers Section */}
        <View style={{ flex: 1 / 4 }}>
          {/* Search bar and AntDesign icon in a row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 7,
              marginTop: 7,
            }}
          >
            <SearchBar
              searchPhrase={searchQuery}
              setSearchPhrase={setSearchQuery}
              placeholder="Search Residents"
              containerStyle={{
                flex: 1,
                backgroundColor: colors.white,
                margin: 10,
              }}
              searchBarStyle={{
                borderWidth: 1.3,
                borderColor: colors.lightestgray,
              }}
            />
            {/* Icon button, assuming you want it to perform an action */}
            <AntDesignIcon
              name="form" // The name of the icon from AntDesign
              size={24} // Adjust size as needed
              color={colors.gray} // Adjust color as needed
              onPress={() => {
                /* Your icon action here */
              }}
              style={{ margin: 7 }} // Adjust spacing as needed
            />
          </View>

          {/* FlatList for displaying numbers */}
          <FlatList
            data={sortedNumbers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedPhoneNumber(item.number)}
                style={{
                  //marginBottom: 10,
                  // Change the background color if the item is selected
                  backgroundColor:
                    item.number === selectedPhoneNumber
                      ? colors.lightergray
                      : colors.white,
                  padding: 12,
                  paddingLeft: 15,
                  borderBottomColor: colors.lightergray,
                  borderBottomWidth: 1,
                  //alignSelf: 'stretch',
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: 16,
                    color: colors.darkGray,
                  }}
                >
                  {item.number} - Priority: {item.priority}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View
          style={{ width: 1, backgroundColor: colors.lightgray, opacity: 0.5 }}
        />

        <View style={{ flex: 3 / 4, padding: 20 }}>
          {selectedPhoneNumber ? (
            <ChatComponent phoneNumber={selectedPhoneNumber} />
          ) : null}
        </View>
      </OuterView>
    </>
  );
};

export default AllChatsScreen;
