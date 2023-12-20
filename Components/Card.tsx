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
  onPopoverClose: () => void; // Add this line
}

// const Card: React.FC<CardProps> = ({ issue }: any) => {
function Card(props: CardProps): JSX.Element {
  const { height, width } = useWindowDimensions();
  const [popoverVisible, setPopoverVisible] = useState(false);

  const handleClosePopover = () => {
    setPopoverVisible(false);
    props.onPopoverClose(); // Call the passed callback
  };
  
  const issueContent = props.issue.content.substring(0, 100).toString();
  console.log(issueContent); // Add this to check what `issue` contains


  return (
    <Popover  
      //isVisible={popoverVisible}
      onRequestClose={handleClosePopover} // Add this prop
    
      from={
        <Pressable style={styles.card} onPress={() => setPopoverVisible(true)}>
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
