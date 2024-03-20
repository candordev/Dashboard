// MemberManagement.tsx
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  TouchableOpacity,
  FlatList,
  Image,
  GestureResponderEvent,
  Platform,
} from "react-native";
import SearchBar from "../Components/SearchBar";
import Text from "../Components/Text";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";
import colors from "../Styles/colors"; // Make sure the path matches your project structure
import { Group } from "../utils/interfaces";
import FeatherIcon from "react-native-vector-icons/Feather";
import GroupMember from "./GroupMember";
import styles from "../Styles/styles";

type MemberManagementProps = {
  groupID: string;
  userID: string;
};

type Member = {
  user: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  isLeader?: boolean;
  master?: string;
};

const MemberManagement = ({ groupID, userID }: MemberManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [groupMembers, setGroupMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetchMembers(searchQuery);
  }, [searchQuery, groupID]);

  async function fetchMembers(query = "") {
    try {
      const queryParams = new URLSearchParams({
        groupID: groupID,
        searchQuery: query,
      });

      const response = await customFetch(
        `${Endpoints.getGroupMembers}${queryParams.toString()}`,
        { method: "GET" }
      );
      const data = await response.json();
      console.log("DATA", data);
      if (response.ok) {
        //const filteredMembers = data.filter((member: Member) => member.user !== userID);
        setGroupMembers(data);
        console.log("MEMBERS", data);
      } else {
        console.error("Error fetching members: ", data.error);
      }
    } catch (error) {
      console.error("Network error while fetching members: ", error);
    }
  }

  async function kickMember(user = "") {
    try {
      let res = await customFetch(Endpoints.kickMember, {
        method: "POST",
        body: JSON.stringify({
          groupID: groupID,
          userToKick: user,
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with removing member from group:", resJson.error);
      } else {
        fetchMembers(searchQuery);
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  }

  async function addLeader(user = "") {
    try {
      let res = await customFetch(Endpoints.addLeaderDashboardSettings, {
        method: "POST",
        body: JSON.stringify({
          groupID: groupID,
          userToAdd: user,
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with adding leader to group:", resJson.error);
      } else {
        fetchMembers(searchQuery);
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  }

  async function removeLeader(user = "") {
    try {
      let res = await customFetch(Endpoints.removeLeaderDashboardSettings, {
        method: "POST",
        body: JSON.stringify({
          groupID: groupID,
          userToRemove: user,
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with removing member from group:", resJson.error);
      } else {
        fetchMembers(searchQuery);
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  }

  return (
    <View style={styles.groupSettingsContainer}>
      <Text
        style={{
          alignSelf: "flex-start",
          fontWeight: "600",
          fontSize: 27,
          fontFamily: "Montserrat",
        }}
      >
        Manage Members
      </Text>
      <SearchBar
        searchPhrase={searchQuery}
        setSearchPhrase={setSearchQuery}
        placeholder="Search Members"
        containerStyle={{backgroundColor: colors.white, marginTop: 5}}
        searchBarStyle={{borderWidth: 2, borderColor: colors.lightestgray}}
      />
      <FlatList
        data={groupMembers}
        keyExtractor={(item) => item.user}
        renderItem={({ item }) => (
          <GroupMember
            member={{
              user: item.user,
              profilePicture: item.profilePicture || "", // Ensure profilePicture is always a string
              firstName: item.firstName || "",
              lastName: item.lastName || "",
              isLeader: item.isLeader || false,
              master: item.master || "",
            }}
            kickMember={() => kickMember(item.user)}
            addLeader={() => addLeader(item.user)}
            removeLeader={() => removeLeader(item.user)}
            groupID={groupID}
            userID={userID}
          />
        )}
      />
    </View>
  );
};

// const GroupMember = ({ member, kickMember, addLeader, removeLeader }: GroupMemberProps) => {
//   // Define a function to render a button to reduce redundancy
//   const renderButton = (
//     text: string,
//     onPress: ((event: GestureResponderEvent) => void) | null | undefined
//   ) => {
//     const [isHovered, setIsHovered] = useState(false); // Local state to track hover state

//     return (
//       <Pressable
//         onPress={onPress}
//         style={[
//           styles.button,
//           isHovered && styles.hoveredButton,
//           // Apply conditional style for specific button texts
//           ((text === "Remove From Group" || text === "Remove Leader") && isHovered) && { backgroundColor: colors.red }
//         ]}
//         // onHoverIn={() => setIsHovered(true)}
//         // onHoverOut={() => setIsHovered(false)}
//       >
//         <Text style={[styles.buttonText, isHovered && styles.hoveredButtonText]}>
//           {text}
//         </Text>
//       </Pressable>
//     );
//   };

//   return (
//     <View style={styles.memberContainer}>
//       <Image source={{ uri: member.profilePicture }} style={styles.profilePic} />
//       <View style={styles.infoContainer}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
//           <Text style={styles.memberText}>
//             {member.firstName} {member.lastName}
//           </Text>
//           {member.isLeader && <FeatherIcon name="check-circle" size={20} color={colors.purple} />}
//         </View>
//         <View style={styles.buttonGroup}>
//           {member.isLeader ? (
//             <TouchableOpacity onPress={removeLeader} style={styles.button}>
//               <Text style={styles.buttonText}>Remove Leader</Text>
//             </TouchableOpacity>
//           ) : (
//             <>
//               <TouchableOpacity onPress={addLeader} style={styles.button}>
//                 <Text style={styles.buttonText}>Add Leader</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={kickMember} style={styles.button}>
//                 <Text style={styles.buttonText}>Remove From Group</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

const additionalStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        // Example values for boxShadow
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)", // offsetX offsetY blurRadius color
      },
    }),
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  // memberContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   padding: 10,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#ccc',
  // },
  memberContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "column", // Use column to encourage vertical expansion
  },
  profilePic: {
    width: 35,
    height: 35,
    borderRadius: 25,
  },
  infoAndButtonsContainer: {
    flex: 1,
    flexDirection: "row", // Align items in a row
    alignItems: "center", // Center items vertically
    marginLeft: 10,
  },
  memberText: {
    marginRight: 10, // Add some space before the icon
    color: colors.black,
    fontFamily: "Montserrat",
    flexShrink: 1, // Allow text to shrink if needed
  },
  buttonGroup: {
    flexDirection: "row",
    marginLeft: "auto", // Push button group to the end of the container
  },
  button: {
    backgroundColor: colors.lightergray,
    borderRadius: 5,
    padding: 8,
    marginLeft: 5, // Space between buttons
  },
  kickButton: {
    backgroundColor: colors.lightergray, // Optional: different background color for the "Remove From Group" button
  },
  buttonText: {
    color: "black",
    fontFamily: "Montserrat",
  },
  leaderText: {
    color: colors.purple,
    flex: 1,
    marginLeft: 10,
    fontFamily: "Montserrat",
  },
  hoveredButton: {
    padding: 10,
    backgroundColor: colors.purple, // Using your colors resource
    borderRadius: 5,
    marginLeft: 5, // Update to your actual color variable
  },
  hoveredButtonText: {
    color: "white",
    fontFamily: "Montserrat",
  },

  // Add other styles as needed
});

export default MemberManagement;
