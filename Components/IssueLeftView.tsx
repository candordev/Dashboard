import React, { useEffect, useState } from "react";
import { FlatList, TextInput, View, Image, TouchableOpacity, StyleSheet} from "react-native";
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
import Text from "./Text";



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

    // State to manage active tab
    const [activeTab, setActiveTab] = useState('comments'); // default to comments

    // Function to handle tab selection
    const handleTabSelect = (tab: any) => {
      setActiveTab(tab);
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
          {/* Tab controls */}
    <View style={{
        backgroundColor: colors.white,
        paddingVertical: 10,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: colors.lightestgray,
        flex: 1, // Take up all available space
        height: "70%", // Set a maximum height
        alignContent: 'flex', // Align content to the start
        }}>
     <View style={styles.tabs}>
      <TouchableOpacity
        onPress={() => handleTabSelect('comments')}
        style={[styles.tab, activeTab === 'comments' && styles.activeTab]}
      >
        <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>Comments</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleTabSelect('chat')}
        style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
      >
        <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>Private Chat</Text>
      </TouchableOpacity>
    </View>
      {/* Tab content */}
      {activeTab === 'comments' ? (
        <CommentsSection postID={props.issue._id} />
      ) : (
        <PrivateChat issue={props.issue} />
      )}
       </View>
    </View>
  );
}

// Styles for the tabs and container
const styles = StyleSheet.create({
  container: {
    height: "100%",
    flex: 1,
    justifyContent: "space-between",
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 0.2,
    backgroundColor: colors.white,
    borderBottomWidth: 1, // Add a gray line beneath the tabs
    borderBottomColor: colors.lightergray, // Use your gray color here
  },
  tab: {
    flex: 1, // Ensure each tab takes up equal space
    alignItems: 'center', // Center-align the tab contents
    justifyContent: 'center', // Vertically center the contents
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    paddingHorizontal: 5,
    borderBottomColor: colors.purple, // Purple underline for the active tab
  },
  tabText: {
    fontFamily: 'Montserrat',
    fontWeight: "500",
    color: colors.gray, // Default tab text color (inactive)
  },
  activeTabText: {
    fontFamily: 'Montserrat',
    fontWeight: "500",
    color: colors.purple, // Active tab text color
  },
});







export default IssueLeftView;