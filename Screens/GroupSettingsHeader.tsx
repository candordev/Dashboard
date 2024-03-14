import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Dimensions, ActivityIndicator } from "react-native";
import DropDown from "../Components/DropDown";
import colors from "../Styles/colors";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";
import { useUserContext } from "../Hooks/useUserContext";

const { width, height } = Dimensions.get('window');

interface Group {
    _id: string;
    name: string;
}
  
interface GroupSettingsHeaderProps {
    groups: Group[];
    onGroupSelect: (groupId: string) => void;
}

const GroupSettingsHeader: React.FC<GroupSettingsHeaderProps> = ({ groups, onGroupSelect }) => {
    const { state, dispatch } = useUserContext();
    const [selectedGroup, setSelectedGroup] = useState(state.leaderGroups && state.leaderGroups.length > 0 ? state.leaderGroups[0]._id : '');
    const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);
    const [newGroupName, setNewGroupName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false); // New loading state



    const items = groups.map(group => ({
        label: group.name,
        value: group._id
    }));

        const handleSelectGroup = (groupId: string) => {
        setSelectedGroup(groupId); // Update local state
        onGroupSelect(groupId); // Call the passed in onGroupSelect prop
    };




    const handleCreateGroup = async () => {
        setIsLoading(true); // Start loading
              try {
                let res = await customFetch(Endpoints.createGroupInMaster, {
                  method: "POST",
                  body: JSON.stringify({
                    masterID: state.master._id,
                    name: newGroupName
                  }),
                });
                if (!res.ok) {
                  const resJson = await res.json();
                  console.error("Error with creating group:", resJson.error);
                } else {        
                    setIsLoading(false); // Start loading
                    setIsPopoverVisible(false); // Close the popover after submitting
                    setNewGroupName(''); // Reset the input field
                }
              } catch (error) {
                console.error("Network error, please try again later.", error);
              }
    };

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, backgroundColor: "white", zIndex: 10 }}>
            {/* Existing DropDown and other components */}

            <View style={{ flex: 4, marginRight: 10 }}> {/* Adjust flex value as needed */}
                  <DropDown
                    placeholder="Select a group"
                    value={selectedGroup}
                    setValue={handleSelectGroup}
                    items={items}
                    setItems={() => {}}
                    multiple={false}
                    backgroundColor="white"
                    onClose={() => console.log("Dropdown closed")}
                    // Make sure your DropDown component styles allow it to fill this parent View
                />
            </View>
            <View style={{ flex: 1, marginTop: 10}}> {/* Adjust flex value as needed for the button to fit */}
            <TouchableOpacity onPress={() => setIsPopoverVisible(true)} style={{ backgroundColor: colors.purple, padding: 10, borderRadius: 5 }}>
                <Text style={{ color: "white", textAlign: 'center' }}>Create Group</Text>
            </TouchableOpacity>
            {/* Popover for creating a new group */}
            <Popover
                isVisible={isPopoverVisible}
                onRequestClose={() => setIsPopoverVisible(false)}
                onCloseComplete={() => setIsPopoverVisible(false)}
                placement={PopoverPlacement.BOTTOM}
                popoverStyle={{ borderRadius: 10, padding: 20 }}>
               <View>
                {isLoading ? (
                    <ActivityIndicator size="large" color={colors.purple} />
                ) : (
                    <>
                        <TextInput 
                            style={{ backgroundColor: "white", padding: 10, marginBottom: 20, borderRadius: 5 }}
                            placeholder="Enter group name" 
                            value={newGroupName} 
                            onChangeText={setNewGroupName} 
                        />
                        <TouchableOpacity onPress={handleCreateGroup} style={{ backgroundColor: colors.purple, padding: 10, borderRadius: 5 }}>
                            <Text style={{ color: "white", textAlign: 'center' }}>Done</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
                
            </Popover>
            </View>
        </View>
    );
};

export default GroupSettingsHeader;












