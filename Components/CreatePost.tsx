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
import CreatePostView from "./CreatePostView";

interface CreatePost {

}

// const Card: React.FC<CardProps> = ({ issue }: any) => {
function CreatePost(props: CreatePost): JSX.Element {
  const { height, width } = useWindowDimensions();

  const [isPopupVisible, setIsPopupVisible] = useState(false);

    const closePopup = () => {
      setIsPopupVisible(false);
    };
    const openPopup = () => {
      setIsPopupVisible(true);
    };


  return (
    <Popover
        from={(
          <TouchableOpacity style={styles.card} onPress={openPopup}>
            <Text style={styles.title}>Create Post</Text>
          </TouchableOpacity>
        )}
        isVisible={isPopupVisible}
        onRequestClose={closePopup}
        placement={PopoverPlacement.FLOATING}
        popoverStyle={{
          borderRadius: 10,
          width: width * 0.4,
          height: height * 0.9,
        }}
      >
        <CreatePostView onClose={closePopup} />
      </Popover>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    padding: 8,
    borderRadius: 10,
    backgroundColor: colors.purple
  },
  title: {
    fontSize: 15,
    fontWeight: "650" as any,
    color: 'white'
  },
});

export default CreatePost;
