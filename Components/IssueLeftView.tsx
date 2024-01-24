import React, { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";
import ExpandableTextInput from "./ExpandableTextInput";
import { Post } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import { Comment } from "../utils/interfaces";
import PrivateChat from "./PrivateChat";
import IssueContent from "./IssueContent";
import SimilarPost from "./SimilarPost";

interface IssueLeftViewProps {
  issue: Post;
}

function IssueLeftView(props: IssueLeftViewProps): JSX.Element {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [issue, setIssue] = useState<Post>(props.issue);
  const [displaySimilarPost, setDisplaySimilarPost] = useState<Boolean>(true);


  useEffect(() => {
    console.log("title changed to", props.issue.title)
    setIssue(props.issue);
  }, [props.issue]);


  useEffect(() => {
    console.log("the issue details: ", props.issue)
    fetchComments();
  }, []);

  async function fetchComments() {
    try {
      const res: Response = await customFetch(
        Endpoints.getComments +
          new URLSearchParams({
            postID: issue._id,
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
        setComments(newComments);
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    }
  }

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
    <View
      style={{
        height: "100%",
        flex: 1,
        justifyContent: "space-between",
        rowGap: 10,
      }}
    >
      <IssueContent date={issue.createdAt} issueID={issue._id} title={issue.title} content={issue.content} />
      {/* {comments.map((comment: Comment, index) => {
        return (
          <View
            style={{
              backgroundColor: colors.white,
              padding: 10,
              marginTop: 5,
            }}
            key={index}
          >
            <Text style={{ fontSize: 14, fontWeight: "550" }}>
              {comment.profile.firstName + " " + comment.profile.lastName}
            </Text>
            <Text style={{ fontSize: 12, marginTop: 3 }}>
              {comment.content}
            </Text>
          </View>
        );
      })}*/}
        {
          props.issue.suggestedSimilarPost && displaySimilarPost&& (
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
      <PrivateChat issue={props.issue}/>
    </View>
  );
}

export default IssueLeftView;