import React, { useState, useEffect, useRef } from "react";
import { Modal, View, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import Button from "./Button";
import colors from "../Styles/colors";
import { Post } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";

type EditImagesModalProps = {
  visible: boolean;
  postID: string;
  imgURLs: string[];
  imageCaptions: string[];
  editing: boolean;
  handleClose: () => void;
};

const EditImagesModal: React.FC<EditImagesModalProps> = ({ visible, postID, imgURLs, editing, imageCaptions, handleClose }) => {
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [captions, setCaptions] = useState<string[]>([]); 
  const fileInputRef = useRef<HTMLInputElement>(null); 

  useEffect(() => {
    console.log("imgURLs: ", imgURLs)
    console.log("imageCaptions: ", imageCaptions)
    setPreviewURLs(imgURLs);
    setCaptions(imageCaptions);
  }, [visible, imgURLs, imageCaptions]); 

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files);
      const newPreviewURLs = fileArray.map(file => URL.createObjectURL(file));
  
      setPreviewURLs(prevPreviews => [...prevPreviews, ...newPreviewURLs]);
  
      // Update files and captions using functional updates
      setFiles(prevFiles => [...prevFiles, ...fileArray]);
      setCaptions(prevCaptions => [...prevCaptions, ...new Array(fileArray.length).fill("New Caption")]);
    }
  };

  const handleCaptionChange = (text: string, index: number) => {
    const updatedCaptions = [...captions];
    updatedCaptions[index] = text;
    setCaptions(updatedCaptions);
  };

  const handleRemoveImage = (index: number) => {
    const newPreviewURLs = previewURLs.filter((_, idx) => idx !== index);
    const newFiles = files.filter((_, idx) => idx !== index);
    const newCaptions = captions.filter((_, idx) => idx !== index);
    setPreviewURLs(newPreviewURLs);
    setFiles(newFiles);
    setCaptions(newCaptions);
  };


  function useClose() {
    setError("");
    handleClose();
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDone = async () => {
    setError("");
    let formData = new FormData();
    formData.append('postID', postID); 
    files.forEach((file, index) => {
      formData.append(`image${index}`, file);
    });
    captions.forEach((caption, index) => {
      formData.append(`captions`, caption);
    });

    let res = await customFetch(Endpoints.editPost, {
      method: "POST",
      body: formData,
    },0,true);

    if (!res.ok) {
      let resJson = await res.json();
      setError(resJson.error);
    } else {
      useClose();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView horizontal contentContainerStyle={styles.scrollView}>
            {previewURLs.map((url, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: url }} style={styles.image} />
                {editing ? (
                  <TextInput
                    style={styles.captionInput}
                    onChangeText={(text) => handleCaptionChange(text, index)}
                    value={captions[index]}
                    placeholder="Edit caption"
                  />
                ) : (
                  <Text style={styles.captionText}>{captions[index]}</Text>
                )}
                {editing && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Text style={styles.deleteButtonText}>X</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
          {editing && (
            <>
              <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={triggerFileInput}
                >
              <Text style={styles.buttonText}>Upload Image</Text>
              </TouchableOpacity>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".png, .jpg, .jpeg"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <Text style={styles.errorText}>{error}</Text>
            </>
          )}
          
          <View style={styles.buttonRow}>
            <Button
              text="Close"
              onPress={handleClose}
              style={styles.closeButton}
              textStyle={styles.buttonText}
            />
            {editing && (
                <Button
                text="Done"
                onPress={handleDone}
                style={styles.doneButton}
                textStyle={styles.buttonText}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  captionInput: {
    height: 40,
    width: 150, // You can adjust the width as needed
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 5,
    borderRadius: 5,
    padding: 10,
  },
  captionText: {
    marginTop: 10,
    color: 'black',
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    maxHeight: '80%',
  },
  scrollView: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 150, // Adjusted width for smaller screen space
    height: 100, // Adjusted height
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: 'red',
    borderRadius: 15,
    padding: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: colors.lightgray,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: colors.lightgray,
    borderRadius: 10,
    padding: 10,
    marginLeft: 5,
  },
  doneButton: {
    backgroundColor: colors.purple,
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  }
});

export default EditImagesModal;
