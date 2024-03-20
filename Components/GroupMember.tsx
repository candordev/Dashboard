import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, TouchableOpacity, FlatList, Image, GestureResponderEvent, Platform, Modal, ScrollView } from "react-native";
import SearchBar from "../Components/SearchBar";
import Text from "../Components/Text";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";
import colors from "../Styles/colors"; // Make sure the path matches your project structure
import FeatherIcon from "react-native-vector-icons/Feather";
import { set } from "lodash";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import DropDown from "./DropDown";

type GroupMemberProps = {
    member: {
        user: string;
        profilePicture: string;
        firstName: string;
        lastName: string;
        isLeader: boolean;
        master?: string;
    };
    kickMember: () => void; // Function type declaration
    addLeader: () => void;
    removeLeader: () => void;
    groupID: string;
};


interface Department {
    _id: string;
    name: string;
    description: string;
    defaultDepartment: boolean;
}

const GroupMember = ({ groupID, member, kickMember, addLeader, removeLeader }: GroupMemberProps) => {

    const [departments, setDepartments] = useState<Department[]>([]);
    const [notDepartments, setNotDepartments] = useState<Department[]>([]); // New state to store non-department data
    const [isExpanded, setIsExpanded] = useState(false); // New state to track expansion
    const [selectedNotDepartmentIds, setSelectedNotDepartmentIds] = useState<string[]>([]);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [extraHeight, setExtraHeight] = useState(0);

    const notDepartmentItems = notDepartments.map(department => ({
        label: department.name,
        value: department._id,
    }));


    useEffect(() => {
        if (member.isLeader) {
            fetchLeaderDepartments();
        }
    }, [isExpanded]); // Now dependency on isExpanded as well

    const adjustHeight = (isOpen: Boolean) => {
        setExtraHeight(isOpen ? 100 : 0); // Add 60 units when open, reset to 0 when closed
      };
    

    async function fetchLeaderDepartments() {
        try {
          const queryParams = new URLSearchParams({
            groupID: groupID,
            userToGet: member.user,
          });
          const url = `${Endpoints.getDepartmentsForLeader}${queryParams.toString()}`;
          const response = await customFetch(
            url,
            { method: "GET" }
          );
          const data = await response.json();
          console.log("DATA", data);
          if (response.ok) {
            setDepartments(data.isLeader);
            setNotDepartments(data.notLeader); // Set non-department data
          } else {
            console.error("Error fetching members: ", data.error);
          }
        } catch (error) {
          console.error("Network error while fetching members: ", error);
        }
      }

      async function removeLeaderFromDepartment(departmentID: string) {
        try {
            let res = await customFetch(Endpoints.removeLeaderFromDepartment, {
              method: "POST",
              body: JSON.stringify({
                departmentID: departmentID,
                userToRemove: member.user,
              }),
            }); 
            if (!res.ok) {
              const resJson = await res.json();
              console.error("Error with removing member from group:", resJson.error);
            } else {
              fetchLeaderDepartments();
            }
        } catch (error) {
        console.error("Network error, please try again later.", error);
        }
      }

    const toggleExpand = () => setIsExpanded(!isExpanded); // Toggle expansion state

    const handleSelectNotDepartments = (itemIds: [string]) => {
        setSelectedNotDepartmentIds(itemIds);
    };

    async function handleDropdownClose () {
        console.log(selectedNotDepartmentIds, "selectedNotDepartmentIds");
        await addLeaderToDepartment(selectedNotDepartmentIds);
        setSelectedNotDepartmentIds([]);
        fetchLeaderDepartments();
    };

    async function addLeaderToDepartment(departmentIDs: string[]) {
        try {
            if (departmentIDs.length === 0) {
              return;
            }
            let res = await customFetch(Endpoints.addLeadersToDepartment, {
              method: "POST",
              body: JSON.stringify({
                departmentIDs: departmentIDs,
                userToAdd: member.user,
              }),
            }); 
            if (!res.ok) {
              const resJson = await res.json();
              console.error("Error with removing member from group:", resJson.error);
            } else {
              console.log("success!")
            }
        } catch (error) {
        console.error("Network error, please try again later.", error);
        }
      }
      

    const handleOpeningDropdown = (isOpen: boolean) => {
        setOpenDropdown(isOpen);
        adjustHeight(isOpen);
    }

      return (
          <View style={{flex: 20}}>
              <Pressable onPress={toggleExpand} style={styles.memberContainer}>
                  <Image source={{ uri: member.profilePicture }} style={styles.profilePic} />
                  <View style={styles.infoAndButtonsContainer}>
                      <Text style={styles.memberText}>
                          {member.firstName} {member.lastName}
                      </Text>
                      {member.isLeader && <FeatherIcon name="check-circle" size={20} color={colors.purple} />}
                      <View style={styles.buttonGroup}>
                          {member.master === "" && (
                            <TouchableOpacity
                            onPress={member.isLeader ? removeLeader : addLeader}
                            style={styles.button}
                            >
                            <Text style={styles.buttonText}>{member.isLeader ? "Remove Leader" : "Add Leader"}</Text>
                             </TouchableOpacity>
                          )}
                          {!member.isLeader && (
                              <TouchableOpacity onPress={kickMember} style={[styles.button, styles.kickButton]}>
                                  <Text style={styles.buttonText}>Remove From Group</Text>
                              </TouchableOpacity>
                          )}
                      </View>
                  </View>
              </Pressable>
              {isExpanded && member.isLeader && (
                 <View style={[styles.departmentsContainer, { paddingBottom: extraHeight, zIndex: 100 }]}>
                    <Text style={styles.departmentsTitle}>Departments:</Text>
                    {departments.map((dept) => (
                        <View key={dept._id} style={styles.departmentItem}>
                            <Text style={styles.departmentText}>{dept.name}</Text>
                            {departments.length > 1 && (
                                <TouchableOpacity onPress={() => removeLeaderFromDepartment(dept._id)} style={styles.deleteButton}>
                                    <FeatherIcon name="trash" size={15} color={colors.red} />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                    {notDepartments.length > 0 && (
                        <DropDownPicker
                        open={openDropdown}
                        value={selectedNotDepartmentIds}
                        items={notDepartmentItems}
                        setOpen={handleOpeningDropdown}
                        setValue={setSelectedNotDepartmentIds}
                        listMode="SCROLLVIEW" // Ensure scrollable dropdown
                        dropDownContainerStyle={{
                            position: 'absolute', // Position dropdown absolutely to lift it above other content
                            width: '100%', // Ensure it spans the width of its container
                            zIndex: 1000,
                            maxHeight: 90 // Lift above other content
                        }}
                        style={{
                            zIndex: 1000, // Also ensure the input part of the picker is lifted
                        }}
                        setItems={setNotDepartments} // This function is not necessary if items are not dynamically changed
                        multiple={true}
                        min={0}
                        max={notDepartmentItems.length}
                        placeholder="Select Departments"
                        backgroundColor={colors.lightestgray}
                        onClose={handleDropdownClose}
                        zIndex={1000} // Ensure dropdown is displayed above other components
                        zIndexInverse={1000}
                        multipleText={`${selectedNotDepartmentIds?.length ?? 0} ${
                            (selectedNotDepartmentIds?.length ?? 0) == 1 ? "Department" : "Departments"
                        } selected`}/>
                    //     <DropDown
                    //     placeholder="Select Departments"
                    //     value={selectedNotDepartmentIds}
                    //     setValue={setSelectedNotDepartmentIds}
                    //     items={notDepartmentItems}
                    //     setItems={setNotDepartments}
                    //     multiple={true}
                    //     backgroundColor={colors.lightestgray}
                    //     onClose={handleDropdownClose}
                    //     multipleText={`${selectedNotDepartmentIds?.length ?? 0} ${
                    //       (selectedNotDepartmentIds?.length ?? 0) == 1 ? "Department" : "Departments"
                    //     } selected`}
                    //   />
                        )}


                
                </View>
              )}
          </View>
      );
    }
  
  const styles = StyleSheet.create({
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
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 5,
        },
        web: {
          // Example values for boxShadow
          boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)', // offsetX offsetY blurRadius color
        }
      }),
    },
    departmentsContainer: {
        paddingLeft: 20, // Adjust based on your layout
    },
    departmentsTitle: {
        fontWeight: 'bold',
        marginVertical: 10,
    },
    departmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 10,
        marginBottom: 5,
    },
    departmentText: {
        fontSize: 16,
    },
  scrollContainer: {
  paddingHorizontal: 10,
  paddingVertical: 10,
  },
    memberContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    profilePic: {
      width: 35,
      height: 35,
      borderRadius: 25,
    },
    infoAndButtonsContainer: {
      flex: 1,
      flexDirection: 'row', // Align items in a row
      alignItems: 'center', // Center items vertically
      marginLeft: 10,
    },
    memberText: {
      marginRight: 10, // Add some space before the icon
      color: colors.black,
      fontFamily: 'Montserrat',
      flexShrink: 1, // Allow text to shrink if needed
    },
    buttonGroup: {
      flexDirection: 'row',
      marginLeft: 'auto', // Push button group to the end of the container
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
      color: 'black',
      fontFamily: 'Montserrat',
    },
    leaderText: {
      color: colors.purple,
      flex: 1,
      marginLeft: 10,
      fontFamily: 'Montserrat',
    },
      hoveredButton: {
        padding: 10,
        backgroundColor: colors.purple, // Using your colors resource
        borderRadius: 5,
        marginLeft: 5,// Update to your actual color variable
      },
      hoveredButtonText: {
        color: 'white',
        fontFamily: 'Montserrat',
      },
      deleteButton: {
        padding: 8,
      },
  });
  
  export default GroupMember;