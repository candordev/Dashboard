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


  useEffect(() => {
    fetchPrivateChat()
  }, []);

  const renderComment = (comment: Comment) => {
    console.log("HHBB state.user: ", state._id)
    console.log("HHBB comment.authorID: ", comment.authorID)
  
    const isAuthor = String(comment.authorID).trim() === String(state._id).trim();
    console.log("HHBB: ", comment)
    return (
      <View key={comment._id} style={styles.commentContainer}>
          {!isAuthor && (
              <Text style={styles.userName}>{`${comment.profile.firstName} ${comment.profile.lastName}`}</Text>
          )}
          <View style={isAuthor ? styles.authorSelf : styles.authorOther}>
              <Text style={isAuthor ? {color: 'white'}: {color: 'black'}}>{comment.content}</Text>
          </View>
      </View>
  );
};

async function postComment() {
  console.log("COMMENT POSTED")
  try {
    let res: Response = await customFetch(Endpoints.createComment, {
      method: "POST",
      body: JSON.stringify({
        content: newCommentContent,
        postID: props.issueID,
        parentID: undefined,
        privateChat: "true",
      }),
    });

    let resJson = await res.json();
    if (!res.ok) {
      console.error(resJson.error);
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
authorSelf: {
    textAlign: 'right',
    backgroundColor: colors.purple,
    color: 'white',
    alignSelf: 'flex-end',
    margin: 5,
    padding: 10,
    borderRadius: 10,
},
authorOther: {
    textAlign: 'left',
    backgroundColor: 'lightgray',
    color: 'black',
    alignSelf: 'flex-start',
    margin: 5,
    padding: 10,
    borderRadius: 10,
},
userName: {
    color: 'grey',
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
  }
});
