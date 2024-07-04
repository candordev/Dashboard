import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardTypeOptions,
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
import TextInput from "../Components/Native/TextInput";
import Icon from "react-native-vector-icons/Feather"

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

    const TextElement = useCallback(({ text, setText, edit, flex, keyboardType }: { text: string, setText: (text: string) => void, edit: boolean, flex: number, keyboardType?: string }) => {
        return (
            <View style={{ flex: flex, marginRight: edit ? 10 : 0, marginLeft: 5 }}>
                {edit ? (
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        keyboardType={keyboardType as KeyboardTypeOptions}
                        style={[
                            {
                                fontFamily: "Montserrat",
                                borderWidth: 1,
                                borderColor: colors.gray,
                                borderRadius: 5,
                                padding: 5,
                                flex: 1,
                                flexWrap: 'wrap',
                            }
                        ]}
                    />
                ) : (
                    <Text style={{ fontSize: 15, flex: 1, flexWrap: 'wrap' }}>{text}</Text>
                )}
            </View>
        )
    }, []);


    return (
        <OuterView style={{ backgroundColor: colors.white, flex: 1 }}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Events</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleOpenCreateModal}>
                    <Icon name="plus" size={20} color={colors.white} />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", flex: 1, borderBottomWidth: 1, borderBottomColor: colors.lightgray, alignItems: "center", padding: 20, columnGap: 5 }}>
                <TextElement text={"Title"} setText={() => {}} edit={false} flex={1.5}/>
                <TextElement text={"Description"} setText={() => {}} edit={false} flex={1.5} />
                <TextElement text={"Date"} setText={() => {}} edit={false} flex={1} keyboardType="numeric" />
                <TextElement text={"Start"} setText={() => {}} edit={false} flex={0.7} />
                <TextElement text={"End"} setText={() => {}} edit={false} flex={0.7} />
                <TextElement text={"Location"} setText={() => {}} edit={false} flex={1.5} />
                <TextElement text={"X"} setText={() => {}} edit={false} flex={0.5} keyboardType="numeric" />
                <TextElement text={"Y"} setText={() => {}} edit={false} flex={0.5} keyboardType="numeric" />
                <TextElement text={"Level"} setText={() => {}} edit={false} flex={0.5} keyboardType="numeric" />
                <View style={{flex: 1.5}}></View>
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
});

export default EventsScreen;
