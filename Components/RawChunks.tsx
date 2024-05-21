import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import { customFetch } from "../utils/utils"; // Update the import path as needed
import { Endpoints } from "../utils/Endpoints"; // Update the import path as needed
import colors from "../Styles/colors";
import FeatherIcon from "react-native-vector-icons/Feather";
import styles from "../Styles/styles";
import Button from "./Button";
import { color } from "react-native-reanimated";
import SearchBar from "./SearchBar";

type MemberManagementProps = {
  documentTitle: string;
  headerTitle: string;
};

type Chunk = {
  content: string;
  documentTitle: string; // this ID will be the id of the document in the database igg??
  _id: string;
};

const RawChunks = ({ documentTitle, headerTitle }: MemberManagementProps) => {
  const [Chunks, setChunks] = useState<Chunk[]>([]);
  const [editingFAQId, setEditingFAQId] = useState<string | null>(null);
  const [contentEdit, setContentEdit] = useState<string>("");
  const [newContent, setNewContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [inputHeight, setInputHeight] = useState(0);
  const [searchPhrase, setSearchPhrase] = useState("");

  const filteredChunks = Chunks.filter((chunk) =>
    chunk.content.toLowerCase().includes(searchPhrase.toLowerCase()) || chunk.documentTitle.toLowerCase().includes(searchPhrase.toLowerCase())
  );


  useEffect(() => {
    const fetchChunks = async () => {
      try {
        const endpoint = `${Endpoints.getChunks}?title=${documentTitle}`; // FIX THIS
        const res = await customFetch(endpoint, { method: "GET" });
        const resJson = await res.json();

        if (!res.ok) throw new Error(resJson.error);
        console.log(resJson);
        console.log("Chunks", resJson);
        setChunks(resJson);
      } catch (error) {}
    };

    fetchChunks();
  }, [documentTitle]);

  const handleAddDocument = async () => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append("content", newContent);
    formData.append("title", documentTitle);
    // Add other fields your endpoint might require

    try {
      const response = await customFetch(
        Endpoints.addChunk,
        {
          method: "POST",
          body: formData,
        },
        0,
        true
      ); // Added attempt parameter (0) and set multiPart to true

      const addedChunk = await response.json();

      if (!response.ok) {
        console.log("adding the document did not work")
        throw new Error(addedChunk.error);
      } else {
        console.log("adding the document did worked")
              // Assuming the response includes the newly added document
        console.log("added FAQ", addedChunk);
        setChunks((currentChunks) => [...currentChunks, addedChunk]);

        // Reset for the next upload
        setNewContent("")
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteChunk = async (docId: string) => {
    try {
      // Prepare the data for the request
      const bodyData = {
        documentId: docId,
        // Include other necessary fieldsx
      };

      // Make the API call
      const response = await customFetch(`${Endpoints.deleteChunk}`, {
        method: "DELETE",
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error("Failed to update the document: ");
      }
      // If the update is successful, update the documents state
      setChunks((docs) => docs.filter((d) => d._id != docId));
    } catch (error) {
      console.error("Failed to edit document:", error);
      // Handle errors, e.g., by setting an error state or showing a message
    }
    // Use the DELETE /api/group/deletePinnedDocument route
  };
  const handleEditDocument = async (Chunk: Chunk) => {
    try {
      // Prepare the data for the request
      console.log("contentEdit", contentEdit)
      const bodyData = {
        documentId: Chunk._id,
        newContent: contentEdit,
        // Include other necessary fieldsx
      };

      // Make the API call
      const response = await customFetch(`${Endpoints.editChunk}`, {
        method: "POST",
        body: JSON.stringify(bodyData),
      });

      Chunk.content = contentEdit;

      if (!response.ok) {
        throw new Error("Failed to update the document: ");
      }

      setEditingFAQId(null);
      // If the update is successful, update the documents state
      setChunks((docs) => docs.map((d) => (d._id === Chunk._id ? Chunk : d)));
    } catch (error) {
      console.error("Failed to edit document:", error);
      // Handle errors, e.g., by setting an error state or showing a message
    }
  };

  //handleEditDocument

  // Function to initiate editing
  const startEditing = (item: any) => {
    setEditingFAQId(item._id);
    setContentEdit(item.content); // Set initial value to item's current name
  };

  const renderItem = ({ item }: { item: Chunk }) => {
    const isEditing = editingFAQId === item._id;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderColor: "#e1e1e1",
        }}
        >
        {isEditing ? (
        <>
            <TextInput
            style={[styles.textInput, {flex: 0.95, fontFamily: "Montserrat", height: Math.max(35, inputHeight) }]}
            value={contentEdit}
            onChangeText={(text) => setContentEdit(text)}
            multiline={true}
            numberOfLines={10} // Adjust number of lines as needed
            onContentSizeChange={(event) => {
                setInputHeight(event.nativeEvent.contentSize.height);
              }}
            />
            <Button
            text="Done"
            style={{backgroundColor: colors.purple, marginRight: 2}}
            onPress={() => handleEditDocument(item)}
            />
        </>
        ) : (
        <View
            style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 10,
            }}
        >
            <TouchableOpacity onPress={() => {}}>
            <Text style={{ fontFamily: "Montserrat", fontSize: 16 }}>
                {item.content}
            </Text>
            </TouchableOpacity>
        </View>
        )}

        {!isEditing && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              paddingHorizontal: 5,
              paddingLeft: 10,
            }}
          >
            <TouchableOpacity onPress={() => startEditing(item)}>
              <Text
                style={{
                  color: colors.purple,
                  fontFamily: "Montserrat",
                  marginRight: 10,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
            {/* <Icon name="delete" size={24} color={colors.red} onPress={() => handleDeleteDocument(item._id)} /> */}
            <TouchableOpacity onPress={() => handleDeleteChunk(item._id)}>
              <FeatherIcon name="trash" size={15} color={colors.red} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.groupSettingsContainer}>
      <Text
        style={{
          alignSelf: "flex-start",
          fontWeight: "600",
          fontSize: 27,
          fontFamily: "Montserrat",
        }}
      >
        {headerTitle}
      </Text>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        placeholder="Search chunks..."
        containerStyle={{
          width: "100%",
          borderRadius: 10,
          marginBottom: 5,
          backgroundColor: colors.white,
        }}
      />
      <FlatList
        data={filteredChunks}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      <View
        style={{ padding: 10, borderTopWidth: 1, borderTopColor: "#e1e1e1" }}
      >
        <TextInput
          style={[styles.textInput, { fontFamily: "Montserrat", marginBottom: 10, }]}
          value={newContent}
          onChangeText={setNewContent}
          placeholder="New Chunk Content"
          placeholderTextColor={colors.gray}
        />
        <Button
          text="Add Chunk"
          onPress={handleAddDocument}
          style={{backgroundColor: colors.purple}}
          loading={isUploading}
        />
      </View>
    </View>
  );
};

export default RawChunks;
