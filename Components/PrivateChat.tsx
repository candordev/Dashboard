import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import colors from "../Styles/colors";
import ExpandableTextInput from "./ExpandableTextInput";
import { Comment, Post } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import { useUserContext } from "../Hooks/useUserContext";
import ProfilePicture from "./ProfilePicture";
import DropDown from "./DropDown";

interface PrivateChatProps {
  issue: Post;
}

function PrivateChat(props: PrivateChatProps): JSX.Element {
  const {state, dispatch} = useUserContext();
  const [privateComments, setPrivateComments] = useState<Comment[]>([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  
  const scrollViewRef = useRef<ScrollView>(null);
  

  const [chatMode, setChatMode] = useState("everyone");
  const [chatModeItems, setChatModeItems] = useState([
    { label: 'Everyone', value: 'everyone' },
    { label: 'Constituent', value: 'constituent' }
  ]);
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
  useEffect(() => {
    setPrivateComments([]); 
    fetchPrivateChat();
  }, [props.issue._id]); 

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
        {comment.isWhisper ? (
            <View style={styles.whisperCommentContainer}>
                <Text style={styles.whisperCommentText}>
                    {comment.content}
                </Text>
            </View>
        ) : (
          <>
          <View style={styles.nameAndDateContainer}>
            {!isAuthor && (
                <>
                    <Text style={styles.userName}>
                        {comment.contentType == "constituentChat" ? "Constituent Chat Response" : `${comment.profile.firstName} ${comment.profile.lastName}`}
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
          </>
        )}
    </View>
);
};


async function postComment() {
  try {
    let res: Response = await customFetch(Endpoints.createComment, {
      method: "POST",
      body: JSON.stringify({
        content: newCommentContent,
        postID: props.issue._id,
        parentID: undefined,
        privateChat: "true",
      }),
    });
    let resJson = await res.json();
    if (!res.ok) {
      console.error(resJson.error);
    } else {
      fetchPrivateChat();
      console.log("Comment Posted to Everyone")
    }
  } catch (error) {
    console.error("Error loading posts. Please try again later.", error);
  }
}

async function postConstituentComment() {
  try {
    let res = await customFetch(Endpoints.sendConstituentChat, {
      method: "POST",
      body: JSON.stringify({
        postID: props.issue._id,
        content: newCommentContent,
        user: state._id,
      }),
    });
    if (res.ok) {
      let resJson = await res.json();
      // Check if the response has 'success' and 'commentId'
      if (resJson.success && resJson.commentId) {
        // const commentID = resJson.commentId; // Use the 'commentId' from the response
        // await postPoliticianComment(commentID);
        fetchPrivateChat();
      } else {
        // Handle the case where the response does not have 'success' or 'commentId'
        console.error("Failed to post constituent comment: Missing 'success' or 'commentId'");
      }
    } else {
      console.error("Response from sendConstituentChat was not OK.");
      // Optionally handle the error response here
    }
  } catch (error) {
    console.error("Error in postConstituentComment: ", error);
  }
}

  async function fetchPrivateChat() {
    try {
        const res: Response = await customFetch(
          Endpoints.getPrivateChats +
            new URLSearchParams({
              postID: props.issue._id,
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
        setPrivateComments(newComments);
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    } 
  }
  return (
    <View style={styles.chatContainer}>
      <View style={styles.titleDropdownContainer}>
        <View style={{minHeight: 75, flex: 1, paddingTop: 8}}> {/* minHeight 75 bc dropdown component option minHeight = 37 -> 2 options >= 74 to be able to select them */}
          <Text style={styles.chatTitle}>Private Chat</Text>
        </View>  
        <View style={{minHeight: 75, flex: 1}}>
        <DropDown
            placeholder="Chat Type"
            value={chatMode}
            setValue={setChatMode}
            items={chatModeItems}
            setItems={setChatModeItems}
            multiple={false}
            styles={{
              dropdownStyle : {},
              textStyle: { color: colors.purple, fontSize: 15, fontWeight: '500' ,zIndex: 1000},
              dropdownContainerStyle: {zIndex: 100}
            }}
          />
        </View>
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messageContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
      >
        {privateComments.map(renderComment)}
      </ScrollView>
        <ExpandableTextInput
            onInputChange={(text) => setNewCommentContent(text)}
            onSubmit={chatMode == "constituent" ? postConstituentComment : postComment}
        />
    </View>
  );
};

export default PrivateChat;

const styles = StyleSheet.create({

 titleDropdownContainer: {
  flexDirection: 'row', 
  alignItems: 'center', 
  justifyContent: 'space-between',
  padding: 5, 
},
userName: {
  color: colors.purple,
  fontWeight: "500",
  alignSelf: 'flex-start',
  marginBottom: 0,
  marginLeft: 5
},
commentContainer: {
    marginVertical: 1,
},
dateText: {
  color: 'gray',
  marginLeft: 8
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
      flex: 1,
  },
  messageContainer: {
      flex: 1,
      marginTop: 15
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

whisperCommentContainer: {
  maxWidth: '80%', 
  alignSelf: 'center', 
  margin: 5,
},

whisperCommentText: {
  color: 'gray',
  fontSize: 12, // readable font size
  textDecorationLine: 'underline',
  textAlign: 'center',
},
});