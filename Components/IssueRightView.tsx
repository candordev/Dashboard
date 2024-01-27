import React, { useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import colors from "../Styles/colors";
import { Post } from "../utils/interfaces";
import Assignees from "./Assignees";
import Category from "./Category";
import Deadline from "./Deadline";
import Location from "./Location";
import MarkDone from "./MarkDone";
import Text from "./Text";
import DeletePost from "./DeletePost";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";

interface IssueRightViewProps {
  fetchStatusUpdates: () => void;
  issue: Post;
  onPopoverCloseComplete: () => void; // Add this line
}

function IssueRightView(props: IssueRightViewProps): JSX.Element {
  const [issue, setIssue] = React.useState<Post>(props.issue);
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(issue.proposalFromEmail);

  const handleDone = async () => {
    try {
  
      let res: Response = await customFetch(Endpoints.editPost, {
        method: "POST",
        body: JSON.stringify({
          proposalFromEmail: email,
        postID: issue._id, // Assuming issue._id is the ID of the post to be edited
        }),
      });
  
      let resJson = await res.json();
      if (!res.ok) {
        console.error(resJson.error);
      } else {
        setIsEditing(false);
        console.log("Successfully edited proposalFromEmail");
        // Optionally, you can update the local state or perform other actions upon successful update
      }
    } catch (error) {
      console.error("Error editing post. Please try again later.", error);
    }
  };
  

  React.useEffect(() => {
    setIssue(props.issue);
  }, [props.issue]);


  return (
    <ScrollView
      style={{
        borderRadius: 10,
        height: "100%",
        flex: 1,
      }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
        rowGap: 10,
      }}
    >
      <Assignees issue={issue} createPost={false} style={{ zIndex: 3 }} />
      <Category issueId={issue._id} createPost={false} style={{ zIndex: 2 }} />
      <Deadline issue={issue} style={{ zIndex: 1 }} />
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
            fontSize: 15,
            fontWeight: "400",
            fontFamily: "Montserrat",
          }}
        >
          {"Post Created From: " + (issue.postCreatedFrom ?? "")}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text
        style={{
            fontSize: 15,
            fontWeight: '400',
            fontFamily: 'Montserrat',
        }}
    >
        {"Email: "}
    </Text>
    {isEditing ? (
        <TextInput
            value={email}
            onChangeText={setEmail}
            style={{
                fontSize: 15,
                fontWeight: '400',
                fontFamily: 'Montserrat',
                flex: 1,
                borderColor: colors.lightestgray,
                borderWidth: 1,
                paddingHorizontal: 10,
                marginHorizontal: 5,
                borderRadius: 5,
            }}
        />
    ) : (
        <Text
            style={{
                fontSize: 15,
                fontWeight: '400',
                fontFamily: 'Montserrat',
            }}
        >
            {email}
        </Text>
    )}
        <TouchableOpacity
          onPress={() => {
              if (isEditing) {
                  handleDone(); // Call handleDone when in editing mode and Done is pressed
              } else {
                  setIsEditing(true); // Switch to editing mode when Edit is pressed
              }
          }}
          style={isEditing ? doneButtonStyle : editButtonStyle}
      >
          <Text style={{ color: isEditing ? colors.white : colors.black, fontWeight: '500' }}>
              {isEditing ? 'Done' : 'Edit'}
          </Text>
      </TouchableOpacity>

      </View>

        {issue.postCreatedFrom !== "forwardedEmail" &&
          issue.userProfile.firstName !== "Candor Website" &&
          issue.userProfile.lastName !== "Bot" && (
            <>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "400",
                  fontFamily: "Montserrat",
                }}
              >
                {"FirstName: " + (issue.userProfile.firstName ?? "")}
              </Text>
              <Text
                style={{
                  fontSize: 15,
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
                  fontSize: 15,
                  fontWeight: "400",
                  fontFamily: "Montserrat",
                }}
              >
                {"FirstName: " + (issue.emailFirstName ?? "")}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "400",
                  fontFamily: "Montserrat",
                }}
              >
                {"LastName: " + (issue.emailLastName ?? "")}
              </Text>
            </>
          )}
      </View>
      <MarkDone
        fetchStatusUpdates={props.fetchStatusUpdates}
        issueId={issue._id}
        step={issue.step}
      />
      <DeletePost
        issueId={issue._id}
        onPopoverCloseComplete={props.onPopoverCloseComplete}
      />
      {/* <CloseIssue /> */}
    </ScrollView>
  );
}
const editButtonStyle = {
  marginLeft: 10,
  backgroundColor: colors.lightestgray,
  paddingHorizontal: 10,
  paddingVertical: 5,
};

const doneButtonStyle = {
  ...editButtonStyle,
  backgroundColor: colors.purple,
};

export default IssueRightView;
