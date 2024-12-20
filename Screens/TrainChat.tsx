import React from "react";
import { View } from "react-native";
import DocumentList from "../Components/DocumentList"; // Update the import path as needed
import FAQList from "../Components/FAQList";
import NotificationPopup from "../Components/NotificationPopup";
import OuterView from "../Components/OuterView";
import ThirdstoneFAQGroup from "../Components/ThirdstoneFAQGroup";
import { useUserContext } from "../Hooks/useUserContext";
import colors from "../Styles/colors";
import { GroupIds } from "../utils/constants";
import { isGroup } from "../utils/utils";

const TrainChatScreen = ({ navigation }: any) => {
  const { state } = useUserContext();
  const isInternalAIChat =
    isGroup(state.currentGroup, GroupIds.Brock) ||
    isGroup(state.currentGroup, GroupIds.Caleb);

  if (isInternalAIChat) {
    const groupID = state.leaderGroups[0]._id;

    return (
      <>
        <NotificationPopup navigation={navigation} />
        <OuterView
          style={{
            backgroundColor: colors.white,
            flexDirection: "row",
            flex: 1,
            borderRadius: 20,
            overflow: "visible",
          }}
        >
          <View style={{ flex: 1 }}>
            <DocumentList groupID={groupID} />
          </View>
          <View style={{ flex: 1 }}>
            <FAQList groupID={groupID} />
          </View>
        </OuterView>
      </>
    );
  } else {
    return (
      <OuterView
        style={{
          backgroundColor: colors.white,
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1 }}>
          <ThirdstoneFAQGroup
            documentTitle={"ThirdStoneFAQOwner"}
            headerTitle={"Owner"}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ThirdstoneFAQGroup
            documentTitle={"ThirdStoneFAQPR"}
            headerTitle={"Prospective Resident"}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ThirdstoneFAQGroup
            documentTitle={"ThirdStoneFAQCR"}
            headerTitle={"Current Resident"}
          />
        </View>
      </OuterView>
    );
  }
};

export default TrainChatScreen;
