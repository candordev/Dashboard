import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import { customFetch } from "../utils/utils"; // Update the import path as needed
import { Endpoints } from "../utils/Endpoints"; // Update the import path as needed
import colors from "../Styles/colors";
import FeatherIcon from "react-native-vector-icons/Feather";
import styles from "../Styles/styles";

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
  const [editingFAQId, setEditingFAQId] = useState<string | null>(
    null
  );
  const [questionEdit, setQuestionEdit] = useState<string>("");
  const [answerEdit, setAnswerEdit] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const fetchFAQs= async () => {
      try {
        const endpoint = `${Endpoints.getFAQs}groupID=${groupID}`; // FIX THIS
        const res = await customFetch(endpoint, { method: "GET" });
        const resJson = await res.json();

        if (!res.ok) throw new Error(resJson.error);
        console.log(resJson);

        setFAQs(resJson);
      } catch (error) {
      }
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
         console.log("emailed akshatpant@ufl.edu the csv")
      }

      // Assuming the response includes the newly added document
      const addedFAQ = await response.json();
      console.log("added FAQ", addedFAQ)
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
        FAQid: faqId,
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
        FAQid: FAQ._id,
        groupID: groupID,
        question: questionEdit,
        answer: answerEdit,
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

  const renderItem = ({ item }: { item: FAQ}) => {
    const isEditing = editingFAQId === item._id;

    return (
      <View style={additionalStyles.itemContainer}>
        {isEditing ? (
          <>
            <TextInput
              style={additionalStyles.input}
              value={questionEdit}
              onChangeText={(text) => setQuestionEdit(text)}
            />
            <TextInput
              style={additionalStyles.input}
              value={answerEdit}
              onChangeText={(text) => setAnswerEdit(text)}
            />
            <Button
              title="Done"
              color={colors.purple}
              onPress={() => handleEditDocument(item)}
            />
          </>
        ) : (
          <View style={additionalStyles.infoContainer}>
            <TouchableOpacity onPress={() => {}}>
              <Text style={additionalStyles.documentTitle}>{item.question}</Text>
              <Text style={additionalStyles.documentDescription}>{item.answer}</Text>
            </TouchableOpacity>
          </View>
        )}
        {!isEditing && (
          <View style={additionalStyles.actionContainer}>
            <TouchableOpacity onPress={() => startEditing(item)}>
              <Text style={additionalStyles.editText}>Edit</Text>
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
        Manage Residential FAQ
      </Text>
      <FlatList
        data={FAQs}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      <View style={additionalStyles.addDocumentContainer}>
        <TextInput
          style={additionalStyles.input}
          value={newQuestion}
          onChangeText={setNewQuestion}
          placeholder="New FAQ Question"
        />
        <TextInput
          style={additionalStyles.input}
          value={newAnswer}
          onChangeText={setNewAnswer}
          placeholder="New FAQ Answer"
        />
        <TouchableOpacity
          style={additionalStyles.addButton}
          onPress={handleAddDocument}
          disabled={isUploading}
        >
          <Text style={additionalStyles.addButtonLabel}>
            {isUploading ? "Adding FAQ..." : "Add FAQ"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const additionalStyles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: 10, // Space after the document icon
  },
  container: {
    flex: 1,
    margin: 10,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        // Example values for boxShadow
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)", // offsetX offsetY blurRadius color
      },
    }),
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  selectedFileName: {
    fontFamily: "Montserrat",
    fontSize: 15,
    marginLeft: 8,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingLeft: 10, // Consistent spacing from the info
  },
  documentIcon: {
    marginRight: 10, // Ensure some space between the icon and the text
  },
  title: {
    alignSelf: "flex-start",
    fontWeight: "600",
    fontSize: 27,
    fontFamily: "Montserrat",
    margin: 5,
  },
  addButton: {
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 10,
    paddingVertical: 12,
  },
  addButtonLabel: {
    fontFamily: "Montserrat",
    fontSize: 15,
    color: "white",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#e1e1e1",
  },
  uploadButtonContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    alignItems: "center",
  },
  uploadButton: {
    flexDirection: "row",
  },
  uploadButtonText: {
    fontFamily: "Montserrat",
    fontSize: 15,
    marginRight: 2,
  },
  documentTitle: {
    fontFamily: "Montserrat",
    fontSize: 16,
  },
  documentDescription: {
    fontFamily: "Montserrat",
    fontSize: 14,
    color: "#666",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    fontFamily: "Montserrat",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginVertical: 4,
    outlineStyle: "none",
  },
  buttonText: {
    fontFamily: "Montserrat",
    color: colors.white,
  },
  editModal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "50%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    elevation: 5,
  },
  editText: {
    color: colors.purple,
    fontFamily: "Montserrat",
    marginRight: 10, // Adjust this value as needed to space items
  },
  addDocumentContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },
});

export default FAQList;
