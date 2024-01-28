import React, { useEffect, useState } from "react";
import {
  Pressable,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Text,
} from "react-native";
import colors from "../Styles/colors";
import styles from "../Styles/styles";
import { Endpoints } from "../utils/Endpoints";
import {
  Notification,
  NotificationData,
  NotificationType,
  Post,
} from "../utils/interfaces";
import { customFetch } from "../utils/utils";
import { event, eventNames } from "../Events";
import NotifPicture from "../Screens/NotifPicture";
import IssueView from "./IssueView";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import { formatDate } from "../utils/utils"; // Make sure this path is correct
import { set } from "lodash";

type Props = {
  notif: Notification;
  navigation: any;
  onPopoverCloseComplete: () => void; // Add this line
  isDisabled: boolean;
  setSelectedPost: (post: Post | undefined) => void;
  setSelectedNotification: (post: Notification | undefined) => void;
  selectedPost: Post | null | undefined;
};

function imageURL(contentType: NotificationType) {
  switch (contentType) {
    case NotificationType.commentLike:
      return "Like";
    case NotificationType.newComment:
      return "Comment";
    case NotificationType.updatePost:
      return "Update";
    case NotificationType.upvote:
      return "Like";
    case NotificationType.announcement:
      return "Announcement";
    case NotificationType.pollVote:
      return "PollVote";
    case NotificationType.proposalAccepted:
      return "Accept";
    case NotificationType.proposalUnaccepted:
      return "Bell";
    case NotificationType.proposal:
      return "Proposal";
    default:
      return "Bell";
  }
}

const fetchPost = async (postId: string | undefined) => {
  try {
    if (postId) {
      let res: Response = await customFetch(
        Endpoints.getPostById +
          new URLSearchParams({
            postID: postId,
          }),
        {
          method: "GET",
        }
      );
      let resJson = await res.json();
      if (!res.ok) {
      }
      if (res.ok) {
        const result: Post = resJson;
        // console.info("fetched post is ", result);
        return result;
      }
    }
  } catch (error) {}
};

const NotifSection = (props: Props) => {
  const [notif, setNotif] = useState<Notification>(props.notif);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    setIsSelected(props.selectedPost?._id === notif.data?.postID);
  }, [props.selectedPost]);

  const fetchAndSetPost = async () => {
    try {
      const post = await fetchPost(notif.data?.postID);
      console.log("NOTIF WAS CLICKED", post);
      props.setSelectedPost(post);
      props.setSelectedNotification(notif)
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };


  useEffect(() => {
    console.log("THIS IS THE NOTIF: ", props.notif)
    setNotif(props.notif);
  }, [props.notif]);



  const handleNotificationClick = async () => {
    try {
      let res: Response = await customFetch(Endpoints.seenNotification, {
        method: "POST",
        body: JSON.stringify({ notificationID: notif._id }),
      });
      let resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error);
      }
      setNotif((notif: Notification) => ({ ...notif, seen: true }));
      event.emit(eventNames.FETCH_NOTIFS);
      console.log("POST REQUEST HAPPENED");
      fetchAndSetPost();
    } catch (error) {
      console.error("Error marking notification as seen: ", error);
      throw error;
    }
  };

  const { height, width } = useWindowDimensions();

  return (
    <TouchableOpacity
      disabled={props.isDisabled}
      onPress={handleNotificationClick}
      style={[
        styles.seenNotifCard,
        notif.seen
          ? {}
          : { borderLeftColor: colors.purple, borderLeftWidth: 4 },
          isSelected ? { backgroundColor: colors.lightestgray } : {},
      ]}
    >
      <NotifPicture
        smallUrl={imageURL(notif.data?.contentType)}
        mainUrl={notif.picture}
        type={"big"}
      />
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "600", flex: 1 }} numberOfLines={1}>
            {notif.title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.gray,
              flexWrap: "nowrap",
              marginLeft: 5,
            }}
            numberOfLines={1}
          >
            {formatDate(notif.fireDate)} {/* Display the formatted date */}
          </Text>
        </View>
        <Text
          style={[styles.sectionDescription, { flex: 1 }]}
          numberOfLines={2}
        >
          {notif.content}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotifSection;
