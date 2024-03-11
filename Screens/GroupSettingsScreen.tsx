import React from "react";
import { View } from "react-native";
import MemberManagement from "../Components/MemberManagement"; // Update the import path as needed
import { useUserContext } from "../Hooks/useUserContext";
import DocumentList from "../Components/DocumentList";

const GroupSettingsScreen = ({  }) => {
    const { state } = useUserContext();
    const groupID = state.leaderGroups[0]; // Assuming you're obtaining the groupID this way

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ width: '50%', height: '100%' }}>
                <MemberManagement groupID={groupID} />
            </View>
            <View style={{ width: '50%', height: '100%' }}>
                <DocumentList groupID={groupID} />
            </View>
        </View>
    );
};

export default GroupSettingsScreen;
