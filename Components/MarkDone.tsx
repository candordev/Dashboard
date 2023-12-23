import React, { useState } from "react";
import { TextInput, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";

interface MarkDoneProps {
    issueId: string;
    fetchStatusUpdates: () => void; // Add this line
    // ... other props if any
}

const MarkDone: React.FC<MarkDoneProps> = ({ issueId, fetchStatusUpdates }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [expanded, setExpanded] = useState(false);

    const handlePress = async () => {

        if (expanded) {
            try{
            let res = await customFetch(Endpoints.createStatusUpdate, {
                method: "POST",
                body: JSON.stringify({
                  postID: issueId, 
                  title: title, // Assuming issueId is available in this component
                  content: content,
                  completed: true
                }),
              });
      
              if (!res.ok) {
                const resJson = await res.json();
                console.error("UPDATE POST no succesfully made:", resJson.error);
               
              } else {
                console.log("UPDATE POST successfully made");
                fetchStatusUpdates(); // Call the fetchStatusUpdates function here
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

    return (
        <View style={expanded ? {borderColor: 'gray', borderWidth: 1, borderRadius: 8} : {}}>
            {expanded && (
                <View style={{ padding: 20, marginBottom: -50 }}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Title"
                        onChangeText={text => setTitle(text)}
                        value={title}
                        placeholderTextColor={'gray'}
                    />
                    <TextInput
                        style={[styles.input, { height: 100 }]}
                        placeholder="Enter Content (Optional)"
                        onChangeText={text => setContent(text)}
                        value={content}
                        multiline
                        placeholderTextColor={'gray'}
                    />
                </View>
            )}
            <TouchableOpacity
                style={styles.toggleButton}
                onPress={handlePress}
            >
                <Text style={styles.toggleButtonText}>{expanded ? 'Done' : 'Mark Completed'}</Text>
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
        fontSize: 18,
        fontWeight: '600',
    },
});

export default MarkDone;
