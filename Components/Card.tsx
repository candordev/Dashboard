import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import colors from "../Styles/colors";
import { Post } from "../utils/interfaces";
import IssueView from "./IssueView";
import ProgressBar from "./ProgressBar";
import Text from "./Text";

interface CardProps {
  issue: Post;
  onPopoverCloseComplete: () => void; // Add this line
  isDisabled: boolean;
}

// const Card: React.FC<CardProps> = ({ issue }: any) => {
function Card(props: CardProps): JSX.Element {
  const { height, width } = useWindowDimensions();

  const formatDate = (createdAt: string): string => {
    const now = new Date();
    const createdDate = new Date(createdAt); // Parse the string into a Date object
    const diffMs = now.getTime() - createdDate.getTime(); // difference in milliseconds
    const diffMins = Math.round(diffMs / 60000); // minutes
    const diffHrs = Math.round(diffMins / 60); // hours
    const diffDays = Math.round(diffHrs / 24); // days
  
    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHrs < 24) {
      return `${diffHrs} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      // Format the date to show in "MM/DD/YYYY" format
      return createdDate.toLocaleDateString();
    }
  };


  const issueContent = props.issue.content.substring(0, 100).toString();
  console.log(issueContent); // Add this to check what `issue` contains




  return (
    <Popover
      onCloseComplete={props.onPopoverCloseComplete} // Use the handler here
      from={
        <TouchableOpacity style={styles.card} disabled={props.isDisabled}>
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
          <Text
                style={{
                    fontSize: 13,
                    fontWeight: "500",
                    fontFamily: "Montserrat",
                    color: "gray",
                    marginBottom: 3,
                    //marginLeft: 5,
                }}
            >
                 {formatDate(props.issue.createdAt)}
            </Text>
          <Text style={styles.content}>{issueContent}</Text>
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
    padding: 15,
    marginVertical: 7,
  },
  title: {
    fontSize: 17,
    fontWeight: "650" as any,
  },
  content: {
    fontSize: 15,
  },
});

export default Card;
