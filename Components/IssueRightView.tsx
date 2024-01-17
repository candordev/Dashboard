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
import DeletePost from "./DeletePost";

interface IssueRightViewProps {
  fetchStatusUpdates: () => void;
  issue: Post;
  onPopoverCloseComplete: () => void; // Add this line
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
      <Deadline issue={props.issue} style={{zIndex: 1}}/>
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
        {props.issue.postCreatedFrom !== "forwardedEmail" &&
        props.issue.userProfile.firstName !== "Candor Website" &&
        props.issue.userProfile.lastName !== "Bot" && (
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

      {props.issue.postCreatedFrom === "forwardedEmail" &&
        props.issue.emailFirstName &&
        props.issue.emailLastName && (
          <>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                fontFamily: "Montserrat",
              }}
            >
              {"FirstName: " + (props.issue.emailFirstName ?? "")}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                fontFamily: "Montserrat",
              }}
            >
              {"LastName: " + (props.issue.emailLastName ?? "")}
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
        <DeletePost
          issueId={props.issue._id}
          onPopoverCloseComplete={props.onPopoverCloseComplete}
          />
        {/* <CloseIssue /> */}
      </View>
    </ScrollView>
  );
}

export default IssueRightView;
