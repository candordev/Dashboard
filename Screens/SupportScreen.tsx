import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from "react-native";
import colors from "../Styles/colors"; // Update the import path as needed
import SubmitFeedback from "../Components/SubmitFeedback"; // Ensure this path matches your project
import OuterView from "../Components/OuterView";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";

const SupportScreen = () => {
  // Function to handle button press
  const [availableUntil, setAvailableUntil] = useState(null);
  const [zoomLink, setZoomLink] = useState('');

  useEffect(() => {
    fetchAvailableSupportUsers();
  }, []);

  const fetchAvailableSupportUsers = async () => {
    try {
      const response = await customFetch(Endpoints.getAvailableSupportUsers, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableUntil(data.latestEndDate);
        setZoomLink(data.zoomLink);
        console.log("Available until:", data.latestEndDate);
      } else {
        console.error("Failed to fetch available support users.");
      }
    } catch (error) {
      console.error("Error fetching available support users:", error);
      setAvailableUntil(null); // If error, set availability to null
    }
  };

  const handlePress = () => {
    if (availableUntil) {
      Linking.openURL(zoomLink);
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  

  return (
    <OuterView style={{ backgroundColor: colors.white, flex: 1}}>
      <TouchableOpacity 
        style={[styles.fullWidthButton, !availableUntil ? styles.buttonUnavailable : {}]}
        onPress={handlePress}
        disabled={!availableUntil}
      >
        <Text style={styles.fullWidthButtonText}>
          {availableUntil ? `Available Until: ${formatDate(availableUntil)} - Join Our Zoom Now!` : 'Zoom Unavailable Right Now'}
        </Text>
      </TouchableOpacity>
      <View style={styles.container}> 
        <View style={styles.helpSection}>
          <Text style={styles.largeText}>Need Help or Have Feedback?</Text>
          <Text style={styles.smallText}>Text, call, or fill out the form!</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.outerBox}>
              <Text style={styles.phoneNumberText}>813-955-3308</Text>
            </View>
            <TouchableOpacity style={styles.outerBox} onPress={handlePress}>
              <Text style={styles.phoneNumberText}>Join Our Zoom!</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: "https://unblast.com/wp-content/uploads/2021/08/Online-Chat-Support-Illustration.jpg" }}
            style={styles.supportImage}
            resizeMode="contain" // Adjust as needed
          />
        </View>
        <View style={styles.submitFeedbackSection}>
          <SubmitFeedback />
        </View>
      </View>
    </OuterView>
  );
};

const styles = StyleSheet.create({
  fullWidthButton: {
    marginTop: 15,
    marginHorizontal: 10,
    //margin: 10,
    borderRadius: 10,
    backgroundColor: colors.purple,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonUnavailable: {
    backgroundColor: colors.lightgray, // assuming colors.lightgray is a defined color in your colors.js
  },
  supportImage: {
    width: '300%', // Adjust the width as needed
    height: 400, // Adjust the height as needed
    marginTop: 80,
  },
  fullWidthButtonText: {
    color: "white",
    fontFamily: "Montserrat",
    fontSize: 25,
    fontWeight: '500'
  },
  container: {
    flexDirection: "row",
    flex: 1,
  },
  helpSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  submitFeedbackSection: { 
    flex: 1,
    //margin: 10,
    marginTop: -10,
    justifyContent: "center",
  },
  largeText: {
    fontFamily: "Montserrat",
    fontSize: 50, // Increased font size for bigger text
    marginBottom: 30,
    marginHorizontal: 70,
    fontWeight: '450', 
    textAlign: 'center', // Ensure text is centered, helpful if it wraps
  },
  smallText: {
    fontFamily: "Montserrat",
    fontSize: 35, // Increased font size for bigger text
    marginBottom: 20,
    marginHorizontal: 70,
    textAlign: 'center', // Ensure text is centered, helpful if it wraps
  },
  outerBox: {
    margin: 5,
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderColor: colors.lightestgray,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneNumberText: {
    fontFamily: "Montserrat",
    fontWeight: '300',
    fontSize: 25, // Reduced font size for the phone number
  },
});

export default SupportScreen;
