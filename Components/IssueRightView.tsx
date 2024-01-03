import React from "react";
import { ScrollView, View } from "react-native";
import colors from "../Styles/colors";
import { Post } from "../utils/interfaces";
import Assignees from "./Assignees";
import Category from "./Category";
import Deadline from "./Deadline";
import Location from "./Location";
import MarkDone from "./MarkDone";
import Text from "./Text";

interface IssueRightViewProps {
  fetchStatusUpdates: () => void;
  issue: Post;
}

function IssueRightView(props: IssueRightViewProps): JSX.Element {
  return (
    <ScrollView
      style={{
        borderRadius: 10,
        height: "100%",
        flex: 1,
        //justifyContent: "space-between",
      }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
    >
      <Assignees issue={props.issue} createPost={false} style={{ zIndex: 2 }} />
      <Category
        issueId={props.issue._id}
        createPost={false}
        style={{ zIndex: 1 }}
      />
      <Deadline issue={props.issue} />
      <Location issue={props.issue} />
      <View
        style={{
          borderColor: colors.lightestgray,
          borderWidth: 2,
          borderRadius: 10,
          padding: 10,
          rowGap: 5,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "550",
            fontFamily: "Montserrat",
          }}
        >
          Post Details
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            fontFamily: "Montserrat",
          }}
        >
          {"Post Created From: " + (props.issue.postCreatedFrom ?? "")}
        </Text>
        {props.issue.proposalFromEmail ? (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "400",
              fontFamily: "Montserrat",
            }}
          >
            {"Email: " + props.issue.proposalFromEmail}
          </Text>
        ) : null}
        {(props.issue.userProfile.firstName !== "Candor Website" ||
          props.issue.userProfile.lastName !== "Bot") && (
          <>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                fontFamily: "Montserrat",
              }}
            >
              {"FirstName: " + (props.issue.userProfile.firstName ?? "")}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                fontFamily: "Montserrat",
              }}
            >
              {"LastName: " + (props.issue.userProfile.lastName ?? "")}
            </Text>
          </>
        )}
      </View>
      <View style={{ rowGap: 10 }}>
        <MarkDone
          fetchStatusUpdates={props.fetchStatusUpdates}
          issueId={props.issue._id}
          step={props.issue.step}
        />
        {/* <CloseIssue /> */}
      </View>
    </ScrollView>
  );
}

export default IssueRightView;
