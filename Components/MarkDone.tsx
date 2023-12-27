import React, { useDebugValue, useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";

interface MarkDoneProps {
    issueId: string;
    fetchStatusUpdates: () => void; // Add this line
    step: number;
    // ... other props if any
}

const MarkDone: React.FC<MarkDoneProps> = ({ issueId, fetchStatusUpdates, step}) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [expanded, setExpanded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [stepNumber, setStepNumber] = useState<number>(step);
    // const [uncomplete, setUncomplete] = useState(false);



    // useEffect(() => {
    //     setStepNumber(step)
    //   }, []);

    const handlePress = async (uncomplete: boolean) => {

        if (expanded) {
            try{
            let res = await customFetch(Endpoints.createStatusUpdate, {
                method: "POST",
                body: JSON.stringify({
                  postID: issueId, 
                  title: title, // Assuming issueId is available in this component
                  content: content,
                  completed: !uncomplete,
                  uncomplete: uncomplete,
                }),
              });
      
              if (!res.ok) {
                const resJson = await res.json();
                console.error("UPDATE POST no succesfully made:", resJson.error);
                setErrorMessage("Failed to update the post: " + resJson.error);
               
              } else {


                if(uncomplete === true){
                    console.log("STEP SET TO 2", uncomplete)
                    setStepNumber(2)
                }else{
                    console.log("STEP SET TO 3")
                    setStepNumber(3)
                }
                setErrorMessage('')
                console.log("UPDATE POST successfully made");
                fetchStatusUpdates(); // Call the fetchStatusUpdates function here
                setContent('')
                setTitle('')
                //event.emit(eventNames.ISSUE_CATEGORY_SET);
                // You can handle any additional state updates or notifications here
              }
            } catch (error) {
              console.error("Network error, please try again later.", error);
            }      

            // Handle the completion logic here
            console.log("Title:", title, "Content:", content);
        }
        setExpanded(!expanded); // Toggle the expanded state
    };

    const handleCompletedPress = () => {
        // Implement the functionality for when step is at 3 and button is pressed
        console.log("Completed button pressed");
    };

    return (
        <View style={expanded ? {borderColor: 'gray', borderWidth: 1, borderRadius: 8, backgroundColor: "white"} : {}}>
        {errorMessage !== "" && (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        {expanded && (
                <View style={{ padding: 20, marginBottom: -50 }}>
                    <TextInput
                        style={styles.input}
                        placeholder={"Enter Title"}
                        onChangeText={text => setTitle(text)}
                        value={title}
                        placeholderTextColor={'gray'}
                    />
                    <TextInput
                        style={[styles.input, { height: 100 }]}
                        placeholder={stepNumber === 3 ? ("Explain why you decided to uncomplete this post") : ("Enter Update Post Content")}
                        onChangeText={text => setContent(text)}
                        value={content}
                        multiline
                        placeholderTextColor={'gray'}
                    />
                </View>
            )}
          {stepNumber === 3 ? (
                <TouchableOpacity
                    style={styles.completedButton}
                    onPress={() => handlePress(true)}
                >
                    <Text style={styles.completedButtonText}>{expanded ? 'Done' : 'Completed'}</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => handlePress(false)}
                >
                    <Text style={styles.toggleButtonText}>{expanded ? 'Done' : 'Mark Completed'}</Text>
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

export default MarkDone;
