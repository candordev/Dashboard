  import React, { useEffect, useRef, useState } from "react";
  import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, Alert } from "react-native";
  import colors from "../Styles/colors";
  import ExpandableTextInput from "./ExpandableTextInput";
  import { Comment, Post } from "../utils/interfaces";
  import { Endpoints } from "../utils/Endpoints";
  import { customFetch, formatDate } from "../utils/utils";
  import { useUserContext } from "../Hooks/useUserContext";
  import ProfilePicture from "./ProfilePicture";
  import DropDown from "./DropDown";
  import styles from "../Styles/styles";
  import { debounce } from "lodash";
  import io from "socket.io-client";
  import { BASE_URL } from "../utils/Endpoints";
  import { usePostContext } from "../Hooks/usePostContext";
  import Icon from "react-native-vector-icons/FontAwesome";
  import ConfirmationModal from "./ConfirmationModal"; 


  const validator = require("validator");

  interface PrivateChatProps {
    issue: Post;
  }
  function PrivateChat(props: PrivateChatProps): JSX.Element {
    const { state } = useUserContext();
    const { post, setPost} = usePostContext();

    const [privateComments, setPrivateComments] = useState<Comment[]>([]);
    
    const scrollViewRef = useRef<ScrollView>(null);
    const [inputText, setInputText] = useState<string>("");
    const [isInputDisabled, setIsInputDisabled] = useState(false);  
    const [submittable, setSubmittable] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);



    const [emailError, setEmailError] = useState("")


    const [chatMode, setChatMode] = useState("authorities");
    const getChatModeItems = () => {
      return [
        { label: state.groupType === "HOA" ? "Leaders" : "Authorities", value: "authorities" },
        { label: state.groupType === "HOA" ? "Resident" : "Constituent", value: "constituent" },
      ];
    };
    
    const [chatModeItems, setChatModeItems] = useState(getChatModeItems());

    useEffect(() => {
      // Example logic to enable the submit button when inputText is not empty
      setSubmittable(inputText.trim().length > 0);
    }, [inputText]);

    useEffect(() => {
      // console.log(post);
      console.log("EMAIL from CONTEXT: ", post?.proposalFromEmail)
      if (chatMode === "constituent") {
        if (post?.proposalFromEmail) {
          setEmailError("");
          fetchPrivateChat();
          setIsInputDisabled(false);
        } else {
          setIsInputDisabled(true);
          setEmailError("There's No Constituent Email associated with this Issue. Please Fill it in the Issue Description Above.");
        }
      } else {
        setEmailError("");
        fetchPrivateChat();
        setIsInputDisabled(false);
      }
    }, [chatMode, post?.proposalFromEmail]);

    useEffect(() => {
      const socketName =  BASE_URL == "https://candoradmin.com/api" ? "https://candoradmin.com"  : "http://localhost:4000"
      const socket = io(socketName, {
        withCredentials: false,
        // Add any additional options here
      });
      // Construct the room name based on chatMode and postID
      const roomName = `${chatMode}_${props.issue._id}`;

      // console.log("ROOM NAME", roomName)
      socket.on("connect", () => {
        console.log("Connected to Socket.io server");
        // Join the room specific to the chatMode and postID
        socket.emit("join-post", roomName);
      });
      socket.on("connect_error", (err : any) => {
        console.error("Connection error:", err.message);
      });
      socket.on("new-comment", (newComment : Comment) => {
        console.log("NEW COMMENT ALERT!", newComment); // This line will log the new comment
        setPrivateComments((prevComments) => [...prevComments, newComment]);
      });
      return () => {
        // Leave the room when the component unmounts or chatMode/postID changes
        socket.emit("leave-room", roomName);
        socket.disconnect();
        console.log("DISCONNECTED FROM SOCKET");
      };
    }, [props.issue._id, chatMode]); // Add chatMode to the dependency array

    let lastAuthorId = "";
    let lastCommentDate = new Date(0);

    const renderComment = (comment: Comment, index: number) => {
      const isAuthor =
        String(comment.authorID).trim() === String(state._id).trim();
      let showDate = false;

      if (lastAuthorId !== comment.authorID) {
        showDate = true;
      } else {
        const currentCommentDate = new Date(comment.date);
        const diffMs = currentCommentDate.getTime() - lastCommentDate.getTime();
        if (diffMs > 600000) {
          showDate = true;
        }
      }
      lastAuthorId = comment.authorID;
      lastCommentDate = new Date(comment.date);
      return (
        <View key={comment._id} style={chatStyles.commentContainer}>
      {comment.isWhisper ? (
        <View style={chatStyles.whisperCommentContainer}>
          <Text style={chatStyles.whisperCommentText}>{comment.content}</Text>
        </View>
      ) : (
        <>
          <View style={chatStyles.nameAndDateContainer}>
            {isAuthor ? (
              <>
                  <Text style={chatStyles.authorSelfDate}>
                  </Text>
                <Text style={chatStyles.userName}>Candor AI</Text>
              </>
            ) : (
              <>
                <Text style={chatStyles.userName}>
                  {comment.contentType == "constituentChat"
                    ? "Constituent Chat Response"
                    : `${comment.profile.firstName} ${comment.profile.lastName}`}
                </Text>
                {showDate && (
                  <Text style={chatStyles.dateText}>
                    {formatDate(comment.date)}
                  </Text>
                )}
              </>
            )}
          </View>
          <View
            style={
              !isAuthor && comment.contentType === "constituentChat"
                ? { ...chatStyles.authorOther, marginTop: 5 }
                : isAuthor
                ? chatStyles.authorSelf
                : chatStyles.authorOther
            }
          >
            <Text style={isAuthor ? { color: "black" } : { color: "black" }}>
              {comment.content}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};


    async function postPoliticianComment() {
      try {
        let res: Response = await customFetch(Endpoints.sendPoliticianChat, {
          method: "POST",
          body: JSON.stringify({
            content: inputText,
            postID: props.issue._id,
            user: state._id,
          }),
        });
        let resJson = await res.json();
        if (!res.ok) {
          console.error("No Affiliated Politicans???.");
        } else {
          fetchPrivateChat();
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
            content: inputText,
            user: state._id,
          }),
        });
        if (res.ok) {
          fetchPrivateChat();
        } else {
          let resJson = await res.json();
          console.log(resJson.error)
          console.error("Result sent from sendConstituentChat was not OK.");
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
              type: chatMode,
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


    const handleSendChat = async (e: any) => {
      // if (e.nativeEvent.key === "Enter" && !e.nativeEvent.shiftKey) {
        if (chatMode == "constituent" && validator.isEmail(props.issue.proposalFromEmail)) {
          setShowConfirmationModal(true); // Show the confirmation modal
          //await postConstituentComment();
        } else {
          await postPoliticianComment();
          setInputText("");
        }
    };
    return (
      <View style={chatStyles.chatContainer}>
        <ConfirmationModal
          isVisible={showConfirmationModal}
          onConfirm={async () => {
            await postConstituentComment();
            setInputText("");
            setShowConfirmationModal(false); // Close the modal
          }}
          onCancel={() => setShowConfirmationModal(false)}
        />
        <View style={chatStyles.titleDropdownContainer}>
          {/* <Text style={chatStyles.chatTitle}>Private Chat</Text> */}
          <View>
            <DropDown
              placeholder="Chat Type"
              value={chatMode}
              setValue={setChatMode}
              items={chatModeItems}
              setItems={setChatModeItems}
              multiple={false}
              backgroundColor={colors.lightestgray}
            />
          </View>
        </View>
        {emailError ? (
        <Text style={{color: colors.red}}>{emailError}</Text>
      ) : (
        <>
        <ScrollView
          ref={scrollViewRef}
          style={chatStyles.messageContainer}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: false })
          }
          onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {privateComments.map(renderComment)}
        </ScrollView>
        <View style={[styles.textInput, { minHeight: 40, maxHeight: 300, flexDirection: 'row', }]}>
          <TextInput
            multiline={true}
            editable={!isInputDisabled}
            // numberOfLines={1}
            // style={[styles.textInput, { minHeight: 40, maxHeight: 300 }]}
             style={{
              flex: 1,
              // minHeight: 40,
              // maxHeight: 100,
              borderColor: 'transparent',
            }}
            placeholder="Add a comment..."
            placeholderTextColor={colors.gray}
            onChangeText={setInputText}
            // onKeyPress={handleKeyPress}
            value={inputText}
          />
          <TouchableOpacity onPress={submittable ? handleSendChat : () => {}}>
            <Icon
              name="paper-plane"
              size={20}
              style={{ margin: 5 }}
              color={submittable ? colors.purple : colors.lightgray}
            />
        </TouchableOpacity>
        </View>
        </>
      )}
      </View>
    );
  }

  

  export default PrivateChat;

  const chatStyles = StyleSheet.create({
    titleDropdownContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 5,
      zIndex: 1,
    },
    userName: {
      color: colors.purple,
      fontWeight: "500",
      alignSelf: "flex-end",
      marginBottom: 3,
      marginRight: 5,
      flexDirection: "row-reverse",
      // marginLeft: 5,
    },
    commentContainer: {
      marginVertical: 1,
    },
    dateText: {
      color: "gray",
      marginLeft: 8,
    },
    authorSelf: {
      textAlign: "right",
      backgroundColor: colors.lightergray,
      color: colors.black,
      alignSelf: "flex-end",
      padding: 10,
      borderRadius: 10,
      flexDirection: "row-reverse",
      marginBottom: 2,
      marginLeft: 5,
      marginRight: 5,
    },
    authorOther: {
      textAlign: "left",
      backgroundColor: "lightgray",
      color: "black",
      alignSelf: "flex-start",
      padding: 10,
      borderRadius: 10,
      // marginTop: 5,
      marginBottom: 2,
      marginLeft: 5,
      marginRight: 5,
    },

    // constituentChatComment: {
    //   marginTop: 2, // Adjust the margin as needed
    // },

    chatContainer: {
      // borderColor: colors.lightestgray,
      // borderWidth: 2,
      // borderRadius: 10,
      padding: 10,
      flex: 1,
    },
    chatTitle: {
      fontSize: 18,
      fontWeight: "550" as any,
      fontFamily: "Montserrat",
      flex: 1,
    },
    messageContainer: {
      flex: 1,
      paddingVertical: 10,
    },
    nameAndDateContainer: {
      flexDirection: "row",
      justifyContent: "flex-start", // Align items to the start
      alignItems: "center",
    },
    authorSelfDate: {
      color: "gray",
      marginLeft: "auto", // Pushes the date to the far left
      marginBottom: 5,
    },

    whisperCommentContainer: {
      maxWidth: "80%",
      alignSelf: "center",
      margin: 5,
    },

    whisperCommentText: {
      color: "gray",
      fontSize: 12, // readable font size
      textDecorationLine: "underline",
      textAlign: "center",
    },
    errorText: {
      color: colors.purple, // Use an appropriate color for error messages
      fontSize: 12, // Ensure the font size is readable
      width: '100%',
      textAlign: "center",
      fontWeight: "550" as any,
      marginTop: 10, // Add some space above the error message
    },
  });
