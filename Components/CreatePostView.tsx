import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
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

  // console.log("THIS IS THE AUTH", auth)

  useEffect(() => {
    // Fetch the ID token
    const fetchToken = async () => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        console.log("DAA TOKEN", token);
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
      let res = await customFetch(Endpoints.createDashboardProposal, {
        method: "POST",
        body: JSON.stringify({
          title: title,
          content: content,
          groupID: state.leaderGroups[0],
          visible: true,
          anonymous: false,
          postCreatedFrom: "dashboard",
          proposalFromEmail: email,
          location: location,
          neighborhood: neighborhood,
          assigneeUsernames: selectedAssignees,
          categoryNames: selectedCategories,
          deadline: selectedDate,
        }),
      });
      console.log(res.body);
      const resJson = await res.json();
      if (!res.ok) {
        console.error("Error creating Post:", resJson.error);
        setErrorMessage(resJson.error);
      } else {
        props.onClose(); // Call the callback on successful post creation
        setErrorMessage("");
        console.log("Post succesfully made", resJson);
        //event.emit(eventNames.ISSUE_CATEGORY_SET);
        // You can handle any additional state updates or notifications here
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  };

  const handleSelect = async (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) : Promise<string> => {
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
        console.log("THE NEIGHBORHOOD: ", resJson.neighborhood);
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
    console.log("Selected Assignees in CreatePostView:", assignees);
    setSelectedAssignees(assignees); // Update state with the new value
  };

  const handleAssigneesChangeEmail = (assignees: string) => {
    console.log("Selected Assignees in CreatePostView:", assignees);
  };

  const handleCategoryChange = (categories: string[] | null) => {
    console.log("Selected Categories in CreatePostView:", categories);
    if (categories) {
      setSelectedCategories(categories); // Update state with the new value
    }
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
      <TextInput
        style={[styles.textInput, additionalStyles.contentInput]}
        placeholder="Content"
        placeholderTextColor={colors.lightgray}
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TextInput
        style={styles.textInput}
        placeholder="Constituent Email"
        placeholderTextColor={colors.lightgray}
        value={email}
        onChangeText={setEmail}
      />

      <Assignees
        createPost={true}
        onAssigneesChange={handleAssigneesChange}
        onAssigneesChangeEmail={handleAssigneesChangeEmail}
      />

      <Category createPost={true} onCategoryChange={handleCategoryChange} />

      {/* <Text
        style={{
          fontSize: 18,
          fontWeight: "550",
          fontFamily: "Montserrat",
          padding: 5,
          marginTop: 10,
        }}
      >
        Select Deadline
      </Text>
      <View style={{ zIndex: 4, marginTop: 5 }}>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          showTimeSelect
          dateFormat="Pp"
          popperPlacement="bottom"
        />
      </View> */}
      <Deadline createPost={true} onChange={handleDateChange} />
      {/* <Text
        style={{
          fontSize: 18,
          fontWeight: "550",
          fontFamily: "Montserrat",
          marginTop: 20,
        }}
      >
        Select Location
      </Text>

      <GooglePlacesAutocomplete
        key={key} // Use the key here
        placeholder={neighborhood ? neighborhood : "Search"}
        onPress={handleSelect}
        query={{
          key: "AIzaSyD-DMOdct5BYGr0zv9UHIZ3Sk9ZWWdJEUY",
          language: "en",
        }}
        requestUrl={{
          useOnPlatform: "web", // or "all"
          url: "http://184.72.74.25:4000/api/userActivity/google-places-proxy", // or any proxy server that hits https://maps.googleapis.com/maps/api
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + idToken,
          },
        }}
      /> */}
      <Location createPost={true} onChange={async (data, details) => handleSelect(data, details)} />

      {/* <Text style={additionalStyles.errorMessage}>{errorMessage}</Text> */}
      <TouchableOpacity
        style={additionalStyles.toggleButton}
        onPress={handleDone}
      >
        <Text style={additionalStyles.toggleButtonText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const additionalStyles = StyleSheet.create({
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
  },
});

export default CreatePostView;
