import React from "react";
import { TextInput, View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";
import ExpandableTextInput from "./ExpandableTextInput";
import { Post } from "../utils/interfaces";

interface IssueLeftViewProps {
  issue: Post;
}

function IssueLeftView(props: IssueLeftViewProps): JSX.Element {
  const comments = [
    "This is a long comment, lorem ipsum djsfl; jef;ewajfl;kaj fe;jfwa;ejfl ksd;jfoei;jfl;kdas fj;fjew ;afj;wla fj",
    "This is a long comment, lorem ipsum djsfl; jef;ewajfl;kaj fe;jfwa;ejfl ksd;jfoei;jfl;kdas fj;fjew ;afj;wla fj",
    "This is a long comment, lorem ipsum djsfl; jef;ewajfl;kaj fe;jfwa;ejfl ksd;jfoei;jfl;kdas fj;fjew ;afj;wla fj",
  ];
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

        {comments.map((comment) => {
          return (
            <View
              style={{
                backgroundColor: colors.white,
                padding: 10,
                marginTop: 5,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "550" }}>
                Akshat Pant
              </Text>
              <Text style={{ fontSize: 12, marginTop: 3 }}>{comment}</Text>
            </View>
          );
        })}
      </View>
      <ExpandableTextInput/>
    </View>
  );
};

export default IssueLeftView;
