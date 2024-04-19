import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import DropDown from "./DropDown";
import styles from "../Styles/styles";
import colors from "../Styles/colors";
import DatePicker from "react-datepicker";
import { ScrollView } from "react-native-gesture-handler";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";

type DownloadReportProps = {
    groupID: string;
  };
  

const DownloadReport = ({ groupID }: DownloadReportProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [districts, setDistricts] = useState([{label: "District 1", value: "district1"}, {label: "District 2", value: "district2"}, {label: "District 3", value: "district3"}]);
    const [departments, setDepartments] = useState([{label: "Department 1", value: "department1"}, {label: "Department 2", value: "department2"}, {label: "Department 3", value: "department3"}]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        async function queryGroups() {
          try {
            const res = await customFetch(
              Endpoints.getGroupByID +
                new URLSearchParams({
                  groupID: groupID,
                }),
              {
                method: "GET",
              }
            );
            const resJson = await res.json();
            if (resJson.districts) {
              console.log("Districts", resJson.districts);
              setDistricts([]);
              for (let district of resJson.districts) {
                setDistricts((districts) => [...districts, {label: district, value: district}]);
              }
            }
          } catch (error) {
            console.error("Error querying group", error);
          }
        }
        queryGroups();
      }, [groupID]);

    async function downloadReport() {
        // Logic to download report based on the selected values
    }

    return (
        <View style={styles.groupSettingsContainer}>
            <ScrollView>
                <Text style={additionalStyles.header}>Download Report</Text>
                
                <View style={additionalStyles.dropdownContainer}>
                    <Text style={additionalStyles.inputLabel}>Select District:</Text>
                    <DropDown
                        placeholder="Select District"
                        value={selectedDistrict}
                        setValue={setSelectedDistrict}
                        items={districts}
                        setItems={() => {}}
                        multiple={false}
                    />
                </View>
                <View style={additionalStyles.dropdownContainer}>
                    <Text style={additionalStyles.inputLabel}>Start Date:</Text>
                    <DatePicker
                        selected={startDate}
                        onChange={(date: Date) => setStartDate(date)}
                        className="custom-datepicker"
                        popperPlacement="bottom-start"
                    />
                </View>
                <View style={additionalStyles.dropdownContainer}>
                    <Text style={additionalStyles.inputLabel}>End Date:</Text>
                    <DatePicker
                        selected={endDate}
                        onChange={(date: Date) => setEndDate(date)}
                        className="custom-datepicker"
                        popperPlacement="bottom-start"
                    />
                </View>
                
                
                <View style={additionalStyles.inputGroup}>
                    <Text style={additionalStyles.inputLabel}>Search Term:</Text>
                    <TextInput
                        style={additionalStyles.input}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        placeholder="Enter search term"
                    />
                </View>
                <View style={additionalStyles.dropdownContainer}>
                    <Text style={additionalStyles.inputLabel}>Select Department:</Text>
                    <DropDown
                        placeholder="Select Department"
                        value={selectedDepartment}
                        setValue={setSelectedDepartment}
                        items={departments}
                        setItems={() => {}}
                        multiple={false}
                    />
                </View>
                <TouchableOpacity onPress={downloadReport} style={additionalStyles.button}>
                    <Text style={additionalStyles.buttonText}>Download Report!</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const additionalStyles = StyleSheet.create({
    header: {
        alignSelf: "flex-start",
        fontWeight: "600",
        fontSize: 27,
        fontFamily: "Montserrat",
        marginBottom: 10,
    },
    button: {
        backgroundColor: colors.purple,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 10,
        paddingVertical: 12,
        width: '100%',
    },
    buttonText: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        color: 'white',
    },
    inputGroup: {
        marginVertical: 10,
    },
    inputLabel: {
        fontFamily: 'Montserrat',
        marginBottom: 5,
        fontSize: 15,
    },
    input: {
        fontFamily: 'Montserrat',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        width: '100%',
        outlineStyle: "none",
    },
    dropdownContainer: {
        zIndex: 1000, // Ensures dropdowns are on top
        width: '100%', // Match parent width to avoid UI misalignment
        marginVertical: 10,
    },
});

export default DownloadReport;
