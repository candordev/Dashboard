import React, { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, Pressable, StyleSheet, TextInput, View, Platform, TouchableOpacity, Text, ScrollView, FlatList } from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import FeatherIcon from "react-native-vector-icons/Feather";
import { set } from "lodash";

type DepartmentEditorProps = {
  groupID: string;
};

interface Department {
    _id: string;
    name: string;
    description: string;
  }


function DepartmentEditor({
  groupID
}: DepartmentEditorProps): JSX.Element {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentDescription, setNewDepartmentDescription] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  async function fetchDepartments() {
    try {
      setError('');
      const queryParams = new URLSearchParams({ 
        groupID,
        description: "true"
    });   
      const url = `${Endpoints.getDepartments}${queryParams.toString()}`
      console.log("URL", url);
      const response = await customFetch(url, { method: "GET" });
      const data = await response.json();
      console.log("DATA", data);
      console.log("get tags response", response);
      if (response.ok) {
        setDepartments(data);
      } else {
        console.error("Error fetching departments: ", data.error);
        setError("Error fetching departments");
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Error fetching departments");
    }
  }

  async function addDepartment(name: string, description: string) {
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
        fetchDepartments();
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
      setError("Network error while setting tags");
    }
  }

  async function deleteDepartment(departmentId: string) {
    try {
      setError('');
      let res = await customFetch(Endpoints.deleteDepartment, {
        method: "DELETE",
        body: JSON.stringify({
          departmentId
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with removing department:", resJson.error);
        setError("Error with removing department:");
      } else {
        fetchDepartments();
      }
    } catch (error) {
      console.error("Network error while removing tag:", error);
      setError("Network error while removing tag");
    }
  }

  const handleAddTagPress = () => {
    if (isAdding) {
      addDepartment(newDepartmentName.trim(), newDepartmentDescription.trim()).then(() => {
        setNewDepartmentName(""); // Reset input field after adding
        setIsAdding(false); // Change state to hide input field
      });
    } else {
      setIsAdding(true); // Show input field
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Manage Departments</Text>
        <FlatList<Department>
            data={departments}
            keyExtractor={(item: Department) => item._id}
            renderItem={({ item }: { item: Department }) => (
                <View style={styles.tagItem}>
                    <FeatherIcon name="briefcase" size={15} color={colors.purple} />
                    <Text style={styles.tagText}>{item.name}</Text>
                    <TouchableOpacity onPress={() => deleteDepartment(item.name)} style={styles.deleteButton}>
                        <FeatherIcon name="x" size={15} color={colors.red} />
                    </TouchableOpacity>
                </View>
            )}
        />
        {isAdding && (
            <>
                <TextInput
                style={styles.input}
                onChangeText={setNewDepartmentName}
                value={newDepartmentName}
                placeholder="Enter new department name"
                autoFocus
                />
                <TextInput
                style={styles.input}
                onChangeText={setNewDepartmentDescription}
                value={newDepartmentDescription}
                placeholder="Enter new department description. Be as detailed as possible"
                autoFocus
                />
            </>
        )}
        <TouchableOpacity onPress={handleAddTagPress} style={styles.button}>
          <Text style={styles.buttonText}>{isAdding ? "Done" : "Add Department"}</Text>
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
    marginBottom: 10,
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
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  deleteButton: {
    marginLeft: 'auto', // This pushes the delete button to the right
    padding: 8, // Adjust padding as needed
  },
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
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  tagText: {
    marginLeft: 10,
    fontFamily: "Montserrat",
  },
  // other styles remain unchanged
});

export default DepartmentEditor;