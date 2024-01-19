import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import colors from "../Styles/colors";

import Text from "./Text";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import DropDownPicker, { ValueType } from "react-native-dropdown-picker";
import { useUserContext } from "../Hooks/useUserContext";
import { emptyFields, emptyFieldsDepartment } from "../utils/interfaces";
import { EdgeMode } from "react-native-safe-area-context";
import DropDown from "./DropDown";

const AddLeader = (props: {
  inviteLeader: (
    firstName: string,
    lastName: string,
    email: string,
    departmentID: string,
    departmentName: string
  ) => void;
  inviteLeaderMissingFields: (emptyFields: emptyFields) => void;
  createPost: Boolean;
}) => {
  const { state, dispatch } = useUserContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [departmentDescription , setDepartmentDescription] = useState("");
  const [departmentName , setDepartmentName] = useState("");
  const [expandedAddDep, setExpandedAddDep] = useState(false);
  const [items, setItems] = useState([
    //{ label: "Tanuj Dunthuluri", value: "Tanuj Dunthuluri" ,parent: 'Atishay Jain'},
    //{ label: "Shi Shi", value: "Shi Shi" ,parent: 'Atishay Jain'},
    { label: "Akshat Pant", value: "Akshat Pant", parent: "Department A" },
    { label: "Department A", value: "Department A" },
    { label: "Department B", value: "Department B" },
    {
      label: "Tanuj Dunthuluri",
      value: "Tanuj Dunthuluri",
      parent: "Department B",
    },
    { label: "Srikar Parsi", value: "Srikar Parsi", parent: "Department A" },
  ]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");
  const [missingFields, setMissingFields] = useState<emptyFields>();

  useEffect(() => {
    async function fetchDepartments() {
      try {
        // Prepare the query parameters
        const queryParams = new URLSearchParams({
          groupID: state.leaderGroups[0],
        });

        // Make the GET request
        const response = await customFetch(
          `${Endpoints.getDepartments}${queryParams.toString()}`,
          {
            method: "GET",
          }
        );

        // Process the response
        const data = await response.json();
        if (response.ok) {
          console.log("DEPARTMENTS FETCHED DATA", data);
          setItems(
            data.map((dept: { name: any; _id: any }) => ({
              label: dept.name,
              value: dept._id,
            }))
          );
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
  }, []);


  // const handleValueChange = (newValues: ValueType[] | null) => {
  //   console.log("Selected values changed to:", newValues);
  //   if (newValues != null) {
  //     setValue(newValues as string[]); // Use type assertion here
  //     setValueChanged(true); // Indicate that the value has changed
  //   }
  // };

  const handleDeparmentSelection = (selectedValue: ValueType | null) => {
    const selectedDepartment = items.find((item) => item.value === (selectedValue as string));
    // console.log("selected Value", selectedValue)
    // console.log("items", items)
    // console.log("selected dept bool", selectedDepartment)
    // if (selectedDepartment) {
      console.log("DEPARTMENT SELECTED", selectedValue as string);
      setSelectedDepartmentName(selectedValue as string);
      setValue(selectedValue as string); // This should now be valid
   // }
  };
  

  async function addDepartment(
  ) {
    try {
      let res = await customFetch(Endpoints.addDepartment, {
        method: "POST",
        body: JSON.stringify({
          description: departmentDescription,
          name: departmentName,
          groupID: state.leaderGroups[0],
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with creating an account:", resJson.error);
      } else {
        const newDepartment = await res.json(); // Assuming this returns the newly added department data
        const newDepartmentItem = {
          label: departmentName,
          value: newDepartment.department._id
        };
        setItems((prevItems) => [...prevItems, newDepartmentItem]);
        setValue(newDepartment.department._id); // Set the new department as selected
        setSelectedDepartmentName(departmentName); 
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  }

  return (
    <View style={{ rowGap: 10 }}>
          {expandedAddDep && (
            <>
              <TextInput
                placeholder="Department Name"
                placeholderTextColor={colors.gray}
                value={departmentName}
                onChangeText={setDepartmentName}
                style={styles.input}
              />
              <TextInput
                placeholder="Department Description"
                placeholderTextColor={colors.gray}
                value={departmentDescription}
                onChangeText={setDepartmentDescription}
                style={styles.input}
              />
            </>
      )}
      {expanded && (
        <>
            <TouchableOpacity //NEEDS TO BE FIXED
                style={{
                  backgroundColor: colors.purple,
                  borderRadius: 10,
                  paddingVertical: 8,
                  alignItems: "center",
                }}
                onPress={() => {
                  if (expandedAddDep) {
                        if (
                          departmentName.length > 0 &&
                          departmentDescription.length > 0
                        ) {
                          addDepartment();
                        } else {
                          const missingFields: emptyFieldsDepartment = {
                            departmentName: departmentName.length === 0,
                            departmentDescription: departmentDescription.length === 0,
        
                          };
                          const isAnyFieldMissing = Object.values(missingFields).some(
                            (isMissing) => isMissing
                          );
                          if (isAnyFieldMissing) {
                            //code to display the error???
                            // If any field is missing, call inviteLeaderMissingFields
                            //props.inviteLeaderMissingFields(missingFields);
                          }
                        }
                        setExpandedAddDep(false);
                  } else {
                    setExpandedAddDep(true);
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
                  {expandedAddDep ? "Done" : "Add Department"}
                </Text>
      </TouchableOpacity> 
      {/* placeholder="Select category"
        value={value}
        setValue={handleValueChange}
        items={items}
        setItems={setItems}
        multiple={true}
        backgroundColor={colors.lightestgray}
        onClose={handleDropdownClose} */}
         <DropDown
              placeholder="Select department"
              value={value}
              setValue={handleDeparmentSelection}
              items={items}
              setItems={setItems}
              multiple={false}
              backgroundColor={colors.lightestgray}
            />
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
            if (
              value != null &&
              firstName.length > 0 &&
              lastName.length > 0 &&
              email.length > 0
            ) {
              props.inviteLeader(
                firstName,
                lastName,
                value,
                email,
                selectedDepartmentName
              );
            } else {
              const missingFields: emptyFields = {
                firstName: firstName.length === 0,
                lastName: lastName.length === 0,
                email: email.length === 0,
                department: value === null,
              };
              const isAnyFieldMissing = Object.values(missingFields).some(
                (isMissing) => isMissing
              );
              if (isAnyFieldMissing) {
                // If any field is missing, call inviteLeaderMissingFields
                props.inviteLeaderMissingFields(missingFields);
              }
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
          {expanded ? "Done" : "Add Leader"}
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




          {/* <DropDownPicker
            open={open}
            items={items}
            value={value}
            onChangeValue={(selectedValue) => {
              // Update the value state with the department ID
              //setValue(selectedValue);

              // Find and update the department name
              const selectedDepartment = items.find(
                (item) => item.value === selectedValue
              );
              if (selectedDepartment) {
                setSelectedDepartmentName(selectedDepartment.label);
              }
            }}
            placeholder="Select Department"
            containerStyle={{ height: 40, zIndex: 5000 }} // Increase zIndex
            style={{ backgroundColor: "white", borderColor: "gray" }}
            dropDownContainerStyle={{
              backgroundColor: "white",
              borderColor: "gray",
              zIndex: 5000,
            }} // Increase zIndex
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            listMode="SCROLLVIEW"
            dropDownDirection="TOP" // This makes the dropdown open upwards
          /> */}
