import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "./Text";
import colors from "../Styles/colors";
import IssueLeftView from "./IssueLeftView";
import IssueMiddleView from "./IssueMiddleView";
import IssueRightView from "./IssueRightView";
import { Post } from "../utils/interfaces";

interface IssueViewProps {
  issue: Post;
}

function IssueView(props: IssueViewProps): JSX.Element {
  return (
    <View
      style={{
        padding: 10,
        alignItems: "center",
        flexDirection: "row",
        flex: 1,
        columnGap: 10,
      }}
    >
      <IssueLeftView issue={props.issue}/>
      <IssueMiddleView issue={props.issue}/>
      <IssueRightView issue={props.issue}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default IssueView;
