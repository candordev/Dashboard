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
import EventRow from "../Components/EventRow";
import { set } from "lodash";
import {Event} from "../utils/interfaces"
import { useUserContext } from "../Hooks/useUserContext";


const EventsScreen = ({ navigation }: any) => {
    const [error, setError] = useState<string>("");
    const [data, setData] = useState<Event[]>([]);
    const { state, dispatch } = useUserContext();

    const fetchEvents = async () => {
        try {
          const endpoint = Endpoints.getEvents +
            new URLSearchParams({
              groupId: state.currentGroup,
              adminPassword: 'CandorDev345!',
            });
    
          let headers: any = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          };
    
          let res = await fetch(endpoint, {
            headers: headers,
          });
    
          const resJson = await res.json();

          console.log(resJson); 
          if (!res.ok) {
            throw new Error(resJson.message);
          }
          if (res.ok) {
            setData([].concat(...resJson));
            console.log("EVENT DATA", resJson);
          }
        } catch (error: any) {
            setError(error.message);
        }
      };

    useEffect(() => { 
      fetchEvents();
    }, []);

  return (
    <OuterView style={{ backgroundColor: colors.white, flex: 1 }}>
        <Text style={{fontFamily: "Montserrat", fontSize: 30, fontWeight: "550" as any, color: colors.black, margin: 10}}>Events</Text>
       <ScrollView>
        {data.map((event) => (
          <EventRow event={event} fetchEvents={fetchEvents} />
        ))}
      </ScrollView>
    </OuterView>
  );
};

export default EventsScreen;
