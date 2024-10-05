import React, { useEffect, useState } from "react";
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
import SearchBar from "./SearchBar";
import { useUserContext } from "../Hooks/useUserContext";

type MemberManagementProps = {
  documentTitle: string;
  headerTitle: string;
};

type FAQ = {
  question: string;
  answer: string;
  type: string; // this ID will be the id of the document in the database
  _id: string;
};

const ThirdstoneFAQGroup = ({ documentTitle, headerTitle }: MemberManagementProps) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFAQId, setEditingFAQId] = useState<string | null>(null);
  const [newQuestionEdit, setNewQuestionEdit] = useState<string>("");
  const [newAnswerEdit, setNewAnswerEdit] = useState<string>("");
  const [newQuestion, setNewQuestion] = useState<string>(""); // For adding a new chunk
  const [newAnswer, setNewAnswer] = useState<string>(""); // For adding a new chunk
  const [isUploading, setIsUploading] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const { state } = useUserContext();

  const filteredChunks = faqs.filter((chunk) =>
    chunk.question.toLowerCase().includes(searchPhrase.toLowerCase()) ||
    chunk.answer.toLowerCase().includes(searchPhrase.toLowerCase())
  );

  const fetchFAQs = async () => {
    try {
      console.log("FETCHING GROUP", state.currentGroup);
      const queryParams = new URLSearchParams({
        groupId: state.currentGroup,
        faqType: documentTitle,
      });

      const res = await customFetch(
        `${Endpoints.getThirdstoneFAQs}?${queryParams.toString()}`,
        { method: "GET" }
      );

      const resJson = await res.json();
      console.log("FETCHED CHUNKS", resJson);
      if (!res.ok) throw new Error(resJson.error);
      setFaqs(resJson);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchFAQs();
  }, [documentTitle]);

  const handleAddFAQ = async () => {
    setIsUploading(true);

    if (!newQuestion || !newAnswer) {
      console.error("Please provide both a question and an answer.");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("question", newQuestion.trim());
    formData.append("answer", newAnswer.trim());
    formData.append("groupId", state.currentGroup);
    formData.append("type", documentTitle);

    try {
      const response = await customFetch(
        Endpoints.addThirdstoneFAQ,
        {
          method: "POST",
          body: formData,
        },
        0,
        true
      );

      const newFAQ = await response.json();

      if (!response.ok) {
        throw new Error(newFAQ.error);
      } else {
        await fetchFAQs();
        setNewQuestion(""); // Reset input fields
        setNewAnswer(""); // Reset input fields
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFAQ = async (docId: string) => {
    try {
      const bodyData = {
        faqId: docId,
        groupId: state.currentGroup,
      };
      console.log("DELETE CHUNK DATA", bodyData);
      const response = await customFetch(`${Endpoints.deleteThirdstoneFAQ}`, {
        method: "DELETE",
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error("Failed to delete the document");
      }
      setFaqs((docs) => docs.filter((d) => d._id !== docId));
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  const handleEditFAQ = async (faqId: string) => {
    try {
      const bodyData = {
        groupId: state.currentGroup,
        question: newQuestionEdit,
        answer: newAnswerEdit,
        faqId,
      };

      const response = await customFetch(`${Endpoints.editThirdstoneFAQ}`, {
        method: "POST",
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error("Failed to update the document");
      }

      setEditingFAQId(null);
      fetchFAQs();
    } catch (error) {
      console.error("Failed to edit document:", error);
    }
  };

  const startEditing = (item: FAQ) => {
    setEditingFAQId(item._id);
    setNewQuestionEdit(item.question);
    setNewAnswerEdit(item.answer);
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
            <View style={{ flex: 1 }}>
              <TextInput
                style={[styles.textInput, { fontFamily: "Montserrat" }]}
                value={newQuestionEdit}
                onChangeText={setNewQuestionEdit}
                placeholder="Edit question"
              />
              <TextInput
                style={[styles.textInput, { fontFamily: "Montserrat", marginTop: 10 }]}
                value={newAnswerEdit}
                onChangeText={setNewAnswerEdit}
                placeholder="Edit answer"
                multiline
              />
              <Button
                text="Done"
                style={{ backgroundColor: colors.purple, marginTop: 10 }}
                onPress={() => handleEditFAQ(item._id)}
              />
            </View>
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
            <Text style={{ fontFamily: "Montserrat", fontSize: 16 }}>
              Q: {item.question}
            </Text>
            <Text style={{ fontFamily: "Montserrat", fontSize: 14, color: colors.gray }}>
              A: {item.answer}
            </Text>
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
          marginTop: 10,
        }}
        searchBarStyle={{ backgroundColor: colors.lightestgray }}
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
          style={[styles.textInput, { fontFamily: "Montserrat", marginBottom: 10 }]}
          value={newQuestion}
          onChangeText={setNewQuestion}
          placeholder="Enter new question"
          placeholderTextColor={colors.gray}
        />
        <TextInput
          style={[styles.textInput, { fontFamily: "Montserrat", marginBottom: 10 }]}
          value={newAnswer}
          onChangeText={setNewAnswer}
          placeholder="Enter new answer"
          placeholderTextColor={colors.gray}
          multiline
        />
        <Button
          text="Add Chunk"
          onPress={handleAddFAQ}
          style={{ backgroundColor: colors.purple }}
          loading={isUploading}
        />
      </View>
    </View>
  );
};

export default ThirdstoneFAQGroup;
