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
  const [issue, setIssue] = React.useState<Post>(props.issue);

  React.useEffect(() => {
    
    
    setIssue(props.issue);
  }, [props.issue]);

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
      <Assignees issue={issue} createPost={false} style={{ zIndex: 2 }} />
      <Category
        issueId={issue._id}
        createPost={false}
        style={{ zIndex: 1 }}
      />
      <Deadline issue={issue} style={{zIndex: 1}}/>
      <Location issue={issue} />
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
          {"Post Created From: " + (issue.postCreatedFrom ?? "")}
        </Text>
        {issue.proposalFromEmail ? (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "400",
              fontFamily: "Montserrat",
            }}
          >
            {"Email: " + issue.proposalFromEmail}
          </Text>
        ) : null}
        {issue.postCreatedFrom !== "forwardedEmail" &&
          issue.userProfile.firstName !== "Candor Website" &&
          issue.userProfile.lastName !== "Bot" && (
            <>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  fontFamily: "Montserrat",
                }}
              >
                {"FirstName: " + (issue.userProfile.firstName ?? "")}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  fontFamily: "Montserrat",
                }}
              >
                {"LastName: " + (issue.userProfile.lastName ?? "")}
              </Text>
            </>
          )}

        {issue.postCreatedFrom === "forwardedEmail" &&
          issue.emailFirstName &&
          issue.emailLastName && (
            <>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  fontFamily: "Montserrat",
                }}
              >
                {"FirstName: " + (issue.emailFirstName ?? "")}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  fontFamily: "Montserrat",
                }}
              >
                {"LastName: " + (issue.emailLastName ?? "")}
              </Text>
            </>
          )}
      </View>
      <View style={{ rowGap: 10 }}>
        <MarkDone
          fetchStatusUpdates={props.fetchStatusUpdates}
          issueId={issue._id}
          step={issue.step}
        />
        {/* <CloseIssue /> */}
      </View>
    </ScrollView>
  );
}

export default IssueRightView;
