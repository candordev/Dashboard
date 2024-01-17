import React, { useEffect, useState } from "react";
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
import { formatDate } from "../utils/utils";

interface CardProps {
  issue: Post;
  onPopoverCloseComplete: () => void; // Add this line
  hasInitialOpen: () => void; // Add this line
  isDisabled: boolean;
}

// const Card: React.FC<CardProps> = ({ issue }: any) => {
function Card(props: CardProps & { initialOpen?: boolean }): JSX.Element {
  const { height, width } = useWindowDimensions();

  const issueContent = props.issue.content.substring(0, 100).toString();
  console.log(issueContent); // Add this to check what `issue` contains

  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  useEffect(() => {
    if (props.initialOpen) {
      setIsPopoverVisible(true);
      props.hasInitialOpen();
    }
  }, [props.initialOpen]);

  const togglePopover = () => {
    setIsPopoverVisible(!isPopoverVisible);
  };

  return (
    <Popover
      isVisible={isPopoverVisible}
      onRequestClose={togglePopover}
      onCloseComplete={() => {
        setIsPopoverVisible(false);
        props.onPopoverCloseComplete();
      }}
      from={
        <TouchableOpacity
          style={styles.card}
          disabled={props.isDisabled}
          onPress={togglePopover}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <View style={{flex: 1}}>
              <Text style={[styles.title, {marginBottom: 3,}]}>{props.issue.title}</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "500",
                  fontFamily: "Montserrat",
                  color: "gray",
                }}
              >
                {formatDate(props.issue.createdAt)}
              </Text>
            </View>
            <ProgressBar step={props.issue.step} />
          </View>
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
    fontSize: 15.5,
    fontWeight: "600",
  },
  content: {
    fontSize: 14,
  },
});

export default Card;
