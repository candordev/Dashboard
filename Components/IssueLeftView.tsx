import React, { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";
import ExpandableTextInput from "./ExpandableTextInput";
import { Post } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import {Comment} from '../utils/interfaces';

interface IssueLeftViewProps {
  issue: Post;
}

function IssueLeftView(props: IssueLeftViewProps): JSX.Element {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [])


  async function fetchComments() {
    try {

      const res: Response = await customFetch(
        Endpoints.getComments +
          new URLSearchParams({
            postID: props.issue._id,
            skip: "0",
          }),
        {
          method: 'GET',
        },
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
        method: 'POST',
        body: JSON.stringify({
          content: content,
          postID: props.issue._id,
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

  return (
    <View
      style={{
        borderColor: colors.lightestgray,
        backgroundColor: colors.background,
        borderWidth: 2,
        borderRadius: 10,
        height: "100%",
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <View>
        <View
          style={{
            backgroundColor: colors.white,
            padding: 10,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {props.issue.title}
          </Text>
          <Text style={{ fontSize: 14, marginTop: 5 }}>
            {props.issue.content}
          </Text>
        </View>

        {comments.map((comment: Comment, index) => {
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
              <Text style={{ fontSize: 12, marginTop: 3 }}>{comment.content}</Text>
            </View>
          );
        })}
      </View>
      <ExpandableTextInput onInputChange={setContent} onSubmit={postComment}/>
    </View>
  );
};

export default IssueLeftView;
