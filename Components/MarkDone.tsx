import React, { useDebugValue, useEffect, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";

interface MarkDoneProps {
  issueId: string;
  fetchStatusUpdates: () => void; // Add this line
  step: number;
  // ... other props if any
}

const MarkDone: React.FC<MarkDoneProps> = ({
  issueId,
  fetchStatusUpdates,
  step,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [stepNumber, setStepNumber] = useState<number>(step);
  const [isLoading, setIsLoading] = useState(false); // New state for loading status

  const handlePress = async (uncomplete: boolean) => {
    setIsLoading(true); // Start loading
    try {
      let res = await customFetch(Endpoints.markDone, {
        method: "POST",
        body: JSON.stringify({
          postID: issueId,
          completed: !uncomplete,
          uncomplete: uncomplete,
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("UPDATE POST no succesfully made:", resJson.error);
        setErrorMessage("Failed to update the post: " + resJson.error);
      } else {
        if (uncomplete === true) {
          // console.log("STEP SET TO 2", uncomplete);
          setStepNumber(2);
        } else {
          // console.log("STEP SET TO 3");
          setStepNumber(3);
        }
        setErrorMessage("");
        // console.log("UPDATE POST successfully made");
        fetchStatusUpdates(); // Call the fetchStatusUpdates function here

        //event.emit(eventNames.ISSUE_CATEGORY_SET);
        // You can handle any additional state updates or notifications here
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <View>
      {errorMessage !== "" && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}
      {stepNumber === 3 ? (
        <TouchableOpacity
          style={styles.completedButton}
          onPress={() => handlePress(true)}
          disabled={isLoading} // Disable button when loading
        >
          <Text style={styles.completedButtonText}>Completed</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => handlePress(false)}
          disabled={isLoading} // Disable button when loading
        >
          <Text style={styles.toggleButtonText}>Mark Complete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomColor: colors.lightgray,
    borderBottomWidth: 1,
    padding: 10,
    color: "black",
    outlineStyle: "none",
  },
  toggleButton: {
    backgroundColor: colors.black,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  toggleButtonText: {
    fontFamily: "Montserrat",
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  errorMessage: {
    color: "red",
    fontSize: 14,
    textAlign: "left",
    marginTop: 10,
    fontFamily: "Montserrat",
  },
  completedButton: {
    backgroundColor: colors.darkGray, // Adjust the color as needed
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  completedButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
});

export default MarkDone;
