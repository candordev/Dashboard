import React from "react";
import { View } from "react-native";
import MemberManagement from "../Components/MemberManagement"; // Update the import path as needed
import { useUserContext } from "../Hooks/useUserContext";

const GroupSettingsScreen = ({  }) => {
    const { state } = useUserContext();
    const groupID = state.leaderGroups[0]; // Assuming you're obtaining the groupID this way

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}> {/* Use flexDirection to layout children horizontally */}
            {/* Wrapper View with width set to 50% */}
            <View style={{ width: '40%', height: '100%' }}> {/* Adjusts for half width, full height */}
                <MemberManagement groupID={groupID} />
            </View>
            {/* Optionally, add another View here to utilize the other half of the screen */}
            <View style={{ width: '50%', height: '100%' }}>
                {/* Additional content can be placed here */}
            </View>
        </View>
    );
};

export default GroupSettingsScreen;
