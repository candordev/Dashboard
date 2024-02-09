import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch, formatDate } from "../utils/utils";
import Button from "./Button";
import Text from "./Text";

type IssueContent = {
  title: string;
  content: string;
  issueID: string;
  date: string;
  previewURl?: string;
};

const IssueContent: React.FC<IssueContent> = (props) => {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState(props.content);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl('');
  };

  const onImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Please select an image file.');
    }
  };


  useEffect(() => {
    // console.log("title changed to", props.title)
    setTitle(props.title);
    setPreviewUrl(props.previewURl ?? ''); // Use null if props.previewURl is undefined
  }, [props.title, props.previewURl]);

  useEffect(() => {
    setContent(props.content);
  }, [props.content]);

  const handleDone = async () => {
    try {
      let formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('postID', props.issueID); // Assuming issueID is used to identify the post being edited
  
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
  

  // const handleDone = async () => {
  //   try {
  //     // console.log("content", content);
  //     let res: Response = await customFetch(Endpoints.editPost, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         content: content,
  //         postID: props.issueID,
  //         title: title,
  //       }),
  //     });

  //     let resJson = await res.json();
  //     if (!res.ok) {
  //       console.error(resJson.error);
  //     } else {
  //       setEditing(false);
  //       // console.log("SUCSEFULLY EDDITED");
  //     }
  //   } catch (error) {
  //     console.error("Error loading posts. Please try again later.", error);
  //   }
  //   //fetch here
  // };

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
          {
              previewUrl ? (
                <>
                 <div style={{ marginBottom: 2 }}><img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} /></div>
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
                    const inputElement = document.getElementById('image-input');
                    if (inputElement !== null) {
                      inputElement.click();
                    }
                  }}       
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    style={{ display: 'none' }}
                    id="image-input"
                  />
                  <Text style={styles.buttonText}>Select Image</Text>
                </TouchableOpacity>
              )
            }
        </View>
      ) : (
        <>
          <Text style={{ fontSize: 18, fontWeight: "550", fontFamily: "Montserrat", paddingRight: 55 }}>
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
            {formatDate(props.date)}
          </Text>
          <Text style={{ fontSize: 14, marginTop: 5, marginBottom: 10 }}>{content}</Text>
          {
              previewUrl && 
          <div style={{ marginBottom: 2 }}><img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} /></div>
          }       
        </>
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
          position: "absolute",
          top: 5,
          right: 5,
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
    display: 'flex', // Use flex to center the icon/text inside
    justifyContent: 'center', // Center content horizontally
    width: 110
  },
  buttonText: {
    color: colors.white, // Example style, adjust text color as needed
    //padding: 10,
    //backgroundColor: colors.purple,
    //borderRadius: 10,
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
    display: 'flex', // Use flex to center the icon/text inside
    justifyContent: 'center', // Center content horizontally
    width: 100
    
    // Additional styling for the icon button if needed
  },
});

export default IssueContent;
