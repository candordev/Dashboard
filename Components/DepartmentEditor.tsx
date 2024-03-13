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
    defaultDepartment: boolean;
    isOpen?: boolean; // Optional property to manage dropdown state
    isEditing?: boolean; // New property to manage edit mode
}

interface Leader {
    _id: string;
    firstName: string;
    lastName: string;
}


function DepartmentEditor({
  groupID
}: DepartmentEditorProps): JSX.Element {
  const [departments, setDepartments] =  useState<Department[]>([]);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentDescription, setNewDepartmentDescription] = useState("");
  const [leaders, setLeaders] = useState<{ [key: string]: Leader[] }>({});

  useEffect(() => {
    fetchDepartments();
  }, [groupID]);

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

  const toggleDropdown = (departmentID: string) => {
    const updatedDepartments = departments.map(department => {
      if (department._id === departmentID) {
        return { ...department, isOpen: !department.isOpen };
      }
      return department;
    });
    setDepartments(updatedDepartments);

    // Fetch leaders if the dropdown is being opened
    const department = updatedDepartments.find(d => d._id === departmentID);
    if (department && department.isOpen && !leaders[departmentID]) {
      fetchDepartmentLeaders(departmentID);
    }
  };


  async function fetchDepartmentLeaders(departmentID: string) {
    try {
      setError('');
      const queryParams = new URLSearchParams({ 
        departmentID
    });   
      const url = `${Endpoints.getDepartment}${queryParams.toString()}`
      const response = await customFetch(url, { method: "GET" });
      const data = await response.json();
      if (response.ok) {
        setLeaders(prevLeaders => ({ ...prevLeaders, [departmentID]: data.leaders as Leader[] })); // Cast to Leader[] based on the interface
      } else {
        console.error("Error fetching department leaders: ", data.error);
        setError("Error fetching department leaders");
      }
    } catch (error) {
      console.error("Error fetching department leaders:", error);
      setError("Error fetching department leaders");
    }
  }

  async function addDepartment(name: string, description: string) {
    try {
      setError('');
      if(name.length === 0) {
        return
    }   
      let res = await customFetch(Endpoints.addDepartment, {
        method: "POST",
        body: JSON.stringify({
          groupID,
          name: name,
          description: description
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with adding department:", resJson.error);
        setError("Error with adding department");
      } else {
        fetchDepartments();
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
      setError("Network error while adding department");
    }
  }

  async function changeDepartment(name: string, description: string, departmentID: string) {
    try {
      setError('');
      let res = await customFetch(Endpoints.changeDepartment, {
        method: "POST",
        body: JSON.stringify({
          departmentID,
          name,
          description
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with editing department:", resJson.error);
        setError("Error with editing department");
      } else {
        fetchDepartments();
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
      setError("Network error while editing department");
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

  const startEditing = (departmentID: string) => {
    const updatedDepartments = departments.map(department => 
      department._id === departmentID ? { ...department, isEditing: true } : department
    );
    setDepartments(updatedDepartments);
  };
  
  const handleNameChange = (name: string, departmentID: string) => {
    const updatedDepartments = departments.map(department => 
      department._id === departmentID ? { ...department, name } : department
    );
    setDepartments(updatedDepartments);
  };
  
  const handleDescriptionChange = (description: string, departmentID: string) => {
    const updatedDepartments = departments.map(department => 
      department._id === departmentID ? { ...department, description } : department
    );
    setDepartments(updatedDepartments);
  };
  
  const finishEditing = (departmentID: string, newName: string, newDescription: string) => {
    changeDepartment(newName, newDescription, departmentID); // Assuming this function also sets isEditing to false upon success
  };
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Manage Departments</Text>
        <FlatList<Department>
        data={departments}
        keyExtractor={(item: Department) => item._id}
        renderItem={({ item }: { item: Department }) => (
            <>
            <View style={styles.departmentItem}>
                <Pressable onPress={() => toggleDropdown(item._id)} style={styles.dropdownIcon}>
                <FeatherIcon name={item.isOpen ? "chevron-down" : "chevron-right"} size={20} color={colors.purple} />
                </Pressable>
                {!item.isEditing ? (
                <>
                    <Text style={styles.departmentText}>{item.name}</Text>
                    <TouchableOpacity onPress={() => startEditing(item._id)}>
                    <FeatherIcon name="edit-2" size={15} color={colors.purple} />
                    </TouchableOpacity>
                </>
                ) : (
                <>
                    <TextInput style={styles.input} value={item.name} onChangeText={(text) => handleNameChange(text, item._id)} />
                    <TextInput style={styles.input} value={item.description} onChangeText={(text) => handleDescriptionChange(text, item._id)} />
                    <TouchableOpacity onPress={() => finishEditing(item._id, item.name, item.description)} style={styles.doneButton}>
                        <FeatherIcon name="check" size={15} color={colors.purple} />
                    </TouchableOpacity>
                </>
                )}
                {!item.defaultDepartment && (
                <TouchableOpacity onPress={() => deleteDepartment(item._id)} style={styles.deleteButton}>
                    <FeatherIcon name="trash" size={15} color={colors.red} />
                </TouchableOpacity>
                )}
                {item.defaultDepartment && (
                //<Text style={styles.defaultDepartmentText}>Default Department</Text>
                <FeatherIcon name="trash" size={15} color={colors.red} style={styles.deleteButton} />
                )}
            </View>
            {item.isOpen && leaders[item._id] && (
                <View style={styles.leadersList}>
                {leaders[item._id].map((leader) => (
                    <Text key={leader._id} style={styles.leaderText}>{leader.firstName} {leader.lastName}</Text>
                ))}
                </View>
            )}
            </>
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
            boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
          },
        }),
      },
      scrollContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
      },
      departmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
      },
      departmentText: {
        marginLeft: 10,
        fontFamily: 'Montserrat',
        flex: 1, // Allows text to take up available space, pushing icons to the edge
      },
      defaultDepartmentText: {
        color: colors.purple,
        fontFamily: 'Montserrat',
        flex: 1,
        'font-style': 'italic',
        textAlign: 'right',
      },
      deleteButton: {
        marginLeft: 'auto', // Ensures the button is aligned to the right
        padding: 8,
      },
      dropdownIcon: {
        padding: 8,
      },
      leadersList: {
        paddingLeft: 35, // Indent leader names to differentiate from department names
      },
      leaderText: {
        fontFamily: 'Montserrat',
        marginVertical: 4,
        // Any additional styling for leader text
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
  doneButton: {
    marginLeft: 10
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