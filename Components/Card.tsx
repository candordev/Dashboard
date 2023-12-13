import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import IssueView from "./IssueView";
import ProgressBar from "./ProgressBar";
import Text from "./Text";
import colors from "../Styles/colors";
import { Post } from "../utils/interfaces";
import { Link, useNavigation } from "@react-navigation/native";

interface CardProps {
  issue: Post;
  remainOpen: boolean;
}

// const Card: React.FC<CardProps> = ({ issue }: any) => {
function Card(props: CardProps): JSX.Element {
  const { height, width } = useWindowDimensions();

  return (
    <Popover
      isVisible={props.remainOpen ? true : undefined}
      from={
        <TouchableOpacity style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Text style={styles.title}>{props.issue.title}</Text>
            <ProgressBar step={props.issue.step} />
          </View>
          <Text style={styles.content}>{props.issue.content}</Text>
        </TouchableOpacity>
      }
      placement={PopoverPlacement.FLOATING}
      popoverStyle={{
        borderRadius: 10,
        width: width * 0.7,
        height: height * 0.9,
      }}
    >
      <IssueView issue={props.issue} />
    </Popover>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    marginVertical: 7,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // // shadowOpacity: 0.1,
    // // shadowRadius: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "650" as any,
  },
  content: {
    fontSize: 16,
  },
});

export default Card;
