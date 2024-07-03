import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import colors from "../Styles/colors"; // Update the import path as needed
import OuterView from "../Components/OuterView";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";
import EventRow from "../Components/EventRow";
import { Event } from "../utils/interfaces";
import { useUserContext } from "../Hooks/useUserContext";
import CreateEventModal from "../Components/CreateEventModal";
import { set } from "lodash";

const EventsScreen = ({ navigation }: any) => {
    const [error, setError] = useState<string>("");
    const [data, setData] = useState<Event[]>([]);
    const { state, dispatch } = useUserContext();
    const [createEventModalVisible, setCreateEventModalVisible] = useState(false); 

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

    const handleCloseModal = () => {
        setCreateEventModalVisible(false); // Explicitly close the modal
        fetchEvents();
      };

    const handleOpenCreateModal = () => {
        // Add your event handling logic here
        setCreateEventModalVisible(true);
    };


    return (
        <OuterView style={{ backgroundColor: colors.white, flex: 1 }}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Events</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleOpenCreateModal}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                {data.map((event) => (
                    <EventRow key={event._id} event={event} fetchEvents={fetchEvents} />
                ))}
            </ScrollView>
            <CreateEventModal
                visible={createEventModalVisible}
                handleClose={handleCloseModal}
            />
            
        </OuterView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
    },
    headerText: {
        fontFamily: "Montserrat",
        fontSize: 30,
        fontWeight: "bold",
        color: colors.black,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.purple,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: colors.white,
        fontSize: 30,
        lineHeight: 30, // Adjust this if the + sign is not vertically centered
    },
});

export default EventsScreen;
