import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Text from "./Text";
import colors from "../Styles/colors";
import IssueLeftView from "./IssueLeftView";
import IssueMiddleView from "./IssueMiddleView";
import IssueRightView from "./IssueRightView";
import { Post } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import { ActivityIndicator } from "react-native";
import { usePostContext } from "../Hooks/usePostContext";
import FeatherIcon from "react-native-vector-icons/Feather";

interface IssueViewProps {
  navigation: any;
  issue: Post;
  onPopoverCloseComplete: () => void; // Add this line
  style?: any;
}

function IssueView(props: IssueViewProps): JSX.Element {
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [issue, setIssue] = useState<Post>(props.issue);
  const [loading, setLoading] = useState(true); // 

  const {post, setPost} = usePostContext();

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
          console.info("fetched post is ", result);
          return result;
        }
      }
    } catch (error) {}
  };
  
  useEffect(() => {
    const fetchAndUpdatePost = async () => {
      try {
        setLoading(true); // Set loading to true when the effect runs
        if (props.issue._id) {
          const fetchedIssue = await fetchPost(props.issue._id);
          if (fetchedIssue) {
            setIssue(fetchedIssue);
            setPost(fetchedIssue);
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
  
    fetchAndUpdatePost();
  }, [props.issue]);

  

  const handleUpdateTrigger = () => {
    setUpdateTrigger((prev) => !prev); // Toggle the trigger to force re-render
  };

  if (loading) {
    // Return a loader or placeholder component if still loading
    return  <View
    style={[
      {
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
      },
      props.style,
    ]}
   >
    <ActivityIndicator
          size="large"
          color={colors.purple}
          style={{ marginBottom: 10 }}
        />

  </View>
  }

  return (

    <View style={{ flex: 1}}>
    <View style={{ alignItems: 'flex-end'}}>  
      <TouchableOpacity onPress={props.onPopoverCloseComplete}>
        <Text style={{ fontSize: 17 , 
          color: colors.purple,
          paddingTop: 10, 
          paddingRight: 15,
          fontWeight: 'bold'
        }}
          >X</Text>
      </TouchableOpacity>
    </View>
    <View
      style={[
        {
          padding: 10,
          paddingTop: 5,
          alignItems: "center",
          flexDirection: "row",
          flex: 1,
          columnGap: 10,
          backgroundColor: colors.white,
        },
        props.style,
      ]}
    >

      <IssueLeftView issue={issue} navigation={props.navigation}/>
      <IssueMiddleView updateTrigger={updateTrigger} issue={issue}/>
      <IssueRightView fetchStatusUpdates={handleUpdateTrigger} issue={issue} onPopoverCloseComplete={props.onPopoverCloseComplete}/>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default IssueView;
