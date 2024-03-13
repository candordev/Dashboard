import React, { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, Pressable, StyleSheet, TextInput, View, Platform, TouchableOpacity, Text, ScrollView, FlatList } from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import FeatherIcon from "react-native-vector-icons/Feather";

type TagEditorProps = {
  groupID: string;
};

interface Tag {
    _id: string;
    name: string;
  }

function TagEditor({
  groupID
}: TagEditorProps): JSX.Element {
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editedTagName, setEditedTagName] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    try {
      setError('');
      const queryParams = new URLSearchParams({ groupID });
      const url = `${Endpoints.getGroupCategories}${queryParams.toString()}`
      console.log("URL", url);
      const response = await customFetch(url, { method: "GET" });
      const data = await response.json();
      console.log("DATA", data);
      console.log("get tags response", response);
      if (response.ok) {
        setTags(data);
      } else {
        console.error("Error fetching tags: ", data.error);
        setError("Error fetching tags");
      }
    } catch (error) {
      console.error("Network error while fetching tags: ", error);
      setError("Network error while fetching tags");
    }
  }

  async function addTag(name: string) {
    try {
      setError('');
      if(name.length === 0) {
        return
    }   
      let res = await customFetch(Endpoints.addGroupCategory, {
        method: "POST",
        body: JSON.stringify({
          groupID,
          categoryName: name
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with setting tags:", resJson.error);
        setError("Error with setting tags");
      } else {
        fetchTags();
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
      setError("Network error while setting tags");
    }
  }

  const handleEditTagPress = (tag: Tag) => {
    setEditingTagId(tag._id); // Set the tag being edited
    setEditedTagName(tag.name); // Pre-fill with current tag name
  };

  const handleDoneEditingPress = async () => {
    if (editingTagId) {
      const tagToEdit = tags.find(tag => tag._id === editingTagId);
      if (tagToEdit && editedTagName.trim() !== tagToEdit.name.trim()) {
        await changeTag(tagToEdit.name, editedTagName.trim());
      }
      setEditingTagId(null); // Reset editing state
      setEditedTagName(""); // Clear the input field
    }
  };

  async function changeTag(oldName: string, newName: string) {
    try {
      setError('');
      if(oldName.length === 0 || newName.length === 0) {
        return
    }   
      let res = await customFetch(Endpoints.changeCategory, {
        method: "POST",
        body: JSON.stringify({
          groupID,
          categoryName: oldName,
          newCategoryName: newName
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with changing tags:", resJson.error);
        setError("Error with changing tags");
      } else {
        fetchTags();
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
      setError("Network error while changing tags");
    }
  }

  async function deleteTag(name: string) {
    try {
      setError('');
      if(name.length === 0) {
        return
      }   
      console.log(Endpoints.deleteCategory)
      console.log("groupID", groupID)
        console.log("name", name)
      let res = await customFetch(Endpoints.deleteCategory, {
        method: "DELETE",
        body: JSON.stringify({
          groupID: groupID,
          categoryName: name
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with removing tag:", resJson.error);
        setError("Error with removing tag");
      } else {
        fetchTags();
      }
    } catch (error) {
      console.error("Network error while removing tag:", error);
      setError("Network error while removing tag");
    }
  }

  const handleAddTagPress = () => {
    if (isAdding) {
      addTag(newTagName.trim()).then(() => {
        setNewTagName(""); // Reset input field after adding
        setIsAdding(false); // Change state to hide input field
      });
    } else {
      setIsAdding(true); // Show input field
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Manage Tags</Text>
        <FlatList
          data={tags}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.tagItem}>
              <FeatherIcon name="tag" size={15} color={colors.purple} />
              {editingTagId === item._id ? (
                <TextInput
                  style={styles.input}
                  onChangeText={setEditedTagName}
                  value={editedTagName}
                  autoFocus
                  onBlur={handleDoneEditingPress}
                />
              ) : (
                <>
                  <Text style={styles.tagText}>{item.name}</Text>
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity onPress={() => handleEditTagPress(item)} style={styles.editButton}>
                      <FeatherIcon name="edit-2" size={15} color={colors.purple} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTag(item.name)} style={styles.deleteButton}>
                      <FeatherIcon name="trash" size={15} color={colors.red} />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )}
        />
        {isAdding && (
          <TextInput
            style={styles.input}
            onChangeText={setNewTagName}
            value={newTagName}
            placeholder="Enter new tag name"
            autoFocus
          />
        )}
        <TouchableOpacity onPress={handleAddTagPress} style={styles.button}>
          <Text style={styles.buttonText}>{isAdding ? "Done" : "Add Tag"}</Text>
        </TouchableOpacity>
        {error !== "" && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 30,
    ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 5,
        },
        web: {
          // Example values for boxShadow
          boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)', // offsetX offsetY blurRadius color
        }
      }),
  },
  buttonGroup: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  tagText: {
    marginLeft: 10,
    flex: 1, // Ensures text takes up available space pushing buttons to the end
    fontFamily: "Montserrat",
  },
//   editButton: {
//     marginLeft: 10, // Ensure some space between edit and delete buttons
//     padding: 8,
//   },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
//   deleteButton: {
//     marginLeft: 'auto', // This pushes the delete button to the right
//     padding: 8, // Adjust padding as needed
//   },
  title: {
    alignSelf: "flex-start",
    fontWeight: "600",
    fontSize: 27,
    fontFamily: "Montserrat",
    margin: 10,
  },
  input: {
    fontFamily: "Montserrat",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginVertical: 8,
  },
  button: {
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 10,
    paddingVertical: 12,
  },
  buttonText: {
    fontFamily: "Montserrat",
    fontSize: 15,
    color: "white",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    fontFamily: "Montserrat",
  },
//   tagItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 4,
//   },
//   tagText: {
//     marginLeft: 10,
//     fontFamily: "Montserrat",
//   },
  // other styles remain unchanged
});

export default TagEditor;