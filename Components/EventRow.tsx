import React, { useState, useCallback } from "react";
import { TextInput, View, StyleSheet, KeyboardTypeOptions } from "react-native";
import { Event } from "../utils/interfaces";
import colors from "../Styles/colors";
import Text from "./Text";
import Button from "./Button";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";
import { fitBounds } from "google-map-react";
import { useUserContext } from "../Hooks/useUserContext";
import EventImageModal from "./EventImageModal";

const EventRow = ({
  event,
  fetchEvents,
}: {
  event: Event;
  fetchEvents: () => void;
}) => {
  const {
    title,
    description,
    date,
    startTime,
    endTime,
    location,
    xCord,
    yCord,
    level,
    imageUrl,
  }: Event = event;
  const [edit, setEdit] = useState(false);

  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedDate, setUpdatedDate] = useState(formatDate(date));
  const [updatedStartTime, setUpdatedStartTime] = useState(startTime);
  const [updatedEndTime, setUpdatedEndTime] = useState(endTime);
  const [updatedLocation, setUpdatedLocation] = useState(location);
  const [updatedXCord, setUpdatedXCord] = useState(xCord);
  const [updatedYCord, setUpdatedYCord] = useState(yCord);
  const [updatedLevel, setUpdatedLevel] = useState(level);
  const [updatedImageUrl, setUpdatedImageUrl] = useState(imageUrl);
  const { state, dispatch } = useUserContext();
  const [editImagesModalVisible, setEditImagesModalVisible] = useState(false);

  function formatDate(dateEvent: Date) {
    const date = new Date(dateEvent);
    const dateString = date.toLocaleDateString("en-US", {
      timeZone: "UTC",
      weekday: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    return dateString;
  }

  const updateEvent = async () => {
    try {
      let res = await customFetch(Endpoints.editEvent, {
        method: "PUT",
        body: JSON.stringify({
          title: updatedTitle,
          description: updatedDescription,
          date: new Date(updatedDate).toISOString(),
          startTime: updatedStartTime,
          endTime: updatedEndTime,
          location: updatedLocation,
          xCord: updatedXCord,
          yCord: updatedYCord,
          level: updatedLevel,
          imageUrl: updatedImageUrl,
          eventId: event._id,
          groupId: state.currentGroup,
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with changing event:", resJson.error);
      } else {
        fetchEvents();
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  };

  const handleNumberChange = (
    text: string,
    setText: (value: number) => void
  ) => {
    if (text === "" || text === "-") {
      setText(parseFloat(text) || 0);
    } else {
      const number = parseFloat(text);
      if (!isNaN(number)) {
        setText(number);
      }
    }
  };

  const handleCloseModal = () => {
    setEditImagesModalVisible(false); // Explicitly close the modal
    fetchEvents();
  };

  const handleOpenModal = () => {
    // Add your event handling logic here
    setEditImagesModalVisible(true);
  };

  const handleDelete = async (eventId: string) => {
    try {
      let res = await customFetch(Endpoints.deleteEvent, {
        method: "DELETE",
        body: JSON.stringify({
          eventId: eventId,
          groupId: state.currentGroup,
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with deleting event:", resJson.error);
      } else {
        fetchEvents();
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  };

  const TextElement = useCallback(
    ({
      text,
      setText,
      edit,
      flex,
      keyboardType,
    }: {
      text: string;
      setText: (text: string) => void;
      edit: boolean;
      flex: number;
      keyboardType?: string;
    }) => {
      return (
        <View style={{ flex: flex, marginRight: edit ? 10 : 0, marginLeft: 5 }}>
          {edit ? (
            <TextInput
              value={text}
              onChangeText={setText}
              keyboardType={keyboardType as KeyboardTypeOptions}
              style={[
                styles.input,
                {
                  fontFamily: "Montserrat",
                  borderWidth: 1,
                  borderColor: colors.gray,
                  borderRadius: 5,
                  padding: 5,
                  flex: 1,
                  flexWrap: "wrap",
                },
              ]}
            />
          ) : (
            <Text style={{ fontSize: 15, flex: 1, flexWrap: "wrap" }}>
              {text}
            </Text>
          )}
        </View>
      );
    },
    []
  );

  return (
    <View
      style={{
        flexDirection: "row",
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightgray,
        alignItems: "center",
        padding: 10,
        columnGap: 5,
      }}
    >
      <TextElement
        text={updatedTitle}
        setText={setUpdatedTitle}
        edit={edit}
        flex={1.5}
      />
      <TextElement
        text={updatedDescription}
        setText={setUpdatedDescription}
        edit={edit}
        flex={1.5}
      />
      <TextElement
        text={updatedDate}
        setText={setUpdatedDate}
        edit={edit}
        flex={1}
        keyboardType="numeric"
      />
      <TextElement
        text={updatedStartTime}
        setText={setUpdatedStartTime}
        edit={edit}
        flex={0.7}
      />
      <TextElement
        text={updatedEndTime}
        setText={setUpdatedEndTime}
        edit={edit}
        flex={0.7}
      />
      <TextElement
        text={updatedLocation}
        setText={setUpdatedLocation}
        edit={edit}
        flex={1.5}
      />
      <TextElement
        text={updatedXCord.toString()}
        setText={(text) => handleNumberChange(text, setUpdatedXCord)}
        edit={edit}
        flex={0.5}
        keyboardType="numeric"
      />
      <TextElement
        text={updatedYCord.toString()}
        setText={(text) => handleNumberChange(text, setUpdatedYCord)}
        edit={edit}
        flex={0.5}
        keyboardType="numeric"
      />
      <TextElement
        text={updatedLevel.toString()}
        setText={(text) => handleNumberChange(text, setUpdatedLevel)}
        edit={edit}
        flex={0.5}
        keyboardType="numeric"
      />
      <Button
        text="I"
        onPress={() => {
          handleOpenModal();
        }}
        style={{
          borderRadius: 5,
          margin: 5,
          padding: 5,
          width: fitBounds,
          backgroundColor: colors.purple,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
      <Button
        text="Delete"
        onPress={() => {
          handleDelete(event._id);
        }}
        style={{
          borderRadius: 5,
          margin: 5,
          padding: 5,
          width: fitBounds,
          backgroundColor: colors.red,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
      {edit ? (
        <Button
          text="Done"
          onPress={() => {
            updateEvent();
            setEdit(!edit);
          }}
          style={{
            borderRadius: 5,
            margin: 5,
            padding: 5,
            width: fitBounds,
            backgroundColor: colors.purple,
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      ) : (
        <Button
          text="Edit"
          onPress={() => setEdit(!edit)}
          style={{
            width: 50,
            height: 30,
            borderRadius: 5,
            backgroundColor: colors.purple,
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      )}
      <EventImageModal
        visible={editImagesModalVisible}
        handleClose={handleCloseModal}
        eventId={event._id}
        imageUrl={updatedImageUrl}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    // your existing input styles here
  },
});

export default EventRow;
