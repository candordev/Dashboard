import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import colors from "../Styles/colors";
import ExpandableTextInput from "./ExpandableTextInput";
import { Comment } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import { useUserContext } from "../Hooks/useUserContext";
import ProfilePicture from "./ProfilePicture";
import DropDown from "./DropDown";
import { min, set } from "react-native-reanimated";
import { ActivityIndicator } from "react-native";

interface PrivateChatProps {
  issueID: string;
}

function PrivateChat(props: PrivateChatProps): JSX.Element {
  const {state, dispatch} = useUserContext();
  const [privateComments, setPrivateComments] = useState<Comment[]>([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  
  const scrollViewRef = useRef<ScrollView>(null);
  

  const [chatMode, setChatMode] = useState("everyone");
  const [chatModeItems, setChatModeItems] = useState([
    { label: 'Everyone', value: 'everyone' },
    { label: 'Private', value: 'private' }
  ]);

  // const [isLoading, setIsLoading] = useState(false);




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
  // useEffect(() => {
  //   fetchPrivateChat()
  // }, []);

  useEffect(() => {
    setPrivateComments([]); 
    fetchPrivateChat();
    console.log("WEMBY ", props.issueID);
  }, [props.issueID]); 

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
      console.log("GG's Comment Posted to Everyone")
    }
  } catch (error) {
    console.error("Error loading posts. Please try again later.", error);
  }
}
async function handleOnChatSubmit() {
  try {
    // Post the comment
    let res = await customFetch(Endpoints.createComment, {
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
      return; // Exit if the comment wasn't posted successfully
    }

    // Send the follow-up message if the comment was posted successfully
    res = await customFetch(Endpoints.sendConstituentChat, {
      method: "POST",
      body: JSON.stringify({
        postID: props.issueID,
        content: newCommentContent,
        user: state._id,
      }),
    });
    let resText = await res.text();
    if (!res.ok) {
      console.error(resText);
      return; // Exit if the follow-up message wasn't sent successfully
    }

    // Only after both actions are successful, fetch the updated chat
    fetchPrivateChat();
    console.log("Comment Posted and Message Sent");
    console.log("This is the NEW Message: ", newCommentContent);
  } catch (error) {
    console.error("Error handling chat submission. Please try again later.", error);
  }
}



// async function handleOnChatSubmit() {
//   try {
//     // Post the comment
//     let res: Response = await customFetch(Endpoints.createComment, {
//       method: "POST",
//       body: JSON.stringify({
//         content: newCommentContent,
//         postID: props.issueID,
//         parentID: undefined,
//         privateChat: "true",
//       }),
//     });
//     let resJson = await res.json();
//     if (!res.ok) {
//       console.error(resJson.error);
//       return; 
//     }
//     res = await customFetch(Endpoints.sendConstituentChat, {
//       method: "POST",
//       body: JSON.stringify({
//         postID : props.issueID,
//         content: newCommentContent,
//         user: state._id,
//       }),
//     });
//     let resText = await res.text();
//     if (!res.ok) {
//       console.error(resText);
//       return; // don't re-render if failed 
//     }
//     // trigger the re-render
//     fetchPrivateChat();
//     console.log("Comment Posted and Message Sent");
//     console.log("This is the Message: ", newCommentContent);
//   } catch (error) {
//     console.error("Error handling chat submission. Please try again later.", error);
//   }
// }

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
        // console.log("newComments: ", newComments)
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
              dropdownStyle: {}, // Example style override
              textStyle: { color: colors.purple, fontSize: 15, fontWeight: '500'},
              dropDownContainerStyle: {},
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
            onSubmit={chatMode == "private" ? handleOnChatSubmit : postComment}
        />
    </View>
  );
};

export default PrivateChat;

const styles = StyleSheet.create({

 titleDropdownContainer: {
  flexDirection: 'row', // Place children in a row
  alignItems: 'center', // Center children vertically
  justifyContent: 'space-between', // Space between the title and dropdown
  padding: 5, // Add padding as needed
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
