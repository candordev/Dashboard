import React, { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, Pressable, StyleSheet, TextInput, View, Platform, TouchableOpacity, Text, ScrollView } from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import { set } from "lodash";

type PrioritySetterProps = {
  groupID: string;
};

function PrioritySetter({
  groupID
}: PrioritySetterProps): JSX.Element {
  const [deadlineOne, setDeadlineOne] = useState('');
  const [deadlineTwo, setDeadlineTwo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDeadlines();
  }, [groupID]);

  async function fetchDeadlines() {
    try {
      setError('');
      const queryParams = new URLSearchParams({ groupID });
      const url = `${Endpoints.getGroupDeadlines}${queryParams.toString()}`
      console.log("URL", url);
      const response = await customFetch(url, { method: "GET" });
      const data = await response.json();
      console.log("DATA", data);
      console.log("fetchDeadlines response", response);
      if (response.ok) {
        setDeadlineOne(data[0].toString());
        setDeadlineTwo(data[1].toString());
      } else {
        console.error("Error fetching deadlines: ", data.error);
      }
    } catch (error) {
      console.error("Network error while fetching deadlines: ", error);
    }
  }

  async function setDeadlines() {
    setError('');
    const deadline1 = parseInt(deadlineOne, 10);
    const deadline2 = parseInt(deadlineTwo, 10);
    if (isNaN(deadline1) || isNaN(deadline2) || deadline1 < 0 || deadline2 < 0) {
      setError('Please enter valid positive numbers for deadlines.');
      return;
    }

    try {
      let res = await customFetch(Endpoints.setGroupDeadlines, {
        method: "POST",
        body: JSON.stringify({
          groupID,
          deadlines: [deadline1, deadline2]
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with setting deadlines:", resJson.error);
      } else {
        fetchDeadlines();
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text
            style={{
                alignSelf: "flex-start",
                fontWeight: "600",
                fontSize: 27,
                fontFamily: "Montserrat",
                margin: 10
            }}
            >
            Set Deadlines
        </Text>
        <Text style={styles.explanation}>
          Issues with a deadline less than the High Priority Deadline (in days) away are marked as high priority. 
          If the deadline is less than the Medium Priority Deadline (in days) away, it's marked as medium priority. 
          Deadlines beyond these are considered low priority.
        </Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>High Priority Deadline:</Text>
          <TextInput
            style={styles.input}
            value={deadlineOne}
            onChangeText={setDeadlineOne}
            placeholder="Enter number of days"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Medium Priority Deadline:</Text>
          <TextInput
            style={styles.input}
            value={deadlineTwo}
            onChangeText={setDeadlineTwo}
            placeholder="Enter number of days"
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity onPress={setDeadlines} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        {error !== '' && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
    </View>
  );
}

export default PrioritySetter;

// Updated styles
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
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
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