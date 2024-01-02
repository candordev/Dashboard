import React, { useEffect, useState } from "react";
import { View } from "react-native";
import colors from "../Styles/colors";
import OuterComponentView from "./PopoverComponentView";
import DatePicker from "react-datepicker";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";
import { Post } from "../utils/interfaces";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { getAuth } from "firebase/auth";

type LocationProps = {
  issue: Post;
};

const Location: React.FC<LocationProps> = (props) => {
  const [key, setKey] = useState(0); // Initialize a key state
  const [inputValue, setInputValue] = useState("");
  const [idToken, setIdToken] = useState<string | "">("");

  const auth = getAuth();

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

  const handleSelect = async (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) => {
    const address = data.description; // Or use details.formatted_address

    try {
      let res = await customFetch(Endpoints.setNeighborhood, {
        method: "POST",
        body: JSON.stringify({
          address: address,
          postID: props.issue._id,
        }),
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
    <OuterComponentView title={"Location"}>
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
        styles={{borderWidth: 1,}}
      />
    </OuterComponentView>
  );
};

export default Location;
