import React, { useState } from "react";
import { TextInput, TouchableOpacity, View, Text } from "react-native";
import colors from "../Styles/colors";
import { customFetch } from "../utils/utils"; // Assuming customFetch is your utility function for making fetch requests
import OuterComponentView from "./PopoverComponentView";
import { Endpoints } from "../utils/Endpoints";
import { Post } from "../utils/interfaces"; // Assuming this is where you've defined your Post interface

// Define a type for the component's props
type LocationProps = {
  issue: Post; // Using the Post interface for the issue
};

const Location: React.FC<LocationProps> = ({ issue }) => {
  const [location, setLocation] = useState(issue?.location ?? "");
  const [editing, setEditing] = useState(false);

  const handleDone = async () => {
    try {
      let response = await customFetch(Endpoints.editPost, {
        method: "POST",
        body: JSON.stringify({
          location: location,
          postID: issue?._id,
        }),
      });

      let jsonResponse = await response.json();
      if (!response.ok) {
        throw new Error(jsonResponse.error || 'An error occurred while updating the location');
      }

      console.log("Location updated successfully:", jsonResponse);
      setEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error updating location:", error.message);
    }
  };

  return (
    <OuterComponentView title={"Location"}>
      {location || editing ? (
        <>
          {editing ? (
            <TextInput
              value={location}
              onChangeText={setLocation}
              style={{
                fontSize: 16,
                borderColor: colors.lightgray,
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
              }}
            />
          ) : (
            <Text style={{ fontSize: 16, padding: 10 }}>{location}</Text>
          )}
          <TouchableOpacity
            onPress={() => {
              if (editing) {
                handleDone();
              } else {
                setEditing(true);
              }
            }}
            style={{
              backgroundColor: editing ? colors.lightestgray : colors.purple,
              borderRadius: 10,
              padding: 10,
              marginTop: editing || location ? 10 : 5, // Reduce the margin top if no location
            }}
          >
            <Text style={{ color: editing ? colors.black : colors.white, textAlign: 'center', fontSize: 16, fontWeight: "600", fontFamily: "Montserrat"}}>
              {editing ? 'Done' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        // Render the "Add Location" button with reduced marginTop
        <TouchableOpacity
          onPress={() => setEditing(true)}
          style={{
            backgroundColor: colors.purple,
            borderRadius: 10,
            padding: 10,
            marginTop: 5, // Reduced marginTop when no location is present
          }}
        >
          <Text style={{ color: colors.white, textAlign: 'center', fontSize: 16, fontWeight: "600", fontFamily: "Montserrat"}}>
            Add Location
          </Text>
        </TouchableOpacity>
      )}
    </OuterComponentView>
  );
};

export default Location;
