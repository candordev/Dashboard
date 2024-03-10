import React, { useEffect, useState } from "react";
import { FlatList, TextInput, View, Image, TouchableOpacity} from "react-native";
import colors from "../Styles/colors";
import ExpandableTextInput from "./ExpandableTextInput";
import { Post } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import { Comment } from "../utils/interfaces";
import PrivateChat from "./PrivateChat";
import IssueContent from "./IssueContent";
import SimilarPost from "./SimilarPost";
import { formatDate } from '../utils/utils'; // Adjust the path as needed
import CommentsSection from './CommentSection'; // Adjust the import path as needed
import { useUserContext } from "../Hooks/useUserContext";


interface IssueLeftViewProps {
  issue: Post;
}

interface CommentThreadProps {
  comment: Comment;
  isChild: boolean;
  depth: number; // New prop to indicate the depth of the comment
}



function IssueLeftView(props: IssueLeftViewProps): JSX.Element {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [issue, setIssue] = useState<Post>(props.issue);
  const [displaySimilarPost, setDisplaySimilarPost] = useState<Boolean>(true);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0); // New state for tracking skip value
  const { state } = useUserContext();




  useEffect(() => {
    // console.log("title changed to", props.issue.title)
    setIssue(props.issue);
  }, [props.issue]);

    // Modified useEffect for initial and subsequent loads
    useEffect(() => {
      fetchComments();
    }, [props.issue, skip]); // Now depends on skip and props.issue changes

  // useEffect(() => {
  //   // console.log("the issue details: ", props.issue)
  //   fetchComments();
  // }, []);
  
  const fetchComments = async () => {
    if (loading) return; // Prevents multiple simultaneous fetches
    setLoading(true);

    try {
      // Update URL with dynamic skip value
      const res: Response = await customFetch(
              Endpoints.getComments +
                new URLSearchParams({
                  postID: issue._id,
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
        const newComments = resJson;
        setComments((prevComments) => [...prevComments, ...newComments]); // Appends new comments
        console.log("these are the new comments", newComments);
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    } finally {
      setLoading(false);
    }
  };


  async function postComment() {
    try {
      let res: Response = await customFetch(Endpoints.createComment, {
        method: "POST",
        body: JSON.stringify({
          content: content,
          postID: issue._id,
          parentID: undefined,
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


  const handleClose = () => {
    setDisplaySimilarPost(false);
  };


  return (
    <View style={{
      height: "100%",
      flex: 1,
      justifyContent: "space-between",
      rowGap: 10, // Note: rowGap might not work as expected in React Native. Consider using margin or padding for spacing.
    }}>
      <IssueContent 
        issue={issue}
      />
      {
        // Only display CommentsSection if groupType is 'HOA'
        state.groupType === 'HOA' && <CommentsSection postID={props.issue._id} />
      }
      {
        // Display SimilarPost if applicable
        props.issue.suggestedSimilarPost && displaySimilarPost && (
          <SimilarPost
            title={props.issue.suggestedSimilarPost.title}
            content={props.issue.suggestedSimilarPost.content}
            date={props.issue.suggestedSimilarPost.date}
            ogPostID={props.issue._id}
            mergePostID={props.issue.suggestedSimilarPost._id}
            merged={props.issue.suggestedSimilarPost.merged}
            onClose={handleClose}
          />
        )
      }
      {
        // Only display PrivateChat if groupType is not 'HOA'
        state.groupType !== 'HOA' && <PrivateChat issue={props.issue}/>
      }
    </View>
  );
}



export default IssueLeftView;