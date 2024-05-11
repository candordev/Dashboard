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
  sessionId: string;
  priority: string;
}

const ChatsScreen = ({ navigation }: any) => {
  const { state } = useUserContext();

  // Step 2: Use the interface to type your state
  const [sortedNumbers, setSortedNumbers] = useState<NumberItem[]>([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");


  async function getWebChats() {
    try {

      let params = new URLSearchParams({
        groupID: state.currentGroup,
      });

      let endpoint = Endpoints.getAllWebChats + '?' +params;


      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const resJson = await response.json();
  
      if (!response.ok) {
        throw new Error(resJson.error);
      }
  
      // Sorting logic: 'High' priority first, others in reverse order
      const sorted: NumberItem[] = resJson.data.sort((a: { priority: string; _id: any; }, b: { priority: string; _id: string; }) => {
        // Prioritize 'High' at the top
        if (a.priority === "High" && b.priority !== "High") return -1;
        if (a.priority !== "High" && b.priority === "High") return 1;
  
        // For non-'High' priorities, reverse the order
        return b._id.localeCompare(a._id); // Assuming _id can be used to determine the original order
      });
  
      console.log("sorted!!! ", sorted);
      setSortedNumbers(sorted);
      setSelectedPhoneNumber(sorted.length ? sorted[0].sessionId : null);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }
  


  const handlePriorityChange = async (sessionId: string) => {
    console.log("pri changed!!!")
    await getWebChats()
    setSelectedPhoneNumber(sessionId)
  };

  useEffect(() => {
    getWebChats();
  }, []);

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
          {/* <View
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
              }}
              style={{ margin: 7 }} 
            />
          </View> */}

          {/* FlatList for displaying numbers */}
          <FlatList
            data={sortedNumbers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedPhoneNumber(item.sessionId)}
                style={{
                  backgroundColor:
                    item.sessionId === selectedPhoneNumber
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
                  {item.sessionId} - Priority: {item.priority}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={{ flex: 3, padding: 20 }}>
          {selectedPhoneNumber ? (
            <ChatComponent onPriorityChange={handlePriorityChange} phoneNumber={selectedPhoneNumber} />
          ) : null}
        </View>
      </OuterView>
    </>
  );
};

export default ChatsScreen;
