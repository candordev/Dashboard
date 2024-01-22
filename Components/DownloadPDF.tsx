import React, { useDebugValue, useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";

interface DownloadPDFProps {
    groupID: string;
}

// for use later when we move this to settings
const DownloadPDF: React.FC<DownloadPDFProps> = ({ groupID }) => {

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false); // New state for loading status

    const downloadPDF = async () => {
        try {
            if (!groupID) {
                return
            }
            setIsLoading(true); 
            console.log("PDF GROUP", groupID)
            const queryParams = new URLSearchParams({
                groupID: groupID
            });

            const res = await customFetch(
                `${Endpoints.requestPDFInfo}${queryParams.toString()}`,
                {
                method: "GET",
                }
            );
        
            
            if (!res.ok) {
                let resJson = await res.json();
                console.error("DOWNLOAD PDF ERROR", resJson.error);
                setErrorMessage("Failed to download pdf: " + resJson.error);
            } else {
                const blob = await res.blob();

                // Create a URL for the blob
                const pdfUrl = URL.createObjectURL(blob);

                // Create a temporary link element
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = 'group_posts.pdf'; // Set the default file name for download

                // Append the link to the document and trigger the download
                document.body.appendChild(link);
                link.click();

                // Clean up: remove the link and revoke the URL
                document.body.removeChild(link);
                URL.revokeObjectURL(pdfUrl);

                console.log("PDF downloaded successfully");
            }
            setIsLoading(false);
        } catch (error) {
          console.error("Error downloading pdf", error);
        } 
      }


    return (
        <View>
          {errorMessage !== "" && (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}
          
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => downloadPDF()}
              disabled={isLoading} // Disable button when loading
            >
              <Text style={styles.toggleButtonText}>Download Info</Text>
            </TouchableOpacity>
          
        </View>
      );
    };

const styles = StyleSheet.create({
    input: {
        borderBottomColor: colors.lightgray,
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 10,
        color: 'black'

    },
    toggleButton: {
        backgroundColor: colors.black,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    toggleButtonText: {
        fontFamily: "Montserrat",
        color: colors.white,
        fontSize: 15,
        fontWeight: '600',
        paddingHorizontal: 10,
    },
    errorMessage: {
        color: 'red',
        fontSize: 14,
        textAlign: 'left',
        marginTop: 10,
        fontFamily: "Montserrat",
      },
      completedButton: {
        backgroundColor: colors.green, // Adjust the color as needed
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    completedButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: "Montserrat",
    },

});

export default DownloadPDF;
