import { getAuth } from "firebase/auth";
import React, { useEffect, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import { ScrollView, StyleSheet, TextInput, View, Image, ActivityIndicator} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { useUserContext } from "../Hooks/useUserContext";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import Assignees from "./Assignees";
import Category from "./Category";
import Text from "./Text";
import styles from "../Styles/styles";
import Deadline from "./Deadline";
import Location from "./Location";
import { useDropzone } from 'react-dropzone';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Or any other icon library you prefer


function CreatePostView(props: any) {
  // State to store input values
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [location, setLocation] = useState("");
  const [key, setKey] = useState(0); // Initialize a key state
  const auth = getAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { state, dispatch } = useUserContext();
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [idToken, setIdToken] = useState<string | "">("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setLoading] = useState(false)

  const onImageChange = (event : any) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Please select an image file.');
    }
  };




  // // console.log("THIS IS THE AUTH", auth)

  useEffect(() => {
    // Fetch the ID token
    const fetchToken = async () => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        // console.log("DAA TOKEN", token);
        setIdToken(token);
      }
    };
    fetchToken();
  }, []);

  const handleDateChange = async (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleDone = async () => {
    try {
      setLoading(true); // Assuming you have a setLoading function to handle UI loading state

      let formData = new FormData();
      formData.append('title', title);
      formData.append('groupID',state.currentGroup); // Assuming you have state.leaderGroups
      formData.append('content', content);
      formData.append('visible', true.toString());
      formData.append('anonymous', false.toString());
      formData.append('postCreatedFrom', "dashboard");
      formData.append('proposalFromEmail', email);
      formData.append('location', location);
      formData.append('neighborhood', neighborhood);
      formData.append('assigneeUsernames', JSON.stringify(selectedAssignees));
      formData.append('categoryNames', JSON.stringify(selectedCategories));
      formData.append('deadline', selectedDate ? selectedDate.toISOString() : '');

      // Append image or video data if present
      if (imageFile) {
        // The actual file needs to be appended here
        // This assumes `imageFile` is the actual File object selected by the user
        // Adjust according to your actual state structure
        formData.append('image', imageFile);
      }

      // Use your customFetch utility function
      const res = await customFetch(Endpoints.createDashboardProposal, {
        method: 'POST',
        body: formData,
        // customFetch should internally handle setting the appropriate headers, including Authorization
      },0,
      true,
      );

      if (!res.ok) {
        const resJson = await res.json();
        console.log("Error creating Post:", resJson.error);

        setErrorMessage(resJson.error); // Assuming you have setErrorMessage to handle error feedback
      } else {
        const resJson = await res.json();
        console.log("post details: ", resJson)
        props.onClose(); // Assuming this is to close the modal or navigate away upon success
        setErrorMessage(""); // Clear any previous errors
        // Additional success handling as needed
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
      setErrorMessage(String(error)); // Handling error state
    } finally {
      setLoading(false); // Ensure loading state is reset whether request succeeds or fails
    }
  };



  // const handleDone = async () => {
  //   try {
  //     let res = await customFetch(Endpoints.createDashboardProposal, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         title: title,
  //         content: content,
  //         groupID:state.currentGroup,
  //         visible: true,
  //         anonymous: false,
  //         postCreatedFrom: "dashboard",
  //         proposalFromEmail: email,
  //         location: location,
  //         neighborhood: neighborhood,
  //         assigneeUsernames: selectedAssignees,
  //         categoryNames: selectedCategories,
  //         deadline: selectedDate,
  //       }),
  //     });
  //     // console.log(res.body);
  //     const resJson = await res.json();
  //     if (!res.ok) {
  //       console.error("Error creating Post:", resJson.error);
  //       setErrorMessage(resJson.error);
  //     } else {
  //       props.onClose(); // Call the callback on successful post creation
  //       setErrorMessage("");
  //       // console.log("Post succesfully made", resJson);
  //       //event.emit(eventNames.ISSUE_CATEGORY_SET);
  //       // You can handle any additional state updates or notifications here
  //     }
  //   } catch (error) {
  //     console.error("Network error, please try again later.", error);
  //   }
  // };

  const handleSelect = async (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ): Promise<string> => {
    // FIX THIS TO CALL THE CREATPOSTSETNEIGHBORHOODROUTE
    const address = data.description; // Or use details.formatted_address
    setLocation(address);

    try {
      const queryParams = new URLSearchParams({ address: address });
      let res: Response = await customFetch(
        `${Endpoints.getNeighborhoodCreatePost}${queryParams.toString()}`,
        { method: "GET" }
      );

      let resJson = await res.json();
      if (!res.ok) {
        console.error("Error setting neighborhood:", resJson.error);
      } else {
        // console.log("THE NEIGHBORHOOD: ", resJson.neighborhood);
        setNeighborhood(resJson.neighborhood);
        return resJson.neighborhood;
        setNeighborhood(resJson.neighborhood); // Update the input box with the neighborhood
        setKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    }
    return "";
  };

  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleAssigneesChange = (assignees: string[]) => {
    // console.log("Selected Assignees in CreatePostView:", assignees);
    setSelectedAssignees(assignees); // Update state with the new value
  };

  const handleAssigneesChangeEmail = (assignees: string) => {
    // console.log("Selected Assignees in CreatePostView:", assignees);
  };

  const handleCategoryChange = (categories: string[] | null) => {
    // // console.log("Selected Categories in CreatePostView:", categories);
    if (categories) {
      setSelectedCategories(categories); // Update state with the new value
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl('');
  };

  return (
    <ScrollView
      style={additionalStyles.container}
      contentContainerStyle={{ rowGap: 10 }}
    >
      <TextInput
        style={styles.textInput}
        placeholder="Title"
        placeholderTextColor={colors.lightgray}
        value={title}
        onChangeText={setTitle}
      />
       {/* <View style={[styles.textInput, additionalStyles.contentInput]}>
      <TextInput
        //style={[styles.textInput, additionalStyles.contentInput]}
        placeholder="Content"
        placeholderTextColor={colors.lightgray}
        value={content}
        onChangeText={setContent}
        multiline
      />
       {imageInputButton}
       </View> */}
       <View style={additionalStyles.contentContainer}>
            <TextInput
              style={additionalStyles.contentInput}
              placeholder="Content"
              placeholderTextColor="lightgray"
              value={content}
              onChangeText={setContent}
              multiline
            />
            {
              previewUrl ? (
                <>
                 <div style={{ marginBottom: 2 }}><img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} /></div>
                  <TouchableOpacity
                    style={additionalStyles.removeImageButton}
                    onPress={() => {
                      clearImage(); // This function needs to clear the previewUrl and the file selection
                    }}
                  >
                    <Text style={additionalStyles.buttonText}>Remove Image</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={additionalStyles.imageIcon}
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
                  <Text style={additionalStyles.buttonText}>Select Image</Text>
                </TouchableOpacity>
              )
            }
      </View>
      <TextInput
        style={styles.textInput}
        placeholder="Constituent Email"
        placeholderTextColor={colors.lightgray}
        value={email}
        onChangeText={setEmail}
      />
      <Deadline createPost={true} onChange={handleDateChange} style={{zIndex: 4}}/>
    <Assignees
        createPost={true}
        onAssigneesChange={handleAssigneesChange}
        onAssigneesChangeEmail={handleAssigneesChangeEmail}
        style={{ zIndex: 3 }}
      />
      <Category
        createPost={true}
        onCategoryChange={handleCategoryChange}
        style={{ zIndex: 2 }}
      />
      <Location
        createPost={true}
        onChange={async (data, details) => handleSelect(data, details)}
      />
      <TouchableOpacity
          style={[additionalStyles.toggleButton, isLoading && { backgroundColor: colors.lightgray }]} // Optional: change background color when loading
          onPress={handleDone}
          disabled={isLoading} // Disable the button when loading
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.purple} />
          ) : (
            <Text style={additionalStyles.toggleButtonText}>Done</Text>
          )}
       </TouchableOpacity>
    </ScrollView>
  );
}

const additionalStyles = StyleSheet.create({
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
  previewImage: {
    width: '100%',
    maxHeight: 200,
    resizeMode: 'contain',
    // Adjust styling as needed
  },
  errorMessage: {
    color: "red", // or any color you prefer for error messages
    padding: 10,
    marginBottom: 10,
  },
  toggleButtonText: {
    fontFamily: "Montserrat",
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  toggleButton: {
    backgroundColor: colors.black,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 30,
  },
  container: {
    flex: 1,
    padding: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  contentInput: {
    height: 100, // Adjust height for multiline content input
    textAlignVertical: "top",
    borderColor: colors.white,
    borderWidth: 1,
    //borderRadius: 10,
    padding: 0,
    //backgroundColor: colors.transparent,
    outlineStyle: "none",
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
});

export default CreatePostView;
