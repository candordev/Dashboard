import React from "react";
import { View } from "react-native";
import MemberManagement from "../Components/MemberManagement"; // Update the import path as needed
import { useUserContext } from "../Hooks/useUserContext";
import DocumentList from "../Components/DocumentList";
import PrioritySetter from "../Components/PrioritySetter";
import TagEditor from "../Components/TagEditor";
import DepartmentEditor from "../Components/DepartmentEditor";

const GroupSettingsScreen = () => {
    const { state } = useUserContext();
    const groupID = state.leaderGroups[0]; // Assuming you're obtaining the groupID this way

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ width: '50%', height: '100%' }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 30 }}> {/* This will take up 70% of the height */}
                        <MemberManagement groupID={groupID} userID= {state._id} />
                    </View>
                    <View style={{ flex: 35}}> {/* This will take up 30% of the height */}
                        <DepartmentEditor groupID={groupID} />
                    </View>
                    <View style={{ flex: 35 }}> {/* This will take up 30% of the height */}
                        <PrioritySetter groupID={groupID} />
                    </View>
                </View>
            </View>
            <View style={{ width: '50%', height: '100%' }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 65 }}> {/* This will take up 70% of the height */}
                        <DocumentList groupID={groupID} />
                    </View>
                    <View style={{ flex: 35}}> {/* This will take up 30% of the height */}
                        <TagEditor groupID={groupID} />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default GroupSettingsScreen;
