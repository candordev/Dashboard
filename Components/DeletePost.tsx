import React, { useDebugValue, useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";

interface DeletePostProps {
    issueId: string;
    onPopoverCloseComplete: () => void;
}

const DeletePost: React.FC<DeletePostProps> = ({ issueId, onPopoverCloseComplete }) => {

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false); // New state for loading status

    const deletePost = async () => {
        try {
        setIsLoading(true);
          let res: Response = await customFetch(Endpoints.deletePost, {
            method: "DELETE",
            body: JSON.stringify({
              postID: issueId,
            }),
          });

          let resJson = await res.json();
          if (!res.ok) {
            console.error(resJson.error);
            setErrorMessage("Failed to delete the post: " + resJson.error);
          } else {
            // console.log("Successfully deleted");
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error deleting post. Please try again", error);
        } finally {
            onPopoverCloseComplete();
        }
      }


    return (
        <View style={{marginTop: 5}}>
          
          {errorMessage !== "" && (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => deletePost()}
              disabled={isLoading} // Disable button when loading
            >
              <Text style={styles.toggleButtonText}>Delete Post</Text>
            </TouchableOpacity>

        </View>
      );
    };

const styles = StyleSheet.create({
    input: {
        borderBottomColor: colors.lightgray,
        borderBottomWidth: 1,
        padding: 10,
        color: 'black'

    },
    toggleButton: {
        backgroundColor: colors.red,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    toggleButtonText: {
        fontFamily: "Montserrat",
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
    errorMessage: {
        color: 'red',
        fontSize: 14,
        textAlign: 'left',
        marginTop: 10,
        fontFamily: "Montserrat",
      },
});

export default DeletePost;
