import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Image,
  ScrollView,
} from "react-native";
import colors from "../Styles/colors"; // Update the import path as needed
import SubmitFeedback from "../Components/SubmitFeedback"; // Ensure this path matches your project
import OuterView from "../Components/OuterView";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";
import Button from "../Components/Button";
import NotificationPopup from "../Components/NotificationPopup";

const SupportScreen = ({ navigation }: any) => {
  // Function to handle button press
  const [availableUntil, setAvailableUntil] = useState(null);
  const [zoomLink, setZoomLink] = useState("");

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
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <OuterView style={{ backgroundColor: colors.white, flex: 1 }}>
      <TouchableOpacity
        style={[
          additionalStyles.fullWidthButton,
          !availableUntil ? { backgroundColor: colors.lightgray } : {},
        ]}
        onPress={handlePress}
        disabled={!availableUntil}
      >
        <Text
          style={{
            color: "white",
            fontFamily: "Montserrat",
            fontSize: 25,
            fontWeight: "500",
          }}
        >
          {availableUntil
            ? `Available Until: ${formatDate(
                availableUntil
              )} - Join Our Zoom Now!`
            : "Zoom Unavailable Right Now"}
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <Text style={additionalStyles.largeText}>
            Need Help or Have Feedback?
          </Text>
          <Text style={additionalStyles.smallText}>
            Text, call, or fill out the form!
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={additionalStyles.outerBox}>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "300",
                  fontSize: 25,
                }}
              >
                813-955-3308
              </Text>
            </View>
            <Button
              style={additionalStyles.outerBox}
              onPress={handlePress}
              text={"Join Our Zoom!"}
              textStyle={{
                fontFamily: "Montserrat",
                fontWeight: "350",
                fontSize: 25,
                color: colors.black,
              }}
            />
          </View>
          <Image
            source={{
              uri: "https://unblast.com/wp-content/uploads/2021/08/Online-Chat-Support-Illustration.jpg",
            }}
            style={{ width: 400, height: 300, marginTop: 20 }}
            resizeMode="contain" // Adjust as needed
          />
        </View>
        <SubmitFeedback />
      </View>
    </OuterView>
  );
};

const additionalStyles = StyleSheet.create({
  fullWidthButton: {
    marginVertical: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.purple,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  largeText: {
    fontFamily: "Montserrat",
    fontSize: 47, // Increased font size for bigger text
    marginBottom: 30,
    marginHorizontal: 70,
    fontWeight: "400",
    textAlign: "center", // Ensure text is centered, helpful if it wraps
  },
  smallText: {
    fontFamily: "Montserrat",
    fontSize: 35, // Increased font size for bigger text
    marginBottom: 20,
    marginHorizontal: 70,
    textAlign: "center", // Ensure text is centered, helpful if it wraps
  },
  outerBox: {
    margin: 5,
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderColor: colors.lightestgray,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SupportScreen;
