import React from "react";
import { View } from "react-native";
import Text from "./Text";
import colors from "../Styles/colors";
import ProfileRow from "./ProfileRow";
import Assignees from "./Assignees";
import Category from "./Category";
import MarkDone from "./MarkDone";
import CloseIssue from "./CloseIssue";

const IssueRightView = () => {
  return (
    <View
      style={{
        height: "100%",
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <View style={{rowGap: 10,}}>
        <Assignees />
        <Category />
      </View>
      <View style={{rowGap: 10,}}>
        <MarkDone />
        <CloseIssue />
      </View>
    </View>
  );
};

export default IssueRightView;
