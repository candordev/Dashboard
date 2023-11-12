import React from "react";
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

interface CardProps {
  issue: any;
}

const Card: React.FC<CardProps> = ({ issue }: any) => {
  const { height, width } = useWindowDimensions();

  return (
    <Popover
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
            <Text style={styles.title}>{issue.title}</Text>
            <ProgressBar step={1} underText="In Progress" />
          </View>
          <Text style={styles.content}>{issue.description}</Text>
        </TouchableOpacity>
      }
      placement={PopoverPlacement.FLOATING}
      popoverStyle={{
        borderRadius: 10,
        width: width * 0.7,
        height: height * 0.9,
      }}
    >
      <IssueView />
    </Popover>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
