import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import colors from "../Styles/colors";
import ExpandableTextInput from "./ExpandableTextInput";
import { Comment } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import { useUserContext } from "../Hooks/useUserContext";
import ProfilePicture from "./ProfilePicture";


interface PrivateChatProps {
  issueID: string;
}

function PrivateChat(props: PrivateChatProps): JSX.Element {
  const {state, dispatch} = useUserContext();
  const [privateComments, setPrivateComments] = useState<Comment[]>([]);
  const [newCommentContent, setNewCommentContent] = useState("");

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

  // <Text style={styles.userName}>{`${comment.profile.firstName} ${comment.profile.lastName}  ${formatDate(comment.)}`}</Text>


  useEffect(() => {
    fetchPrivateChat()
  }, []);

// Define the initial state with appropriate types and default values
let lastAuthorId = '';
let lastCommentDate = new Date(0);

const renderComment = (comment: Comment, index: number) => {
  const isAuthor = String(comment.authorID).trim() === String(state._id).trim();
  let showDate = false;

  if (lastAuthorId !== comment.authorID) {
      showDate = true;
  } else {
      const currentCommentDate = new Date(comment.date);
      if (currentCommentDate.getTime() - lastCommentDate.getTime() > 600000) {
          showDate = true;
      }
  }

  lastAuthorId = comment.authorID;
  lastCommentDate = new Date(comment.date);

  return (
    <View key={comment._id} style={styles.commentContainer}>
        <View style={styles.nameAndDateContainer}>
            {!isAuthor && (
                <>
                    <Text style={styles.userName}>
                        {`${comment.profile.firstName} ${comment.profile.lastName}`}
                    </Text>
                    {showDate && (
                        <Text style={styles.dateText}>
                            {formatDate(comment.date)}
                        </Text>
                    )}
                </>
            )}
            {isAuthor && showDate && (
                <Text style={styles.authorSelfDate}>
                    {formatDate(comment.date)}
                </Text>
            )}
        </View>
        <View style={isAuthor ? styles.authorSelf : styles.authorOther}>
            <Text style={isAuthor ? { color: 'white' } : { color: 'black' }}>
                {comment.content}
            </Text>
        </View>
    </View>
);
};


async function postComment() {
  console.log("COMMENT POSTED")
  try {
    let res: Response = await customFetch(Endpoints.sendPoliticianChat, {
      method: "POST",
      body: JSON.stringify({
        content: newCommentContent,
        postID: props.issueID,
      }),
    });

    let resJson = await res.json();
    if (!res.ok) {
      console.error("ERROR HAPPENDED: ", resJson.error);
    } else {
      fetchPrivateChat();
    }
  } catch (error) {
    console.error("Error loading posts. Please try again later.", error);
  }
}



  async function fetchPrivateChat() {
    try {
      const res: Response = await customFetch(
        Endpoints.getPrivateChats +
          new URLSearchParams({
            postID: props.issueID,
            skip: "0",
          }),
        {
          method: "GET",
        }
      );

      let resJson = await res.json();
      if (!res.ok) {
        console.error(resJson.error);
      } else {
        const newComments: Comment[] = resJson;
        console.log("newComments: ", newComments)
        setPrivateComments(newComments);
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    }
  }
  return (
    <View style={styles.chatContainer}>
        <Text style={styles.chatTitle}>Private Chat</Text>
        <ScrollView style={styles.messageContainer}>
            {privateComments.map(renderComment)}
        </ScrollView>
        <ExpandableTextInput
            onInputChange={(text) => setNewCommentContent(text)}
            onSubmit={postComment}
        />
    </View>
);
};

export default PrivateChat;
const styles = StyleSheet.create({

commentContainer: {
    marginVertical: 1,
},
dateText: {
  color: 'gray',
  marginLeft: 8
  // Add any other styling you need for the date text
},
authorSelf: {
    textAlign: 'right',
    backgroundColor: colors.purple,
    color: 'white',
    alignSelf: 'flex-end',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row-reverse', 
    maxWidth: '80%', // maximum width of 80%
},
authorOther: {
    textAlign: 'left',
    backgroundColor: colors.lightestgray,
    color: 'black',
    alignSelf: 'flex-start',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%', // maximum width of 80%
},
userName: {
    color: colors.purple,
    fontWeight: "500",
    alignSelf: 'flex-start',
    marginBottom: 0,
    marginLeft: 5
},
  chatContainer: {
      borderColor: colors.lightestgray,
      borderWidth: 2,
      marginBottom: 2,
      borderRadius: 10,
      padding: 10,
      flex: 1,
  },
  chatTitle: {
      fontSize: 18,
      fontWeight: "600",
      fontFamily: "Montserrat",
  },
  messageContainer: {
      flex: 1,
      marginTop: 10
  },
  nameAndDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align items to the start
    alignItems: 'center',
},
authorSelfDate: {
  color: 'gray',
  marginLeft: 'auto', // Pushes the date to the far left
},
});
