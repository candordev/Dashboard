// MemberManagement.tsx
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, TouchableOpacity, FlatList, Image, GestureResponderEvent } from "react-native";
import SearchBar from "../Components/SearchBar";
import Text from "../Components/Text";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";
import colors from "../Styles/colors"; // Make sure the path matches your project structure
import { Group } from "../utils/interfaces";
import FeatherIcon from "react-native-vector-icons/Feather";

type MemberManagementProps = {
    groupID: string;
};

type Member = {
    user: string;
    profilePicture?: string;
    firstName?: string;
    lastName?: string;
    isLeader?: boolean;
};

const MemberManagement = ({ groupID }: MemberManagementProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [groupMembers, setGroupMembers] = useState<Member[]>([]);

    useEffect(() => {
        fetchMembers(searchQuery);
    }, [searchQuery, groupID]);

    async function fetchMembers(query = '') {
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
            setGroupMembers(data);
          } else {
            console.error("Error fetching members: ", data.error);
          }
        } catch (error) {
          console.error("Network error while fetching members: ", error);
        }
      }
    
      async function kickMember(user = '') {
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
    
      async function addLeader(user = '') {
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
              console.error("Error with removing member from group:", resJson.error);
            } else {
              fetchMembers(searchQuery);
            }
        } catch (error) {
        console.error("Network error, please try again later.", error);
        }
      }
    
      async function removeLeader(user = '') {
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
        
        <View style={styles.container}>
            <Text
                style={{
                    alignSelf: "flex-start",
                    fontWeight: "600",
                    fontSize: 27,
                    fontFamily: "Montserrat",
                    margin: 10
                }}
                >
                Manage Group Members
            </Text>
            <SearchBar
                searchPhrase={searchQuery}
                setSearchPhrase={setSearchQuery}
                placeholder="Search Members"
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
                        }}
                        kickMember={() => kickMember(item.user)}
                        addLeader={() => addLeader(item.user)}
                        removeLeader={() => removeLeader(item.user)}
                    />
                )}
            />
        </View>
    );
};

type GroupMemberProps = {
    member: {
        user: string;
        profilePicture: string;
        firstName: string;
        lastName: string;
        isLeader: boolean;
    };
    kickMember: () => void; // Function type declaration
    addLeader: () => void;
    removeLeader: () => void;
};

const GroupMember = ({ member, kickMember, addLeader, removeLeader }: GroupMemberProps) => {
  // Define a function to render a button to reduce redundancy
  const renderButton = (
    text: string,
    onPress: ((event: GestureResponderEvent) => void) | null | undefined
  ) => {
    const [isHovered, setIsHovered] = useState(false); // Local state to track hover state
    
  
    return (
      <Pressable
        onPress={onPress}
        style={[
          styles.button,
          isHovered && styles.hoveredButton,
          // Apply conditional style for specific button texts
          ((text === "Remove From Group" || text === "Remove Leader") && isHovered) && { backgroundColor: colors.red }
        ]}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <Text style={[styles.buttonText, isHovered && styles.hoveredButtonText]}>
          {text}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.memberContainer}>
      <Image source={{ uri: member.profilePicture }} style={styles.profilePic} />
      <View style={styles.infoContainer}>
        <Text style={styles.memberText}>
          {member.firstName} {member.lastName}
        </Text>
        {member.isLeader && <FeatherIcon name="check-circle" size={20} color={colors.purple} />}
      </View>
      {member.isLeader ? (
        <>
          {renderButton("Remove Leader", removeLeader)}
          {renderButton("Remove From Group", kickMember)}
        </>
      ) : (
        <>
          {renderButton("Add Leader", addLeader)}
          {renderButton("Remove From Group", kickMember)}
        </>
      )}
    </View>
  );
};


const GeneralSettings = () => {
    return <Text>General Settings</Text>; // Make sure to import Text from react-native or your custom component
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  memberText: {
    marginRight: 5,
    color: colors.black,
    fontFamily: 'Montserrat',
  },
  leaderText: {
    color: colors.purple,
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Montserrat',
  },
  button: {
      padding: 10,
      backgroundColor: colors.lightergray, // Using your colors resource
      borderRadius: 5,
      marginLeft: 5, // Add some margin to the left of each button for spacing
    },
    hoveredButton: {
      padding: 10,
      backgroundColor: colors.purple, // Using your colors resource
      borderRadius: 5,
      marginLeft: 5,// Update to your actual color variable
    },
    buttonText: {
      color: 'black',
      fontFamily: 'Montserrat',
    },
    hoveredButtonText: {
      color: 'white',
      fontFamily: 'Montserrat',
    },
  
  // Add other styles as needed
});

export default MemberManagement;
