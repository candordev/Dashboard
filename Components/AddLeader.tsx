import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import colors from "../Styles/colors";

import Text from "./Text";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import DropDownPicker from 'react-native-dropdown-picker';

const AddLeader = (props: { 
  inviteLeader: (firstName: string, lastName: string, email: string, departmentID: string, departmentName: string) => void; 
  groupID: string; // Include groupID in the props object
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState([
          //{ label: "Tanuj Dunthuluri", value: "Tanuj Dunthuluri" ,parent: 'Atishay Jain'},
      //{ label: "Shi Shi", value: "Shi Shi" ,parent: 'Atishay Jain'},
      { label: "Akshat Pant", value: "Akshat Pant" ,parent: 'Department A'},
      { label: "Department A", value: "Department A" },
      { label: "Department B", value: "Department B" },
      { label: "Tanuj Dunthuluri", value: "Tanuj Dunthuluri" ,parent: 'Department B'},
      { label: "Srikar Parsi", value: "Srikar Parsi" , parent: 'Department A'},
  ]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");




  useEffect(() => {
    async function fetchDepartments() {
      try {
        // Prepare the query parameters
        const queryParams = new URLSearchParams({  groupID: props.groupID });
    
        // Make the GET request
        const response = await customFetch(`${Endpoints.getDepartments}${queryParams.toString()}`, {
          method: "GET"
        });
    
        // Process the response
        const data = await response.json();
        if (response.ok) {

          console.log("DEPARTMENTS FETCHED DATA", data)
          setItems(data.map((dept: { name: any; _id: any; }) => ({ label: dept.name, value: dept._id })));
        } else {
          // Handle error in response
          console.error("Error fetching departments: ", data.error);
        }
      } catch (error) {
        // Handle network or other errors
        console.error("Network error while fetching departments: ", error);
      }
    }

    fetchDepartments();
    //setItems(departments)
  }, [props.groupID]);




  return (
    <View style={{ rowGap: 10 }}>
      {expanded && (
        <>
          <TextInput
            placeholder="First Name"
            placeholderTextColor={colors.gray}
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor={colors.gray}
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
           <>

           <DropDownPicker
              open={open}
              items={items}
              value={value}
              onChangeValue={(selectedValue) => {
                // Update the value state with the department ID
                //setValue(selectedValue);
            
                // Find and update the department name
                const selectedDepartment = items.find(item => item.value === selectedValue);
                if (selectedDepartment) {
                  setSelectedDepartmentName(selectedDepartment.label);
                }
              }}
              placeholder="Select Department"
              containerStyle={{ height: 40, zIndex: 5000 }} // Increase zIndex
              style={{ backgroundColor: 'white', borderColor: 'gray' }}
              dropDownContainerStyle={{ backgroundColor: 'white', borderColor: 'gray', zIndex: 5000 }} // Increase zIndex
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              listMode="SCROLLVIEW"
              dropDownDirection="TOP" // This makes the dropdown open upwards
          />



        </>
        </>
      )}
      <TouchableOpacity
        style={{
          backgroundColor: colors.purple,
          borderRadius: 10,
          paddingVertical: 8,
          alignItems: "center",
        }}
        onPress={() => {
          if (expanded) {
            if(value != null && firstName.length > 0 && lastName.length > 0 && email.length > 0){
              props.inviteLeader(firstName, lastName, value, email, selectedDepartmentName)
            }
            setExpanded(false);
          } else {
            setExpanded(true);
          }
        }}
      >
        <Text
          style={{
            fontFamily: "Montserrat",
            color: colors.white,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {expanded ? 'Done' : 'Add Leader'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomColor: colors.lightgray,
    borderBottomWidth: 1,
    padding: 10,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    flex: 1,
    height: 30,
    outlineStyle: "none",
  },
});

export default AddLeader;
