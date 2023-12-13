import React, { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";
import ExpandableTextInput from "./ExpandableTextInput";
import { Post } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import { Comment } from "../utils/interfaces";

interface IssueLeftViewProps {
  issue: Post;
}

function IssueLeftView(props: IssueLeftViewProps): JSX.Element {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    try {
      const endpoint = Endpoints.getComments;

      const searchParams = {
        postID: props.issue._id,
        skip: "0",
      };

      let res: Response = await customFetch(endpoint, searchParams, {
        method: "GET",
      });

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
      let res: Response = await customFetch(
        Endpoints.createComment,
        {},
        {
          method: "POST",
          body: {
            content: content,
            postID: props.issue._id,
            parentID: undefined,
          },
        }
      );

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
        height: "100%",
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          borderColor: colors.lightestgray,
          backgroundColor: colors.white,
          borderWidth: 2,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "550" }}>
            {props.issue.title}
          </Text>
          <Text style={{ fontSize: 13.5, marginTop: 5 }}>
            {props.issue.content}
          </Text>
        </View>
      </View>
      <View>
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
              <Text style={{ fontSize: 12, marginTop: 3 }}>
                {comment.content}
              </Text>
            </View>
          );
        })}
        <ExpandableTextInput
          onInputChange={setContent}
          onSubmit={postComment}
          placeholder="Add a comment..."
        />
      </View>
    </View>
  );
}

export default IssueLeftView;
