import React, { useState } from "react";
import { View } from "react-native";
import MemberManagement from "../Components/MemberManagement"; // Update the import path as needed
import { useUserContext } from "../Hooks/useUserContext";
import DocumentList from "../Components/DocumentList";
import PrioritySetter from "../Components/PrioritySetter";
import TagEditor from "../Components/TagEditor";
import DepartmentEditor from "../Components/DepartmentEditor";
import GroupSettingsHeader from "./GroupSettingsHeader";
import colors from "../Styles/colors";


const GroupSettingsScreen = () => {
    const { state } = useUserContext();

    const [selectedGroupID, setSelectedGroupID] = useState('');

    const handleGroupSelect = (groupID: any) => {
        setSelectedGroupID(groupID);
    };


    return (
        <View style={{ flex: 1, backgroundColor: colors.white}}>
            <GroupSettingsHeader groups={state.leaderGroups} onGroupSelect={handleGroupSelect}/>
            <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ width: '50%', height: '100%' }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 40 }}> {/* This will take up 70% of the height */}
                    <DocumentList groupID={selectedGroupID} />
                    </View>
                    <View style={{ flex: 30}}> {/* This will take up 30% of the height */}
                        <DepartmentEditor groupID={selectedGroupID} />
                    </View>
                    <View style={{ flex: 30 }}> {/* This will take up 30% of the height */}
                        <PrioritySetter groupID={selectedGroupID} />

                    </View>
                </View>
            </View>
            <View style={{ width: '50%', height: '100%' }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 65 }}> {/* This will take up 70% of the height */}
                        <MemberManagement groupID={selectedGroupID} userID= {state._id} />      
                    </View>
                    <View style={{ flex: 35}}> {/* This will take up 30% of the height */}
                        <TagEditor groupID={selectedGroupID} />
                    </View>
                </View>
            </View>
        </View>
        </View>
    );
};

export default GroupSettingsScreen;
