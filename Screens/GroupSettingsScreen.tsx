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
import OuterView from "../Components/OuterView";
import { ScrollView } from "react-native-gesture-handler";
import NotificationPopup from "../Components/NotificationPopup";
import GroupActivityResetTime from "../Components/GroupActivityResetTime";
import DownloadReport from "../Components/DownloadReport";

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
          {state.master != null && (
            <GroupActivityResetTime groupID={selectedGroupID} />
          )}
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
