// MemberManagement.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Platform, ActivityIndicator, Dimensions } from 'react-native';
import colors from "../Styles/colors"; // Ensure this path matches your project structure
import Text from "../Components/Text";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { customFetch } from '../utils/utils';
import { Endpoints } from '../utils/Endpoints';
import styles from '../Styles/styles';
import Button from './Button';

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
        formData.append('visible', true.toString());

        

  
        const res = await customFetch(Endpoints.createDashboardProposal, {
          method: 'POST',
          body: formData,
        },0,
        true,
        );
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
              <Text style={{marginBottom: 8, fontSize: 25,fontWeight: 500, fontFamily: 'Montserrat'}}>What's the feedback?</Text>
              <View style={{ marginBottom: 30,}}> 
                <TextInput 
                  style={styles.textInput} 
                  onChangeText={setTitle} 
                  value={title}
                />
              </View>
              <View style={{ marginBottom: 30,}}>
                <Text style={{marginBottom: 8, fontSize: 25,fontWeight: 500, fontFamily: 'Montserrat'}}>Description</Text>
                <TextInput 
                  style={[styles.textInput]} 
                  multiline 
                  numberOfLines={20} 
                  onChangeText={setContent} 
                  value={content}
                />
              </View>
                <Button
                  onPress={handleDone}
                  text="Submit Feedback"
                  textStyle={{fontWeight: "600"}}
                  style={additionalStyles.submitButton}
                />              
              {errorMessage ? <Text style={{colors: colors.red}}>{errorMessage}</Text> : null}
            </>
          )}
        </View>
      );
  };

const additionalStyles = StyleSheet.create({
    submitButton: {
        backgroundColor: colors.purple, // Here's the color adjustment for the button
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
  label: {
    fontFamily: 'Montserrat', // Make sure you have this font installed
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },

  buttonContainer: {
    width: '80%', // Use percentage width for responsiveness
    marginTop: 20,
    marginBottom: 20,
    color: colors.purple
  },
});

export default SubmitFeedback;
