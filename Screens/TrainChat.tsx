import React from "react";
import { View } from "react-native";
import colors from "../Styles/colors";
import OuterView from "../Components/OuterView";
import NotificationPopup from "../Components/NotificationPopup";
import DocumentList from "../Components/DocumentList"; // Update the import path as needed
import FAQList from "../Components/FAQList";
import { useUserContext } from "../Hooks/useUserContext";
import RawChunks from "../Components/RawChunks";

const TrainChatScreen = ({ navigation }: any) => {
  const { state } = useUserContext();

  return (
    <OuterView
    style={{
      backgroundColor: colors.white,
      flexDirection: "row",
    }}
  >
    <View style={{ flex: 1 }}>
      <RawChunks documentTitle={"ThirdStoneFAQOwner"} headerTitle={"Owner"}/>
    </View>
    <View style={{ flex: 1 }}>
      <RawChunks documentTitle={"ThirdStoneFAQPR"} headerTitle={"Prospective Resident"}/>
    </View>
    <View style={{ flex: 1 }}>
      <RawChunks documentTitle={"ThirdStoneFAQCR"} headerTitle={"Current Resident"}/>
    </View>
  </OuterView>
  );
};

export default TrainChatScreen;
