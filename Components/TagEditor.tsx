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

function TagEditor({
  groupID
}: TagEditorProps): JSX.Element {
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');

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
      let res = await customFetch(Endpoints.addCategory, {
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Manage Tags</Text>
        {/* FlatList to display tags */}
        <FlatList
            data={tags}
            keyExtractor={(item: { _id: string }) => item._id}
            renderItem={({ item }: { item: { _id: string, name: string } }) => (
                <View style={styles.tagItem}>
                    <FeatherIcon name="tag" size={15} color={colors.purple} />
                    <Text style={styles.tagText}>{item.name}</Text>
                </View>
            )}
        />
        <TouchableOpacity onPress={fetchTags} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        {error !== '' && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
    </View>
  );
}

export default TagEditor;

// Updated styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 10,
        marginBottom: 20,
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 10,
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
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tagText: {
    marginHorizontal: 10, // Add some space between the text and the icon
    fontFamily: 'Montserrat',
  },
  title: {
    alignSelf: "flex-start",
    fontWeight: "600",
    fontSize: 27,
    fontFamily: "Montserrat",
  },
  explanation: {
    fontFamily: 'Montserrat',
    marginVertical: 5,
  },
  inputGroup: {
    marginVertical: 4,
  },
  inputLabel: {
    fontFamily: 'Montserrat',
    marginBottom: 4,
  },
  input: {
    fontFamily: 'Montserrat',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    width: '100%', // ensures input takes the full width
  },
  button: {
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
    paddingVertical: 12,
    width: '100%',
  },
  buttonText: {
    fontFamily: 'Montserrat',
    fontSize: 15,
    color: 'white',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Montserrat',
  },
});