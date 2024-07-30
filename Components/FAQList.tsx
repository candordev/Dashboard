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

type MemberManagementProps = {
  groupID: string;
};

type FAQ = {
  question: string;
  _id: string; // this ID will be the id of the document in the database igg??
  answer: string;
  // Include other properties that your documents have
};

const FAQList = ({ groupID }: MemberManagementProps) => {
  const [FAQs, setFAQs] = useState<FAQ[]>([]);
  const [editingFAQId, setEditingFAQId] = useState<string | null>(null);
  const [questionEdit, setQuestionEdit] = useState<string>("");
  const [answerEdit, setAnswerEdit] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const endpoint = `${Endpoints.getFAQs}groupID=${groupID}`; // FIX THIS
        const res = await customFetch(endpoint, { method: "GET" });
        const resJson = await res.json();

        if (!res.ok) throw new Error(resJson.error);
        console.log(resJson);
        console.log("FAQs", resJson);
        setFAQs(resJson);
      } catch (error) {}
    };

    fetchFAQs();
  }, [groupID]);

  const handleAddDocument = async () => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append("question", newQuestion);
    formData.append("answer", newAnswer);
    formData.append("groupID", groupID);
    // Add other fields your endpoint might require

    try {
      const response = await customFetch(
        Endpoints.addFAQ,
        {
          method: "POST",
          body: formData,
        },
        0,
        true
      ); // Added attempt parameter (0) and set multiPart to true

      if (!response.ok) {
        const resJson = await response.json();
        console.error("Error with adding Pinned Document:", resJson.error);
      } else {
        console.log("emailed akshatpant@ufl.edu the csv");
      }

      // Assuming the response includes the newly added document
      const addedFAQ = await response.json();
      console.log("added FAQ", addedFAQ);
      setFAQs((currentFAQs) => [...currentFAQs, addedFAQ]);

      // Reset for the next upload
      setNewQuestion("");
      setNewAnswer("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFAQ = async (faqId: string) => {
    try {
      // Prepare the data for the request
      const bodyData = {
        faqID: faqId,
        groupID: groupID,
        // Include other necessary fieldsx
      };

      // Make the API call
      const response = await customFetch(`${Endpoints.deleteFAQ}`, {
        method: "DELETE",
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error("Failed to update the document: ");
      }
      // If the update is successful, update the documents state
      setFAQs((docs) => docs.filter((d) => d._id != faqId));
    } catch (error) {
      console.error("Failed to edit document:", error);
      // Handle errors, e.g., by setting an error state or showing a message
    }
    // Use the DELETE /api/group/deletePinnedDocument route
  };
  const handleEditDocument = async (FAQ: FAQ) => {
    try {
      // Prepare the data for the request
      const bodyData = {
        faqID: FAQ._id,
        groupID: groupID,
        newQuestion: questionEdit,
        newAnswer: answerEdit,
        // Include other necessary fieldsx
      };

      // Make the API call
      const response = await customFetch(`${Endpoints.editFAQ}`, {
        method: "POST",
        body: JSON.stringify(bodyData),
      });

      FAQ.question = questionEdit;
      FAQ.answer = answerEdit;

      if (!response.ok) {
        throw new Error("Failed to update the document: ");
      }

      setEditingFAQId(null);
      // If the update is successful, update the documents state
      setFAQs((docs) => docs.map((d) => (d._id === FAQ._id ? FAQ : d)));
    } catch (error) {
      console.error("Failed to edit document:", error);
      // Handle errors, e.g., by setting an error state or showing a message
    }
  };

  //handleEditDocument

  // Function to initiate editing
  const startEditing = (item: any) => {
    setEditingFAQId(item._id);
    setQuestionEdit(item.question); // Set initial value to item's current name
    setAnswerEdit(item.answer); // Set initial value to item's current description
  };

  const renderItem = ({ item }: { item: FAQ }) => {
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
              style={[styles.textInput, { fontFamily: "Montserrat" }]}
              value={questionEdit}
              onChangeText={(text) => setQuestionEdit(text)}
            />
            <TextInput
              style={[styles.textInput, { fontFamily: "Montserrat" }]}
              value={answerEdit}
              onChangeText={(text) => setAnswerEdit(text)}
            />
            <Button
              text="Done"
              style={{color: colors.purple}}
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
                {item.question}
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontSize: 14,
                  color: "#666",
                }}
              >
                {item.answer}
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
            <TouchableOpacity onPress={() => handleDeleteFAQ(item._id)}>
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
        Manage FAQs
      </Text>
      <FlatList
        data={FAQs}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      <View
        style={{ padding: 10, borderTopWidth: 1, borderTopColor: "#e1e1e1" }}
      >
        <TextInput
          style={[styles.textInput, { fontFamily: "Montserrat", marginBottom: 10}]}
          value={newQuestion}
          onChangeText={setNewQuestion}
          placeholder="New FAQ Question"
          placeholderTextColor={colors.gray}
        />
        <TextInput
          style={[styles.textInput, { fontFamily: "Montserrat" }]}
          value={newAnswer}
          onChangeText={setNewAnswer}
          placeholder="New FAQ Answer"
          placeholderTextColor={colors.gray}
        />
        <Button
          text="Add FAQ"
          onPress={handleAddDocument}
          style={{backgroundColor: colors.purple, marginTop: 11}}
          loading={isUploading}
        />
        {/* <TouchableOpacity
          style={{
            backgroundColor: colors.purple,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            marginTop: 10,
            paddingVertical: 12,
          }}
          onPress={handleAddDocument}
          disabled={isUploading}
        >
          <Text
            style={{
              fontFamily: "Montserrat",
              fontSize: 15,
              color: "white",
            }}
          >
            {isUploading ? "Adding FAQ..." : "Add FAQ"}
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default FAQList;
