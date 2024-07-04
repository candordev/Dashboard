import React, { useState, useRef } from "react";
import { Modal, View, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, Text, Platform } from "react-native";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import colors from "../Styles/colors";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";
import { useUserContext } from "../Hooks/useUserContext";

type CreateEventModalProps = {
    handleClose: () => void;
    visible: boolean;
};

const CreateEventModal: React.FC<CreateEventModalProps> = ({ handleClose, visible }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [xCord, setXCord] = useState('');
    const [yCord, setYCord] = useState('');
    const [level, setLevel] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const { state, dispatch } = useUserContext();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const fileURL = URL.createObjectURL(file);
            setFile(file);
            setImage(fileURL);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const formatTime = (date: Date | null): string => {
      return date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
    };

    const handleSubmit = async () => {
        try {
            setError("");
            let formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('location', location);
            formData.append('date', date ? date.toISOString() : '');
            formData.append('startTime', formatTime(startTime));
            formData.append('endTime', formatTime(endTime));
            formData.append('xCord', xCord);
            formData.append('yCord', yCord);
            formData.append('level', level);
            formData.append('groupId', state.currentGroup);

            if(file) {
                formData.append('image', file);
            }

            let res = await customFetch(Endpoints.createEvent, {
                method: "POST",
                body: formData,
            }, 0, true);

            if (!res.ok) {
                let resJson = await res.json();
                setError(resJson.error);
            } else {
                handleClose();
            }

            // Reset fields and close modal after submission
            setTitle('');
            setDescription('');
            setLocation('');
            setDate(null);
            setStartTime(null);
            setEndTime(null);
            setXCord('');
            setYCord('');
            setLevel('');
            setImage(null);
            setError('');
            handleClose();
        } catch (error: any) {
            console.error("Error creating event:", error);
            setError(error.message);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.modalView}>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Title:</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Enter title"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Description:</Text>
                        <TextInput
                            style={styles.input}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Enter description"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Location:</Text>
                        <TextInput
                            style={styles.input}
                            value={location}
                            onChangeText={setLocation}
                            placeholder="Enter location"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Date:</Text>
                        <DatePicker
                            selected={date}
                            onChange={(date: Date) => setDate(date)}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="Select Date"
                            className="date-picker"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Start Time:</Text>
                        <DatePicker
                            selected={startTime}
                            onChange={(date: Date) => setStartTime(date)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Start Time"
                            dateFormat="h:mm aa"
                            placeholderText="Select Start Time"
                            className="date-picker"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>End Time:</Text>
                        <DatePicker
                            selected={endTime}
                            onChange={(date: Date) => setEndTime(date)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="End Time"
                            dateFormat="h:mm aa"
                            placeholderText="Select End Time"
                            className="date-picker"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>X Coordinate:</Text>
                        <TextInput
                            style={styles.input}
                            value={xCord}
                            onChangeText={setXCord}
                            placeholder="Enter X coordinate"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Y Coordinate:</Text>
                        <TextInput
                            style={styles.input}
                            value={yCord}
                            onChangeText={setYCord}
                            placeholder="Enter Y coordinate"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Level:</Text>
                        <TextInput
                            style={styles.input}
                            value={level}
                            onChangeText={setLevel}
                            placeholder="Enter level"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Image:</Text>
                        {image && <Image source={{ uri: image }} style={styles.image} />}
                        <TouchableOpacity onPress={triggerFileInput} style={styles.uploadButton}>
                            <Text style={styles.buttonText}>{image ? 'Change Image' : 'Upload Image'}</Text>
                        </TouchableOpacity>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".png, .jpg, .jpeg"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                        />
                    </View>
                    {error !== '' && <Text style={styles.error}>{error}</Text>}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} style={styles.doneButton}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minWidth: '80%',
        minHeight: '80%',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 15,
        padding: 5,
    },
    closeButtonText: {
        color: colors.purple,
        fontSize: 17,
        fontWeight: 'bold',
    },
    scrollContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: '100%',
        flex: 1
    },
    inputGroup: {
        marginVertical: 4,
    },
    inputLabel: {
        fontFamily: 'Montserrat',
        marginBottom: 4,
    },
    input: {
        fontFamily: 'Montserrat',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        width: '100%',
        borderRadius: 5,
        outlineStyle: "none",
    },
    datePickerButton: {
        backgroundColor: colors.lightgray,
        padding: 10,
        borderRadius: 5,
    },
    datePickerButtonText: {
        fontFamily: 'Montserrat',
        color: colors.black,
    },
    image: {
        width: 150,
        height: 100,
        borderRadius: 10,
        marginVertical: 10,
    },
    uploadButton: {
        backgroundColor: colors.lightgray,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    doneButton: {
        backgroundColor: colors.purple,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        color: 'white',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'Montserrat',
    },
});

export default CreateEventModal;
