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

const EventsScreen = ({ navigation }: any) => {
  return (
    <OuterView style={{ backgroundColor: colors.white, flex: 1 }}>
        <View> </View>
    </OuterView>
  );
};

export default EventsScreen;
