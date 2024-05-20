import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints"; 
import colors from "../Styles/colors";
import Button from "./Button";
import { set } from "lodash";
import styles from "../Styles/styles";

type GroupActivityResetTimeProps = {
  groupID: string;
};

const GroupActivityResetTime = ({ groupID }: GroupActivityResetTimeProps) => {
  
  const [duration, setDuration] = useState<string>("4");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchDuration = async () => {
    try {
        console.log("groupID", groupID);
      const endpoint = `${Endpoints.getActivityStatus}groupID=${groupID}`; 
      console.log("endpoint", endpoint);
      const res = await customFetch(endpoint, { method: "GET" });
      const resJson = await res.json();
      console.log("resJson", resJson);
      if (!res.ok) throw new Error(resJson.error);
      console.log(resJson);

      setDuration(resJson.duration);
    } catch (error) {
        console.error("Error fetching duration: ", error);
        setError("Error fetching duration. Please try again later.");
    }
  };

  const handleEditDuration = async () => {
    try {
        setIsUploading(true);
        let res = await customFetch(Endpoints.editActivityResetDuration, {
            method: "POST",
            body: JSON.stringify({
              groupID,
              duration: duration,
            }),
          });
        if (!res.ok) {
            const resJson = await res.json();
            console.error("Error updating reset time: ", resJson.error);
        }
    } catch (error) {
        console.error("Error updating reset time: ", error);
        setError("Error updating reset time. Please try again later.");
    } finally {
        setIsUploading(false);
    }
}

  useEffect(() => {
    setError('');
    fetchDuration();
  }, []);

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
            Edit Group Activity Reset Time
        </Text>
        <Text style={additionalStyles.explanation}>
          This is how many hours after the last activity that the group's activity indicator on the group insights page will be reset.
        </Text>
        <View style={additionalStyles.inputGroup}>
          <TextInput
            style={additionalStyles.input}
            value={duration}
            onChangeText={setDuration   }
            placeholder="Enter number of hours"
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity onPress={handleEditDuration} style={additionalStyles.button}>
          <Text style={additionalStyles.buttonText}>Submit</Text>
        </TouchableOpacity>
        {error !== '' && <Text style={additionalStyles.error}>{error}</Text>}
    </View>
  );
}

// Updated styles
const additionalStyles = StyleSheet.create({
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
    outlineStyle: "none",
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

export default GroupActivityResetTime;
