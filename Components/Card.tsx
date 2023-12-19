import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
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

interface CardProps {
  issue: Post;
  onPopoverVisibilityChange: (isVisible: boolean) => void;
}

// const Card: React.FC<CardProps> = ({ issue }: any) => {
function Card(props: CardProps): JSX.Element {
  const { height, width } = useWindowDimensions();
  const [popoverVisible, setPopoverVisible] = useState(false);

  // const togglePopover = () => {
  //   setPopoverVisible((currentVisible) => {
  //     const newVisible = !currentVisible;
  //     console.log("CARD NEW VISIBLE", newVisible)
  //     props.onPopoverVisibilityChange(newVisible); // Notify the parent component
      
  //     return newVisible;
  //   });
  // };


  const togglePopover = () => {
    setPopoverVisible(!popoverVisible);
  };

  const onRequestClose = () => {
    setPopoverVisible(false);
    props.onPopoverVisibilityChange(false); // Notify AllScreen when the popover closes
  };
  
  const issueContent = props.issue.content.substring(0, 100).toString();
  console.log(issueContent); // Add this to check what `issue` contains


  return (
    <Popover  
      from={
        
        <Pressable style={styles.card} onPress={togglePopover}>
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
          <Text style={styles.content}>{issueContent}</Text>
        </Pressable>
      }
      onRequestClose={onRequestClose}
      placement={PopoverPlacement.FLOATING}
      popoverStyle={{
        borderRadius: 10,
        width: width * 0.7,
        height: height * 0.9,
      }}
    >
      <IssueView issue={props.issue}/>
    </Popover>
  );
};

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
