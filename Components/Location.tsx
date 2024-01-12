import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { Post } from "../utils/interfaces";
import { customFetch } from "../utils/utils";
import OuterComponentView from "./PopoverComponentView";

type LocationProps = {
  issue?: Post;
  createPost?: boolean;
  onChange?: (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) => Promise<string>;
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
    console.log("THE LOCATION INPUT VALUE: ", props.issue?.neighborhood ?? "");
    setInputValue(props.issue?.neighborhood ?? "");
    console.log("issue fields: ", props.issue);

    fetchToken();
  }, []);

  const handleSelect = async (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) => {
    if (props.createPost && props.onChange) {
      const neighborhood: string = await props.onChange(data, details);
      setInputValue(neighborhood);
      setKey((prevKey) => prevKey + 1);
      return;
    }

    const address = data.description; // Or use details.formatted_address

    try {
      let res = await customFetch(Endpoints.setNeighborhood, {
        method: "POST",
        body: JSON.stringify({
          address: address,
          postID: props.issue?._id ?? "",
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
        styles={{
          textInput: {
            fontSize: 16,
            borderWidth: 1,
            borderColor: colors.lightgray,
            borderRadius: 10,
          },
        }}
      />
    </OuterComponentView>
  );
};

export default Location;
