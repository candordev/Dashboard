import React, { useState, useEffect, useRef } from "react";
import { Modal, View, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, Text, Platform } from "react-native";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import colors from "../Styles/colors";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";
import { useUserContext } from "../Hooks/useUserContext";

type EventImagesModalProps = {
    handleClose: () => void;
    visible: boolean;
    imageUrl: string | null;
    eventId: string;
};

const EventImagesModal: React.FC<EventImagesModalProps> = ({ handleClose, visible, imageUrl, eventId }) => {
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const { state, dispatch } = useUserContext();

    useEffect(() => {
        console.log("imageUrl: ", imageUrl);
        setImage(imageUrl);
    }, [visible, eventId, imageUrl]);


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


    const handleSubmit = async () => {
        try {
            setError("");
            if (image && !file) {
                handleClose();
                return;
            }
            let formData = new FormData();
            formData.append('groupId', state.currentGroup);
            formData.append('eventId', eventId);
            if(file) {
                formData.append('image', file);
            }
    
            let res = await customFetch(Endpoints.editEvent, {
                method: "PUT",
                body: formData,
            }, 0, true);
    
            let resText = await res.text(); // Get the response as text
            try {
                let resJson = JSON.parse(resText); // Attempt to parse it as JSON
                if (!res.ok) {
                    setError(resJson.error);
                } else {
                    setFile(null);
                    setImage(null);
                    setError('');
                    handleClose();
                }
            } catch (e) {
                console.error("Failed to parse response as JSON:", resText);
                setError("Unexpected server response");
            }
    
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
                <TouchableOpacity onPress={handleSubmit} style={styles.uploadButton}>
                     <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
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

export default EventImagesModal;
