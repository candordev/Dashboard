import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch, formatDate } from "../utils/utils";
import Button from "./Button";
import Text from "./Text";
import { UserProfile, Post } from "../utils/interfaces";
import { usePostId } from "../Structure/PostContext";
import ProgressBar from "./ProgressBar";

type IssueContent = {
  issue: Post;
};

const IssueContent: React.FC<IssueContent> = (props) => {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(props.issue.title);
  const [content, setContent] = useState(props.issue.content);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const { post, setPost } = usePostId();
  const [visibility, setVisibility] = useState(props.issue.visible);

  


  const [email, setEmail] = useState(post?.proposalFromEmail);


  const handleDoneEditPost = async () => {
    try {
      let res: Response = await customFetch(Endpoints.editPost, {
        method: "POST",
        body: JSON.stringify({
          proposalFromEmail: email,
          postID: post?._id, // Assuming issue._id is the ID of the post to be edited
        }),
      });

      let resJson = await res.json();
      if (!res.ok) {
        setEmail(post?.proposalFromEmail); // set to previous email
        console.error("Error while editing post: ", resJson.error);
      } else {
        setIsEditing(false);
        if (!(email === post?.proposalFromEmail)) {
          setPost({ ...props.issue, proposalFromEmail: email || "" });
          console.log("Handle Succeeded and new Post Email Set: ", post?.proposalFromEmail)
        }
      }
    } catch (error) {
      console.error("Error editing post. Please try again later.", error);
    }
  };


  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl('');
  };

  const onImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Please select an image file.');
    }
  };


  useEffect(() => {
    console.log("THE VIsIBILITY: ", props.issue.visible)
    // console.log("title changed to", props.title)
    setTitle(props.issue.title);
    setPreviewUrl(props.issue.imgURL ?? ''); // Use null if props.previewURl is undefined
  }, [props.issue.title, props.issue.imgURL]);

  useEffect(() => {
    setContent(props.issue.content);
  }, [props.issue.content]);

  const handleDone = async () => {
    try {
      let formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('postID', props.issue._id); // Assuming issueID is used to identify the post being edited
  
      // Check if there is an image to upload
      if (imageFile) {
        formData.append('image', imageFile);
      }
  
      let res = await customFetch(Endpoints.editPost, {
        method: "POST",
        body: formData,
      },0,
      true
      );
  
      let resJson = await res.json();
      if (!res.ok) {
        console.error(resJson.error);
      } else {
        setEditing(false);
        // Handle success, e.g., showing a success message or updating the UI accordingly
      }
    } catch (error) {
      console.error("Error while editing post. Please try again later.", error);
      // Handle error, e.g., showing an error message
    }
  };
  

  const toggleVisibility = async () => {
    console.log("current visiblity: ", visibility)
    const newVisibility = visibility ? false : true;
    console.log("new visiblity: ", newVisibility)
    

    try {
      console.log("In here 1")
      let res: Response = await customFetch(Endpoints.editPost, {
        method: "POST",
        body: JSON.stringify({
          visible: newVisibility,
          postID: post?._id, // Assuming issue._id is the ID of the post to be edited
        }),
      });

      let resJson = await res.json();
      console.log("In here 2")
      if (!res.ok) {
        console.log("In here 3")
        console.error("Error while editing post: ", resJson.error);
      } else {
        console.log("In here 4")
        setVisibility(newVisibility);
        // setIsEditing(false);
        // if (!(email === post?.proposalFromEmail)) {
        //   setPost({ ...props.issue, proposalFromEmail: email || "" });
        //   console.log("Handle Succeeded and new Post Email Set: ", post?.proposalFromEmail)
        // }
      }
    } catch (error) {
      console.error("Error editing post. Please try again later.", error);
    }

  
    // Here you might also want to update the visibility state of the issue in your backend or state management logic
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
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <Image
        source={{ uri: props.issue.userProfile.profilePicture }}
        style={{ width: 53, height: 53, borderRadius: 25 }}
      />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          height: 20, // Example fixed height; adjust as necessary
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: -8 }}>
            {props.issue.userProfile.firstName} {props.issue.userProfile.lastName}
          </Text>
          <ProgressBar step={props.issue.step} style={{ width: 100, marginTop: 25}} />
        </View>
        <Text style={{ fontSize: 12, color: 'gray', marginTop: 5 }}>
          {"Post Created From: " + (props.issue.postCreatedFrom ?? "App")}
        </Text>
        
        {props.issue.postCreatedFrom === "forwardedEmail" && props.issue.emailFirstName && props.issue.emailLastName && (
          <Text style={{ fontSize: 12, marginTop: 5 }}>
            {"Name: " + props.issue.emailFirstName + " " + props.issue.emailLastName}
          </Text>
        )}


        {/* Email display and edit logic */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
          {previewUrl ? (
            <>
              <div style={{ marginBottom: 2 }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </div>
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => {
                  clearImage(); // This function needs to clear the previewUrl and the file selection
                }}
              >
                <Text style={styles.buttonText}>Remove Image</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.imageIcon}
              onPress={() => {
                const inputElement = document.getElementById("image-input");
                if (inputElement !== null) {
                  inputElement.click();
                }
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                style={{ display: "none" }}
                id="image-input"
              />
              <Text style={styles.buttonText}>Select Image</Text>
            </TouchableOpacity>
          )}
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
          {previewUrl && (
            <div style={{ marginBottom: 2 }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          )}
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
            fontSize: 12,
            fontWeight: "500",
          }}
        />
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
