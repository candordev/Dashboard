import React from "react";
import { ScrollView, TextInput, View, StyleSheet } from "react-native";
import Text from "./Text";
import colors from "../Styles/colors";
import UpdateCard from "./UpdateCard";
import DoubleTextInput from "./DoubleTextInput";

const IssueMiddleView = () => {
  return (
    <View
      style={{
        borderColor: colors.lightestgray,
        borderWidth: 2,
        borderRadius: 10,
        height: "100%",
        flex: 1,
        padding: 10,
        justifyContent: "space-between",
      }}
    >
      <ScrollView contentContainerStyle={{ rowGap: 10, paddingBottom: 20 }}>
        <UpdateCard />
        <UpdateCard />
        <UpdateCard />
      </ScrollView>
      {/* <View
        style={{
          borderColor: colors.lightgray,
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
        }}
      >
        <TextInput
          style={{
            borderColor: colors.lightgray,
            borderBottomWidth: 1,
          }}
          placeholder="Update Title"
          placeholderTextColor={colors.gray}
          multiline={true}
        />
        <TextInput
          style={{
          }}
          placeholder="Update Content"
          placeholderTextColor={colors.gray}
          multiline={true}
        />
      </View> */}

      <DoubleTextInput/>
    </View>
  );
};

export default IssueMiddleView;
