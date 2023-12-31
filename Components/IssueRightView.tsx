import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ScrollView, View } from "react-native";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { useUserContext } from "../Hooks/useUserContext";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { Post } from "../utils/interfaces";
import { customFetch } from "../utils/utils";
import Assignees from "./Assignees";
import Category from "./Category";
import MarkDone from "./MarkDone";
import Text from "./Text";

interface IssueRightViewProps {
  fetchStatusUpdates: () => void;
  issue: Post;
}

function IssueRightView(props: IssueRightViewProps): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [idToken, setIdToken] = useState<string | "">("");
  const [inputValue, setInputValue] = useState("");
  const [key, setKey] = useState(0); // Initialize a key state
  const auth = getAuth();

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
    console.log("THE LOCATION INPUT VALUE: ", props.issue.neighborhood);
    setInputValue(props.issue.neighborhood);
    console.log("issue fields: ", props.issue);

    fetchToken();
  }, []);

  const handleDateChange = async (date: Date | null) => {
    try {
      let res = await customFetch(Endpoints.setDeadline, {
        method: "POST",
        body: JSON.stringify({
          postID: props.issue._id,
          deadline: date, // Assuming issueId is available in this component
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error adding DEADLINE:", resJson.error);
      } else {
        console.log("DEADLINE added successfully");
        setSelectedDate(date);

        //event.emit(eventNames.ISSUE_CATEGORY_SET);
        // You can handle any additional state updates or notifications here
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  };

  const { state, dispatch } = useUserContext();

  useEffect(() => {
    console.log("THIS IS THE DEADLINE", props.issue.deadline);
    if (props.issue.deadline) {
      setSelectedDate(new Date(props.issue.deadline));
    } else {
      setSelectedDate(null);
    }
  }, []);

  const handleSelect = async (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) => {
    const address = data.description; // Or use details.formatted_address

    try {
      let res = await customFetch(Endpoints.setNeighborhood, {
        method: "POST",
        body: JSON.stringify({ address: address, postID: props.issue._id }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error setting neighborhood:", resJson.error);
      } else {
        const resJson = await res.json();
        console.log("THE NEIGHBORHOOD: ", resJson.neighborhood);
        setInputValue(resJson.neighborhood); // Update the input box with the neighborhood
        setKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  };

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
      <View style={{ zIndex: 2 }}>
        <View style={{ zIndex: 4 }}>
        <Assignees issue={props.issue} createPost={false} />
        </View>
        <Category issueId={props.issue._id} createPost={false} />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "550",
            fontFamily: "Montserrat",
            marginTop: 7,
          }}
        >
          Select Deadline
        </Text>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          showTimeSelect
          dateFormat="Pp"
        />
      </View>
      <Text
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
        placeholder={inputValue ? inputValue : "Search"}
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
      />
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
        {(props.issue.userProfile.firstName !== "Candor Website" ||
          props.issue.userProfile.lastName !== "Bot") && (
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
      </View>
      <View style={{ rowGap: 10 }}>
        <MarkDone
          fetchStatusUpdates={props.fetchStatusUpdates}
          issueId={props.issue._id}
          step={props.issue.step}
        />
        {/* <CloseIssue /> */}
      </View>
    </ScrollView>
  );
}

export default IssueRightView;
