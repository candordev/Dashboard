import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DocumentList from "../Components/DocumentList";
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
  const [selectedOption, setSelectedOption] = useState("Training Web Widget");

  const isInternalAIChat =
    isGroup(state.currentGroup, GroupIds.Brock) ||
    isGroup(state.currentGroup, GroupIds.Caleb);

  const isDemoOrIsaac =
    isGroup(state.currentGroup, GroupIds.Demo) ||
    isGroup(state.currentGroup, GroupIds.Issac);

  const renderHorizontalGroups = () => (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <ThirdstoneFAQGroup
        documentTitle={"ThirdStoneFAQOwner"}
        headerTitle={"Owner"}
      />
      <ThirdstoneFAQGroup
        documentTitle={"ThirdStoneFAQPR"}
        headerTitle={"Prospective Resident"}
      />
      <ThirdstoneFAQGroup
        documentTitle={"ThirdStoneFAQCR"}
        headerTitle={"Current Resident"}
      />
    </View>
  );

  const renderContent = () => {
    if (isInternalAIChat) {
      return (
        <>
          <View style={{ flex: 1 }}>
            <DocumentList groupID={state.leaderGroups[0]._id} />
          </View>
          <View style={{ flex: 1 }}>
            <FAQList groupID={state.leaderGroups[0]._id} />
          </View>
        </>
      );
    } else {
      return selectedOption === "Training Web Widget" ? (
        renderHorizontalGroups()
      ) : (
        <View style={{ flexDirection: "row", flex: 1 }}>
          <View style={{ flex: 1 }}>
            <DocumentList groupID={state.leaderGroups[0]._id} />
          </View>
          <View style={{ flex: 1 }}>
            <FAQList groupID={state.leaderGroups[0]._id} />
          </View>
        </View>
      );
    }
  };

  return (
    <>
      <NotificationPopup navigation={navigation} />
      <OuterView style={{ backgroundColor: colors.white, flex: 1, borderRadius: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
            backgroundColor: colors.white,
          }}
        >
          <Text style={{ fontWeight: "600", fontSize: 27, fontFamily: "Montserrat" }}>
            {"Train"}
          </Text>
          {isDemoOrIsaac && (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 20,
                  borderWidth: 1,
                  backgroundColor:
                    selectedOption === "Training Web Widget" ? colors.purple : colors.white,
                  borderColor: colors.purple,
                }}
                onPress={() => setSelectedOption("Training Web Widget")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: selectedOption === "Training Web Widget" ? colors.white : colors.purple,
                  }}
                >
                  Training Web Widget
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 20,
                  borderWidth: 1,
                  backgroundColor:
                    selectedOption === "Training Internal Chat Bot" ? colors.purple : colors.white,
                  borderColor: colors.purple,
                }}
                onPress={() => setSelectedOption("Training Internal Chat Bot")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color:
                      selectedOption === "Training Internal Chat Bot" ? colors.white : colors.purple,
                  }}
                >
                  Training Internal Chat Bot
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {renderContent()}
      </OuterView>
    </>
  );
};

export default TrainChatScreen;
