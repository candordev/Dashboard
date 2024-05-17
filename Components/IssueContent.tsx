import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch, formatDate } from "../utils/utils";
import Button from "./Button";
import Text from "./Text";
import { UserProfile, Post } from "../utils/interfaces";
import { usePostContext } from "../Hooks/usePostContext";
import ProgressBar from "./ProgressBar";
import EditImagesModal from "./EditImagesModal";

type IssueContent = {
  issue: Post;
};

const IssueContent: React.FC<IssueContent> = (props) => {
  const [editing, setEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); 
  const [title, setTitle] = useState(props.issue.title);
  const [content, setContent] = useState(props.issue.content);
  const [isEditing, setIsEditing] = useState(false);
  const { post, setPost } = usePostContext();
  const [visibility, setVisibility] = useState(props.issue.visible);
  const [email, setEmail] = useState(post?.proposalFromEmail);
  const [imgURLs, setImgURLs] = useState<string[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);

  useEffect(() => {
    setTitle(props.issue.title);
    setContent(props.issue.content);
    let queriedUrls: React.SetStateAction<string[]> = []
    let queriedCaptions: React.SetStateAction<string[]> = []
    if (props.issue.imgURLs) {
      props.issue.imgURLs.forEach(element => {
        queriedUrls.push(element.url)
        queriedCaptions.push(element.caption)
      });
    }
    setImgURLs(queriedUrls);
    setCaptions(queriedCaptions);
  }, [props.issue]);

  const handleToggleModal = () => {
    console.log("image toggling", props.issue.imgURLs)
    setModalVisible(!modalVisible); // Toggles the state of modal visibility
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Explicitly close the modal
    fetchPost(props.issue._id).then((fetchedIssue) => {
      if (fetchedIssue && fetchedIssue.imgURLs) {
        let queriedUrls: React.SetStateAction<string[]> = []
        let queriedCaptions: React.SetStateAction<string[]> = []
        if (fetchedIssue.imgURLs) {
          fetchedIssue.imgURLs.forEach(element => {
            queriedUrls.push(element.url)
            queriedCaptions.push(element.caption)
          });
        }
        console.log("AFTER CLOSE", queriedUrls, queriedCaptions)
        setImgURLs(queriedUrls);
        setCaptions(queriedCaptions);
      }
    });
  };

  const handleDoneEditPost = async () => {
    try {
      let res = await customFetch(Endpoints.editPost, {
        method: "POST",
        body: JSON.stringify({
          proposalFromEmail: email,
          postID: post?._id,
        }),
      });
      let resJson = await res.json();
      if (!res.ok) {
        setEmail(post?.proposalFromEmail);
        console.error("Error while editing post: ", resJson.error);
      } else {
        setIsEditing(false);
        if (email !== post?.proposalFromEmail) {
          setPost({ ...post, proposalFromEmail: email || "" });
        }
      }
    } catch (error) {
      console.error("Error editing post. Please try again later.", error);
    }
  };

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
          return null
        }
        if (res.ok) {
          const result: Post = resJson;
          // console.info("fetched post is ", result);
          return result;
        }
      }
    } catch (error) {
      return null
    }
  };

  const handleDone = async () => {
    try {
      let res = await customFetch(Endpoints.editPost, {
        method: "POST",
        body: JSON.stringify({
          title: title,
          content: content,
          postID: props.issue._id,
        })
      });

      let resJson = await res.json();
      if (!res.ok) {
        console.error(resJson.error);
      } else {
        setEditing(false);
      }
    } catch (error) {
      console.error("Error while editing post. Please try again later.", error);
    }
  };

  const toggleVisibility = async () => {
    const newVisibility = !visibility;
    try {
      let res = await customFetch(Endpoints.editPost, {
        method: "POST",
        body: JSON.stringify({
          visible: newVisibility,
          postID: post?._id,
        }),
      });

      let resJson = await res.json();
      if (!res.ok) {
        console.error("Error while editing post: ", resJson.error);
      } else {
        setVisibility(newVisibility);
      }
    } catch (error) {
      console.error("Error editing post. Please try again later.", error);
    }
  };
  


  return (
    <ScrollView
      style={{
        backgroundColor: colors.white,
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: colors.lightestgray,
        maxHeight: "40%",
      }}
    >
    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
      <Image
        source={{ uri: props.issue.userProfile.profilePicture }}
        style={{ width: 53, height: 53, borderRadius: 25 }}
      />
      <View style={{ marginLeft: 10, flex: 1, marginVertical: 3 }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          height: 20, // Example fixed height; adjust as necessary
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: 14}}>
            {props.issue.userProfile.firstName} {props.issue.userProfile.lastName}
          </Text>
          <ProgressBar step={props.issue.step} style={{ width: 100}} />
        </View>
        <View style={{marginVertical: 3}}>

        <Text style={{ fontSize: 12, color: 'gray', marginBottom: 2  }}>
          {"Post Created From: " + (props.issue.postCreatedFrom ?? "App")}
        </Text>
        
        {props.issue.postCreatedFrom === "forwardedEmail" && props.issue.emailFirstName && props.issue.emailLastName && (
          <Text style={{ fontSize: 12, color: 'gray', marginBottom: 2 }}>
            {"Name: " + props.issue.emailFirstName + " " + props.issue.emailLastName}
          </Text>
        )}


        {/* Email display and edit logic */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
          <Text style={{ fontSize: 12, color: 'gray' }}>
            {"Email: "}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {isEditing ? (
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={{
                  fontSize: 12,
                  flex: 1, // Take up available space
                  borderColor: colors.lightestgray,
                  borderWidth: 1,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  marginRight: 2, // Add a bit more space before the button
                }}
              />
            ) : (
              <Text style={{ fontSize: 12, marginRight: 2, color: colors.gray }}>
                {email}
              </Text>
            )}
            <TouchableOpacity
              onPress={() => {
                  if (isEditing) {
                      handleDoneEditPost();
                  } else {
                      setIsEditing(true);
                  }
              }}
              style={isEditing ? styles.doneButtonStyle : styles.editButtonStyle}
            >
              <Text style={{ color: isEditing ? colors.white : colors.black, fontWeight: '500', fontSize: 10.5 }}>
                  {isEditing ? 'Done' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </View>
    </View>
      {editing ? (
        <View>
          <TextInput
            style={[
              {
                fontSize: 18,
                fontWeight: "bold",
                marginRight: 55,
              },
              styles.textInput,
            ]}
            value={title}
            onChangeText={(text) => setTitle(text)}
            autoFocus={true}
            multiline={true}
            numberOfLines={title.length / 20 + 1}
          />
          <TextInput
            style={[
              {
                fontSize: 14,
                marginTop: 5,
              },
              styles.textInput,
            ]}
            value={content}
            onChangeText={(text) => setContent(text)}
            multiline={true}
            numberOfLines={content.length / 30 + 1}
          />
        </View>
      ) : (
        <>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "550",
              fontFamily: "Montserrat",
              paddingRight: 55,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              fontFamily: "Montserrat",
              color: "gray",
              marginBottom: 3,
              marginTop: 3,
              //marginLeft: 5,
            }}
          >
            {formatDate(props.issue.createdAt)}
          </Text>
          <Text style={{ fontSize: 14, marginTop: 5, marginBottom: 10 }}>
            {content}
          </Text>
          
        </>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10 }}>
        <Button
          text={visibility == true  ? "Public" : "Private"}
          onPress={toggleVisibility}
          style={{
            backgroundColor: visibility  ? colors.purple : colors.black,
            width: 70,
            height: 30,
            marginRight: 5, // Add some right margin if needed
          }}
          textStyle={{
            color: colors.white,
            fontSize: 14,
            fontWeight: "500",
          }}
        />
        {editing ? (
          <EditImagesModal
          visible={modalVisible}
          postID={props.issue._id}
          imageCaptions={captions || []}
          editing={true}
          imgURLs={imgURLs || []}
          handleClose={handleCloseModal}
          />
        ) : (
          <EditImagesModal
          visible={modalVisible}
          postID={props.issue._id}
          imageCaptions={captions || []}
          editing={false}
          imgURLs={imgURLs || []}
          handleClose={handleCloseModal}
          />
        )}
        
        {editing ? (
          <Button
            text="Edit Photos"
            onPress={handleToggleModal}
            style={{
              backgroundColor: colors.purple,
              marginRight: 5,
              height: 30
            }}
            textStyle={{
              color: colors.white,
              fontSize: 14,
              fontWeight: "500"
            }}
          />
        ) : (
          <Button
            text="View Photos"
            onPress={handleToggleModal}
            style={{
              backgroundColor: colors.lightestgray,
              marginRight: 5,
              height: 30
            }}
            textStyle={{
              color: colors.black,
              fontSize: 14,
              fontWeight: "500"
            }}
          />
)}

        <Button
          text={editing ? "Done" : "Edit"}
          onPress={() => {
            if (editing) {
              handleDone();
            } else {
              setEditing(true);
            }
          }}
          style={{
            backgroundColor: editing ? colors.purple : colors.lightestgray,
            width: 50,
            height: 30,
          }}
          textStyle={{
            color: editing ? colors.white : colors.black,
            fontSize: 14,
            fontWeight: "500",
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontFamily: "OpenSans",
    outlineStyle: "none",
  },
  removeImageButton: {
    marginBottom: 0,
    padding: 8,
    backgroundColor: colors.red,
    borderRadius: 10,
    marginTop: 10,
    //display: 'flex',
    justifyContent: 'center', // Center content horizontally
    alignSelf: 'flex-start', // Align button to the left
    alignItems: 'center', // Center content vertically
    //minWidth: 110, // Ensure minimum width for the text
    //height: 40, // Adjust height as needed
  },
  buttonText: {
    color: colors.white, // Example style, adjust text color as needed
    //padding: 10,
    //backgroundColor: colors.purple,
    //borderRadius: 10,
    whiteSpace: 'nowrap', // Prevent text wrapping
    textAlign: 'center', // Center text horizontally
    fontFamily: "Montserrat",
    //width: 115,
    fontWeight: 600,
    fontSize: 12,
    alignItems: 'center'
  
    // Add other text styling as needed
  },
  imageIcon: {
    marginBottom: 0,
    marginTop: 10,
    padding: 8,
    backgroundColor: colors.purple,
    borderRadius: 10,
    //display: 'flex',
    justifyContent: 'center', // Center content horizontally
    alignSelf: 'flex-start', // Align button to the left
    alignItems: 'center', // Center content vertically
    //minWidth: 110, // Ensure minimum width for the text
    //height: 40, // Adjust height as needed
    
    // Additional styling for the icon button if needed
  },
   editButtonStyle : {
    marginTop: 2,
    marginLeft: 6,
    backgroundColor: colors.lightestgray,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
  },
   doneButtonStyle : {
    marginTop: 2,
    marginLeft: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
    backgroundColor: colors.purple,
  }
});

export default IssueContent;
