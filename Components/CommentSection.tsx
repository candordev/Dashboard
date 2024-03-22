import React, { useState, useEffect } from 'react';
import { FlatList, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import CommentThread from './CommentThread'; // Adjust the path as needed
import { customFetch } from '../utils/utils'; // Adjust the path as needed
import { Comment } from '../utils/interfaces'; // Adjust the path as needed
import { Endpoints } from '../utils/Endpoints'; // Adjust the path as needed
import colors from "../Styles/colors"; // Adjust the path as needed
import Text from "./Text";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from '../Styles/styles';


interface CommentsSectionProps {
  postID: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postID }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [replyContext, setReplyContext] = useState<{ parentID?: string, replyingTo?: string }>({});
  const [submittable, setSubmittable] = useState(false);

  useEffect(() => {
    // Example logic to enable the submit button when inputText is not empty
    setSubmittable(inputText.trim().length > 0);
  }, [inputText]);


    // Function to handle sending the comment
    const handleSendComment = () => {
        setComments([]);
        postComment();
        setInputText(''); // Clear input text after sending
        setReplyContext({}); // Reset reply context
      };

    //   const handleReply = (comment: Comment) => {
    //     setReplyContext({ parentID: comment._id, replyingTo: `${comment.profile.firstName} ${comment.profile.lastName}` });
    //     // Focus the TextInput if necessary
    //   };

    const handleReply = (comment: Comment) => {
        setReplyContext({
          parentID: comment._id,
          replyingTo: `${comment.profile.firstName} ${comment.profile.lastName}: "${comment.content}"`

        });
    }

  const fetchComments = async () => {

    if (loading) return;
    setLoading(true);
    try {
        const res: Response = await customFetch(
            Endpoints.getComments +
              new URLSearchParams({
                postID: postID,
                skip: skip.toString(),
              }),
            {
              method: "GET",
            }
          );

      const resJson = await res.json();
      if (!res.ok) {
        console.error(resJson.error);
      } else {
        setComments(prevComments => [...prevComments, ...resJson]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const postComment = async () => {
    try {
      let res: Response = await customFetch(Endpoints.createComment, {
        method: "POST",
        body: JSON.stringify({
          content: inputText,
          postID: postID,
          parentID: replyContext.parentID || undefined, // Use parentID from replyContext
        }),
      });

      let resJson = await res.json();
      if (!res.ok) {
        console.error(resJson.error);
      } else {
        fetchComments();
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [postID, skip]);

  const handleLoadMore = () => {
    setSkip(comments.length);
  };

  

  return (
        <View style={{
        backgroundColor: colors.white,
        padding: 10,
        // borderWidth: 2,
        // borderRadius: 10,
        // borderColor: colors.lightestgray,
        flex: 1, // Take up all available space
        height: "70%", // Set a maximum height
        alignContent: 'flex-start', // Align content to the start
        }}>
        {/* <Text style={styles.chatTitle}>Comments</Text> */}
        <ScrollView>
      {comments.map((comment, index) => (
        <React.Fragment key={index}>
          {index > 0 && ( // Render the gray line from the second parent moment
            <View
              style={{
                borderTopWidth: 3, 
                borderTopColor: colors.lightergray,
                marginVertical: 10, // Add some margin to separate the comments
              }}
            />
          )}
          <CommentThread
            comment={comment}
            isChild={false}
            depth={0}
            onReply={handleReply}
          />
        </React.Fragment>
      ))}
    </ScrollView>
        <View style={{ marginVertical: 5, borderTopColor: colors.lightergray, borderTopWidth: 2 }}>
            <Text style={{ fontFamily: 'Montserrat', marginBottom: 1, marginTop: 4 }}>{replyContext.replyingTo ? `Replying to ${replyContext.replyingTo}` : "Replying to original post:"}</Text>
        </View>
      <View style={[styles.textInput, { minHeight: 40, maxHeight: 300, flexDirection: 'row', }]}>
        <TextInput
          multiline={true}
          numberOfLines={1}
          style={{
            flex: 1,
            // minHeight: 40,
            // maxHeight: 100,
            borderColor: 'transparent',
          }}
          placeholder="Add a comment..."
          placeholderTextColor={colors.gray}
          onChangeText={setInputText}
          value={inputText}
        />
        <TouchableOpacity onPress={submittable ? handleSendComment : () => {}}>
          <Icon
            name="paper-plane"
            size={20}
            style={{ margin: 5 }}
            color={submittable ? colors.purple : colors.lightgray}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
  

export default CommentsSection;
