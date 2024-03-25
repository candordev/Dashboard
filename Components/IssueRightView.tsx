import React, { useState } from "react";
import { Dimensions, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
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
import ErrorMessage from "./Native/ErrorMessage";
import { set } from "lodash";
import { useUserContext } from "../Hooks/useUserContext";
import LocationHOA from "./LocationHOA";
import { usePostContext } from "../Hooks/usePostContext";



interface IssueRightViewProps {
  fetchStatusUpdates: () => void;
  issue: Post;
  onPopoverCloseComplete: () => void; // Add this line
}

function IssueRightView(props: IssueRightViewProps): JSX.Element {
  const [issue, setIssue] = React.useState<Post>(props.issue);
  const [isEditing, setIsEditing] = useState(false);

  const { post, setPost } = usePostContext();
  
  const [email, setEmail] = useState(post?.proposalFromEmail);
  const { state } = useUserContext();

  // const handleDone = async () => {
  //   try {
  //     let res: Response = await customFetch(Endpoints.editPost, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         proposalFromEmail: email,
  //       postID: post?._id, // Assuming issue._id is the ID of the post to be edited
  //       }),
  //     });

  //     let resJson = await res.json();
  //     if (!res.ok) {
  //       setEmail(post?.proposalFromEmail); // set to previous email
  //       console.error("Error while editing post: ", resJson.error);
  //     } else {
  //       setIsEditing(false);
  //       if (!(email === post?.proposalFromEmail)) {
  //         setPost({ ...props.issue, proposalFromEmail: email || "" });
  //         console.log("Handle Succeeded and new Post Email Set: ", post?.proposalFromEmail)
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error editing post. Please try again later.", error);
  //   }
  // };


  React.useEffect(() => {
    setIssue(props.issue);
  }, [props.issue]);

  let screenHeight = Dimensions.get('window').height;
  
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
    <View style={{ flex: 1, justifyContent: 'flex-start'}}>
        <Assignees issue={issue} createPost={false} style={{ zIndex: 4}} />
        <Category issueId={issue._id} createPost={false} style={{ zIndex: 3, marginTop: 10}} />
        <Deadline issue={issue} style={{ zIndex: 2, marginTop: 10 }} />
        {state.groupType == "HOA" ? 
        <LocationHOA issue={issue} style={{ zIndex: 1, marginTop: 10, marginBottom: 10}} />
        : <Location issue={issue} style={{ zIndex: 1, marginTop: 10, marginBottom: 10}}/>
        } 
      </View>
       <View style={{ justifyContent: 'flex-end' }}>
        <MarkDone
          fetchStatusUpdates={props.fetchStatusUpdates}
          issueId={issue._id}
          step={issue.step}
        />
        <DeletePost
          issueId={issue._id}
          onPopoverCloseComplete={props.onPopoverCloseComplete}
        />
      </View>
      {/* <CloseIssue /> */}
    </ScrollView>
  );
}
const editButtonStyle = {
  marginLeft: 10,
  backgroundColor: colors.lightestgray,
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 15,
};

const doneButtonStyle = {
  ...editButtonStyle,
  backgroundColor: colors.purple,
  borderRadius: 15
};

export default IssueRightView;


      {/* <View
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
          }}
        >
          {"Post Created From: " + (issue.postCreatedFrom ?? "")}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text
        style={{
            fontSize: 15,
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
                }}
              >
                {"Name: " + issue.userProfile.firstName + " " + issue.userProfile.lastName}
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
                }}
              >
                {"Name: " + issue.emailFirstName + " " + issue.emailLastName}
              </Text>
            </>
          )}
      </View> */}