import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DropDown from "./DropDown";
import styles from "../Styles/styles";
import colors from "../Styles/colors";
import DatePicker from "react-datepicker";
import { ScrollView } from "react-native-gesture-handler";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";
import { set } from "lodash";
import { ValueType } from "react-native-dropdown-picker";

type DownloadReportProps = {
  groupID: string;
};

const DownloadReport = ({ groupID }: DownloadReportProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [districts, setDistricts] = useState<{label: string, value: string}[]>([]);
  const [departments, setDepartments] = useState<{label: string, value: string}[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function queryDistricts() {
      try {
        const url = Endpoints.getGroupByID +
        new URLSearchParams({
          groupID: groupID,
        })
        console.log("URL", url);
        const res = await customFetch(
          url,
          {
            method: "GET",
          }
        );
        if (!res.ok) {
          console.error("Error querying group", res);
          return;
        }
        const resJson = await res.json();
        if (resJson.districts) {
          console.log("Districts", resJson.districts);
          setDistricts([]);
          const newDistrictsArray = [];
          for (let district of resJson.districts) {
            newDistrictsArray.push({
              label: district.name,
              value: district.name
            });
          }
          setDistricts(newDistrictsArray);
        }
      } catch (error) {
        console.error("Error querying group", error);
      }
    }
    async function queryDepartments() {
      try {
        const res = await customFetch(
          Endpoints.getDepartments +
            new URLSearchParams({
              groupID: groupID,
            }),
          {
            method: "GET",
          }
        );
        if (!res.ok) {
          console.error("Error querying departments", res);
          return;
        }
        const resJson = await res.json();
        if (resJson && resJson.length > 0) {
          console.log("Departments", resJson);
          setDepartments([]);
          const newDepartmentsArray = [];
          for (let department of resJson) {
            newDepartmentsArray.push({
              label: department.name,
              value: department._id
            });
          }
          newDepartmentsArray.push({
            label: "All Departments",
            value: ""
          });
          setDepartments(newDepartmentsArray);
        }
      } catch (error) {
        console.error("Error querying departments", error);
      }
    }
    queryDistricts();
    queryDepartments();
  }, [groupID]);

  async function downloadReport() {
    try {
      setError(null);
      console.log("DOWNLOADING REPORT")
      console.log("District", selectedDistrict)
      const queryParams = new URLSearchParams({
        groupID: groupID,
        district: selectedDistrict ? selectedDistrict : "",
        departmentID: selectedDepartment ? selectedDepartment : "",
        startDate: startDate ? startDate.toISOString() : "",
        endDate: endDate ? endDate.toISOString() : "",
        searchTerm: searchTerm ? searchTerm : "",
      });

      const res = await customFetch(
        `${Endpoints.requestPDFInfo}${queryParams.toString()}`,
        {
          method: "GET",
        }
      );
      if (!res.ok) {
        let resJson = await res.json();
        console.error("DOWNLOAD REPORT ERROR", resJson.error);
        setError(resJson.error);
        return;
      }
      const blob = await res.blob();
      const pdfUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Error downloading report", error);
      setError("Failed to download report. Please try again later.");
    }
  }


  const handleDeparmentSelection = (selectedValue: ValueType | null) => {
    console.log("DEPARTMENT SELECTED", selectedValue as string);
    setSelectedDepartment(selectedValue as string);
    // console.log("yuhh", selectedDepartmentName)
};

  return (
    <View style={styles.groupSettingsContainer}>
      <ScrollView>
        <Text style={additionalStyles.header}>Download Report</Text>
        {districts.length > 0 && (
          <View style={[additionalStyles.dropdownContainer, {zIndex: 5}]}>
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
        )}
        <View style={[additionalStyles.inputGroup, {zIndex: 4}]}>
          <Text style={additionalStyles.inputLabel}>Select Department:</Text>
          <DropDown
            placeholder="Select Department"
            value={selectedDepartment}
            setValue={(value:string) => setSelectedDepartment(value)} // Pass a callback that sets the state
            items={departments}
            setItems={() => {}}
            multiple={false}
          />


        </View>
        <View style={[additionalStyles.dropdownContainer, {zIndex: 3}]}>
          <Text style={additionalStyles.inputLabel}>Start Date:</Text>
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            className="custom-datepicker"
            popperPlacement="bottom-start"
          />
        </View>
        <View style={[additionalStyles.dropdownContainer, {zIndex: 2}]}>
          <Text style={additionalStyles.inputLabel}>End Date:</Text>
          <DatePicker
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            className="custom-datepicker"
            popperPlacement="bottom-start"
          />
        </View>

        <View style={[additionalStyles.inputGroup, {zIndex: 1}]}>
          <Text style={additionalStyles.inputLabel}>Search Term:</Text>
          <TextInput
            style={additionalStyles.input}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Enter search term"
          />
        </View>
        {error !== "" && (
            <Text style={additionalStyles.errorMessage}>{error}</Text>
          )}
        <TouchableOpacity
          onPress={downloadReport}
          style={additionalStyles.button}
        >
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
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 10,
    paddingVertical: 12,
    width: "100%",
  },
  buttonText: {
    fontFamily: "Montserrat",
    fontSize: 15,
    color: "white",
  },
  inputGroup: {
    marginVertical: 10,
  },
  inputLabel: {
    fontFamily: "Montserrat",
    marginBottom: 5,
    fontSize: 15,
  },
  input: {
    fontFamily: "Montserrat",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    width: "100%",
    outlineStyle: "none",
  },
  dropdownContainer: {
    zIndex: 1000, // Ensures dropdowns are on top
    width: "100%", // Match parent width to avoid UI misalignment
    marginVertical: 10,
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: "Montserrat",
  },
});

export default DownloadReport;