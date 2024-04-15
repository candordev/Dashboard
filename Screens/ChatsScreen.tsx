import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import OuterView from "../Components/OuterView";
import SearchBar from "../Components/SearchBar";
import { useUserContext } from "../Hooks/useUserContext";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import ChatComponent from "./ChatComponent";

// Step 1: Define the interface
interface NumberItem {
  number: string;
  priority: string;
}

const ChatsScreen = ({ navigation }: any) => {
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
      setSelectedPhoneNumber(sorted.length ? sorted[0].number : null);
    }
  }, [state.leaderGroups]);

  return (
    <>
      <OuterView
        style={{
          backgroundColor: colors.white,
          flexDirection: "row",
          padding: 0,
        }}
      >
        <View style={{ flex: 1, borderRightWidth: 1, borderColor: colors.lightergray}}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 7,
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
                  backgroundColor:
                    item.number === selectedPhoneNumber
                      ? colors.lightergray
                      : colors.white,
                  padding: 12,
                  paddingLeft: 15,
                  borderBottomColor: colors.lightergray,
                  borderBottomWidth: 1,
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

        <View style={{ flex: 3, padding: 20 }}>
          {selectedPhoneNumber ? (
            <ChatComponent phoneNumber={selectedPhoneNumber} />
          ) : null}
        </View>
      </OuterView>
    </>
  );
};

export default ChatsScreen;
