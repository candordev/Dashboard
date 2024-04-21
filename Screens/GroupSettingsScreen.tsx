import React, { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import DepartmentEditor from "../Components/DepartmentEditor";
import DocumentList from "../Components/DocumentList";
import DownloadReport from "../Components/DownloadReport";
import MemberManagement from "../Components/MemberManagement"; // Update the import path as needed
import NotificationPopup from "../Components/NotificationPopup";
import OuterView from "../Components/OuterView";
import PrioritySetter from "../Components/PrioritySetter";
import TagEditor from "../Components/TagEditor";
import { useUserContext } from "../Hooks/useUserContext";
import colors from "../Styles/colors";
import GroupSettingsHeader from "./GroupSettingsHeader";

const GroupSettingsScreen = ({ navigation }: any) => {
  const { state } = useUserContext();

  const [selectedGroupID, setSelectedGroupID] = useState(
    state.leaderGroups && state.leaderGroups.length > 0
      ? state.leaderGroups[0]._id
      : ""
  );

  const handleGroupSelect = (groupID: any) => {
    setSelectedGroupID(groupID);
  };

  return (
    <>
      <NotificationPopup navigation={navigation} />
      <OuterView style={{ backgroundColor: colors.white }}>
        {state.master != null && (
          <GroupSettingsHeader
            groups={state.leaderGroups}
            onGroupSelect={handleGroupSelect}
          />
        )}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexDirection: "row" }}
        >
          <View style={{ flex: 1 }}>
            <DocumentList groupID={selectedGroupID} />
            <DepartmentEditor groupID={selectedGroupID} />
            <PrioritySetter groupID={selectedGroupID} />
          </View>
          <View style={{ flex: 1 }}>
            <TagEditor groupID={selectedGroupID} />
            <MemberManagement groupID={selectedGroupID} userID={state._id} />
            <DownloadReport groupID={selectedGroupID} />
          </View>
        </ScrollView>
      </OuterView>
    </>
  );
};

export default GroupSettingsScreen;
