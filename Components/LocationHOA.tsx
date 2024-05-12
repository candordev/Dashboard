import React, { useState, useEffect } from "react";
import { TextInput, TouchableOpacity, View, Text } from "react-native";
import colors from "../Styles/colors";
import { customFetch } from "../utils/utils"; 
import OuterComponentView from "./PopoverComponentView";
import { Endpoints } from "../utils/Endpoints";
import { Post } from "../utils/interfaces"; 

type LocationProps = {
  issue?: Post;
  style?: any;
  createPost?: Boolean;
  onChange?: (address: string) => Promise<string>;
};

const Location: React.FC<LocationProps> = ({ issue, style, createPost, onChange }) => {
  const [location, setLocation] = useState(issue?.location ?? "");
  const [editing, setEditing] = useState(false);

  const handleDone = async () => {

    console.log("empty location: ", )
    let passLoc = location;
    if(!location){
      passLoc = " ";
    }
    try {
      const response = await customFetch(Endpoints.editPost, {
        method: "POST",
        body: JSON.stringify({
          location: passLoc,
          postID: issue?._id,
        }),
      });

      const jsonResponse = await response.json();
      if (!response.ok) {
        throw new Error(jsonResponse.error || "An error occurred while updating the location");
      }

      console.log("Location updated successfully:", jsonResponse);
      setEditing(false); 
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  return (
    <OuterComponentView title={"Location"} style={style}>
        <>
          <TextInput
            value={location}
            onChangeText={async (newLocation) => {
              setLocation(newLocation);
              if (createPost && onChange) {
                await onChange(newLocation); 
              }
            }}
            style={{
              fontSize: 16,
              borderColor: colors.lightgray,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
            }}
          />

          {!createPost && (
            <TouchableOpacity
              onPress={handleDone}
              style={{
                backgroundColor: colors.purple,
                borderRadius: 10,
                padding: 10,
                marginTop: 10,
              }}
            >
              <Text style={{ color: colors.white, textAlign: "center", fontSize: 16, fontWeight: "600", fontFamily: "Montserrat" }}>
                Save
              </Text>
            </TouchableOpacity>
          )}
        </>
    </OuterComponentView>
  );
};

export default Location;
