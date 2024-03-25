// MemberManagement.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Platform, ActivityIndicator } from 'react-native';
import colors from "../Styles/colors"; // Ensure this path matches your project structure
import Text from "../Components/Text";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { customFetch } from '../utils/utils';
import { Endpoints } from '../utils/Endpoints';

const SubmitFeedback = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleDone = async () => {
      try {
        setLoading(true);
        let formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('groupID', '647db15ba310f4efc2a667d1');
  
        const res = await customFetch(Endpoints.createDashboardProposal, {
          method: 'POST',
          body: formData,
        });
  
        if (!res.ok) {
          const resJson = await res.json();
          console.log("Error", resJson.error);
          setErrorMessage(resJson.error);
        } else {
          const resJson = await res.json();
          console.log("Success", "Feedback submitted successfully");
          setTitle('');
          setContent('');
          setErrorMessage("");
        }
      } catch (error) {
        console.error("Network error, please try again later.", error);
        setErrorMessage(String(error));
        console.log("Error", "Network error, please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
        <View style={styles.outerBox}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.purple} />
          ) : (  
            <>
              <Text style={{marginBottom: 8, fontSize: 25,fontWeight: 500, fontFamily: 'Montserrat'}}>What's the issue?</Text>
              <View style={styles.inputContainer}> 
                <TextInput 
                  style={styles.input} 
                  onChangeText={setTitle} 
                  value={title}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={{marginBottom: 8, fontSize: 25,fontWeight: 500, fontFamily: 'Montserrat'}}>Description</Text>
                <TextInput 
                  style={[styles.input, styles.descriptionInput]} 
                  multiline 
                  numberOfLines={20} 
                  onChangeText={setContent} 
                  value={content}
                />
              </View>
              <TouchableOpacity style={styles.submitButton} onPress={handleDone}>
                <Text style={styles.submitButtonText}>Submit Feedback</Text>
              </TouchableOpacity>
              {errorMessage ? <Text style={{colors: colors.red}}>{errorMessage}</Text> : null}
            </>
          )}
        </View>
      );
  };

const styles = StyleSheet.create({
    submitButton: {
        backgroundColor: colors.purple, // Here's the color adjustment for the button
        padding: 10,
        borderRadius: 20,
        marginRight: 100,
        marginLeft: 100,
        marginHorizonatal: 100,
        alignItems: 'center',
        //justifyContent: 'center',
        marginTop: 60,
        marginBottom: 30
      },
      submitButtonText: {
        color: 'white', // And making the text color white
        fontFamily: 'Montserrat', // Ensure you have this font installed
        fontSize: 20,
        fontWeight: '500'
      },
  outerBox: {
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)', // offsetX offsetY blurRadius color
    margin: 20,
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.lightergray
  },
  inputContainer: {
    marginBottom: 60,
  },
  label: {
    fontFamily: 'Montserrat', // Make sure you have this font installed
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  input: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    width: '100%',
  },
  descriptionInput: {
    //minHeight: 100, // Adjust based on your preference
  },
  buttonContainer: {
    marginTop: 10,
    color: colors.purple
  },
});

export default SubmitFeedback;
