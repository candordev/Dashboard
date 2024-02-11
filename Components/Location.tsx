import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { TextInput, TouchableOpacity, View } from "react-native";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { Post } from "../utils/interfaces";
import { customFetch } from "../utils/utils";
import OuterComponentView from "./PopoverComponentView";
import { deepStrictEqual } from "assert";
import Text from "./Text";

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
  const [fullAddress, setFullAddress] = useState("");
  const [editing, setEditing] = useState(false);

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
    setFullAddress(props.issue?.location ?? "")
    console.log("issue fields: ", props.issue);

    fetchToken();
  }, [props.issue]);

  const handleSelect = async (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) => {
    if (props.createPost && props.onChange) {
      const neighborhood: string = await props.onChange(data, details);
      setInputValue(neighborhood);
      setKey((prevKey) => prevKey + 1);
      setFullAddress(data.description)
      return;
    }

    const address = data.description; // Or use details.formatted_address
    setFullAddress(address)

    console.log("The data needed", data);

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

  const handleDone = async () => {
    try {

      let res: Response = await customFetch(Endpoints.editPost, {
        method: "POST",
        body: JSON.stringify({
           neighborhood: inputValue,
           postID: props.issue?._id ?? "", // Assuming issue._id is the ID of the post to be edited
        }),
      });

      let resJson = await res.json();
      if (!res.ok) {
        // setErrorMessage('Please enter a valid email');
        setInputValue(inputValue);
        console.error(resJson.error);
      } else {
        setEditing(false);
        // console.log("Successfully edited proposalFromEmail");
        // Optionally, you can update the local state or perform other actions upon successful update
      }
    } catch (error) {
      console.error("Error editing post. Please try again later.", error);
    }
  };


  return (
    <OuterComponentView title={"Location"}>
      <Text style={{
            fontSize: 15,
            fontWeight: "525",
            fontFamily: "Montserrat",
          }}>
           {"Address: "}
      </Text>
      <GooglePlacesAutocomplete
        key={key} // Use the key here
        placeholder={fullAddress ? fullAddress : "Search"}
        onPress={handleSelect}
        query={{
          key: "AIzaSyD-DMOdct5BYGr0zv9UHIZ3Sk9ZWWdJEUY",
          language: "en",
        }}
        requestUrl={{
          useOnPlatform: "web", // or "all"
          url: "https://candoradmin.com/api/userActivity/google-places-proxy", // or any proxy server that hits https://maps.googleapis.com/maps/api

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
            marginTop: 5,
            maxHeight: 32,
            fontFamily: "Montserrat",
          },
        }}
      />
      {inputValue &&
      <>
       <Text style={{
        fontSize: 15,
        fontWeight: "525",
        fontFamily: "Montserrat",
        marginTop: 5,
        marginBottom: 5
      }}>
      {"Neighborhood: "}
      </Text>
       <View style={{flexDirection: "row", alignItems: "center" }}>
        {editing ? (
          <>
           <TextInput
            value={inputValue}
            onChangeText={setInputValue}
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
      </>
        ): (
          <>
          <Text style={{
                fontSize: 15,
                fontWeight: "400",
                fontFamily: "Montserrat",
                marginLeft: 11
              }}>
              {inputValue}
          </Text>
        </>

        )}
      <TouchableOpacity
      onPress={() => {
          if (editing) {
              handleDone(); // Call handleDone when in editing mode and Done is pressed
          } else {
              setEditing(true); // Switch to editing mode when Edit is pressed
          }
      }}
      style={editing ? doneButtonStyle : editButtonStyle}
  >
      <Text style={{ color: editing ? colors.white : colors.black, fontWeight: '500' }}>
          {editing ? 'Done' : 'Edit'}
      </Text>
      </TouchableOpacity>
      </View>
      </>
      
      }
    </OuterComponentView>
  );
};

const editButtonStyle = {
  marginLeft: 10,
  backgroundColor: colors.lightestgray,
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 15
};

const doneButtonStyle = {
  ...editButtonStyle,
  backgroundColor: colors.purple,
  borderRadius: 15
};



export default Location;
