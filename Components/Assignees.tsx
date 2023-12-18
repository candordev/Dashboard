import React, { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";
import ProfileRow from "./ProfileRow";
import DropDownPicker, { ItemType, ValueType } from "react-native-dropdown-picker";
import FeatherIcon from "react-native-vector-icons/Feather";
import AddLeader from "./AddLeader";
import OrFullWidth from "./OrFullWidth";
import { Post, UserProfile } from "../utils/interfaces";
import Icon from "react-native-vector-icons/Feather";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";

interface AssigneesProps {
  leaders: UserProfile[];
  issue: Post;
}

function Assignees(props: AssigneesProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const [items, setItems] = useState([
    //{ label: "Tanuj Dunthuluri", value: "Tanuj Dunthuluri" ,parent: 'Atishay Jain'},
    //{ label: "Shi Shi", value: "Shi Shi" ,parent: 'Atishay Jain'},
    { label: "Akshat Pant", value: "Akshat Pant" ,parent: 'Department A'},
    { label: "Department A", value: "Department A" },
    { label: "Department B", value: "Department B" },
    { label: "Tanuj Dunthuluri", value: "Tanuj Dunthuluri" ,parent: 'Department B'},
    { label: "Srikar Parsi", value: "Srikar Parsi" , parent: 'Department A'},
  ]);
  const [previousValue, setPreviousValue] = useState<string[]>([]);


  // useEffect(() => {
  //   const leaders = props.leaders.map((leader) => {
  //     const isSuggested = isLeaderSuggestedByAI(leader.user);
  //     const departmentNamesString = leader.departmentNames.join(", ");
  //     const aiSuggestsTag = isSuggested ? " [AI suggests]" : ""; 

  //     return {
  //       label: `${leader.firstName}${departmentNamesString ? `(${departmentNamesString})` : ""}${aiSuggestsTag}`,
  //       value: leader.email ? leader.email[0] : "atjain02@gmail.com",
  //     };
  //   });

  //   setItems(leaders);
  // }, [props.leaders]);
  

  // useEffect(() => {
  //   for (let email of value) {
  //     sendEmailToLeader(email);
  //   }
  // }, [value])
  type Department = {
    label: string;
    value: string;
    children: Leader[];
    aiSuggests?: boolean;
  };

  type Leader = {
    label: string;
    value: string;
    parent: string;
  };

  type Item = {
    label: string;
    value: string;
    parent?: string;
  };
  

  useEffect(() => {
    // Initialize an object to group leaders by department
    const departments: { [key: string]: Department } = {};
  
    // Loop over the leaders to group them by department
    props.leaders.forEach((leader) => {
      console.log("leader departments", leader.departmentNames)
      leader.departmentNames.forEach(departmentName => {
        if (!departments[departmentName]) {
          departments[departmentName] = {
            label: departmentName,
            value: departmentName,
            children: [],
            ...(isLeaderSuggestedByAI(leader.user) && { aiSuggests: true }),
          };
        }
        // Add leader as a child to the department
        departments[departmentName].children.push({
          label: leader.firstName,
          value: leader.email ? leader.email[0] : "atjain02@gmail.com",
          parent: departmentName,
        });
      });
    });

    const itemsArray: Item[] = [];

  
    // Convert departments object to array and include AI suggests tag if applicable
    Object.values(departments).forEach(department => {
      // Add department first with parent as null
      itemsArray.push({
        label: department.aiSuggests ? `${department.label} [AI suggests]` : department.label,
        value: department.value,
        // parent is intentionally omitted or set to undefined for a department
      });
    
      // Add children of the department
      itemsArray.push(...department.children.map(child => ({
        label: child.label,
        value: child.value,
        parent: department.value, // Assuming the department's value is used as the parent identifier
      })));
    });
    console.log("DEBUG ITEMS", itemsArray)
    setItems(itemsArray);
  }, [props.leaders]);




  const isString = (value: any): value is string => typeof value === 'string';


  useEffect(() => {
    console.log('Value state updated:', value);
    console.log("INFNITE LOOP A")
    setPreviousValue(value);

    
  }, [value]);

  useEffect(() => {
    console.log('previousValue updated:', previousValue);
    
    
  }, [previousValue]);

  const previousValueRef = useRef<string[]>([]);


  useEffect(() => {
    // Update the ref when previousValue state changes
    previousValueRef.current = previousValue;
  }, [previousValue]);
  

  const onUserSelect = (selectedItems: ItemType<string>[] | ItemType<string>) => {
    console.log("Value changed", selectedItems);
  
    // Ensure selectedItems is always treated as an array
    const selectedArray = Array.isArray(selectedItems) ? selectedItems : [selectedItems];
  
    // Filter and convert to string array
    const currentValueAsString = selectedArray
      .map(obj => obj.value)
      .filter(isString);
    
    console.log("Value changed", currentValueAsString);
   
  
    const previousValueSet = new Set<string>(previousValueRef.current);
    const currentValueSet = new Set<string>(previousValueRef.current);
    const currentValueB = new Set<string>(currentValueAsString);
    //const valAdded =  new Set<string>();
    console.log("previousValueSet", previousValueRef.current)
  
  
    // Handle selection of new values
    currentValueAsString.forEach(val => {
      //currentValueSet.add(val);
      if (!previousValueSet.has(val)) {
        const childItem = items.find(item => item.value === val && item.parent);
        if (childItem) {       
          console.log("CHILD SELECT", val);
          if (childItem.parent && !currentValueSet.has(childItem.parent)) {
            currentValueSet.add(childItem.parent);
            //isStateChanged = true;
          }
        } else {   
          console.log("PARENT SELECT");
          const children = items.filter(item => item.parent === val);
          children.forEach(child => currentValueSet.add(child.value));
          //isStateChanged = true;
        }
        console.log("This was THE value selected", val)
        //valAdded.add(val)
      }
    });
  
    // Handle deselection
    previousValueSet.forEach(val => {
      if (!currentValueB.has(val)) {
        const childItem = items.find(item => item.value === val && item.parent);
        if (childItem) {
          console.log("deselecting child");
          const siblings = items.filter(item => item.parent === childItem.parent);
          const isAnySiblingSelected = siblings.some(sibling => currentValueB.has(sibling.value));
          if (!isAnySiblingSelected) {
            if (childItem.parent && currentValueSet.delete(childItem.parent)) {
              //isStateChanged = true;
            }
          }
        } else {
          console.log("deselecting parent");
          const children = items.filter(item => item.parent === val);
          children.forEach(child => {
            currentValueSet.delete(child.value);
            //isStateChanged = true;
          });
        }
      }
    });
  
    // Update state only if there's a change
    //if (isStateChanged) {
      console.log("THIS IS THE FINAL VALUES TO BE SELECTED", Array.from(currentValueSet))
      setValue(Array.from(currentValueSet)); 
      // const updatedPreviousValue = new Set([...valAdded, ...currentValueSet]);
      // setPreviousValue(Array.from(updatedPreviousValue));
    //}
  };
  
  
  // const onChangeValue = (currentValue: ValueType[] | null) => {
  //   if (!userMadeChange.current) {
  //     console.log("USER MADE CHANGE IS TRUE AND CODE NOT RAN")
  //     // Change is not user-initiated, just return
  //     return;
  //   }
  //   userMadeChange.current = false;
  //   console.log("Value changed", currentValue);

  //   if (!currentValue) {
  //     if (previousValue.length > 0) {
  //       setPreviousValue([]);
  //       setValue([]);
  //     }
  //     return;
  //   }
  
  //   // Convert ValueType to strings for comparison
  //   const currentValueAsString = currentValue.map(value => value.toString());
  //   const previousValueSet = new Set<string>(previousValue);
  //   const currentValueSet = new Set<string>(currentValueAsString);
  
  //   let isStateChanged = false;
  
  //   // Handle selection of new values
  //   currentValueAsString.forEach(val => {
  //     if (!previousValueSet.has(val)) {
  //       const childItem = items.find(item => item.value === val && item.parent);
  //       if (childItem) {
  //         console.log("CHILD SELECT", val)
  //         // It's a child item, check if its parent is selected
  //         if (childItem.parent && !currentValueSet.has(childItem.parent)) {
  //           // Parent is not selected, select it
  //           currentValueSet.add(childItem.parent);
  //           isStateChanged = true;
  //         }
  //       }else{
  //         console.log("PARENT SELECT")
  //         const children = items.filter(item => item.parent === val);
  //         children.forEach(child => currentValueSet.add(child.value))
  //         isStateChanged = true;
  //       }
  //     }
  //   });
  
  //   // Handle deselection
  //   previousValue.forEach(val => {
  //     if (!currentValueSet.has(val)) {
  //       const childItem = items.find(item => item.value === val && item.parent);
  //       if (childItem) {
  //         console.log("deselecting child")
  //         // Child deselected, check if parent should be deselected
  //         const siblings = items.filter(item => item.parent === childItem.parent);
  //         const isAnySiblingSelected = siblings.some(sibling => currentValueSet.has(sibling.value));
  //         if (!isAnySiblingSelected) {
  //           // Deselect parent if no siblings are selected
  //           if (childItem.parent && currentValueSet.delete(childItem.parent)) {
  //             isStateChanged = true;
  //           }
  //         }
  //       } else {
  //         console.log("deselecting parent")
  //         // Parent deselected, deselect all children
  //         const children = items.filter(item => item.parent === val);
  //         children.forEach(child => {
  //           currentValueSet.delete(child.value);
  //           isStateChanged = true;
  //         });
  //       }
  //     }
  //   });
  
  //   // Update state only if there's a change
  //   if (isStateChanged) {
  //     setValue(Array.from(currentValueSet));
  //     setPreviousValue(currentValueAsString);
  //   }
  // // };
  

  const inviteLeader = (name: string, email: string) => {
    setItems([
      ...items,
      {
        label: name,
        value: email,
      },
    ]);

    setValue([...value, email]);
  }

  // async function sendEmailToLeader(email: string) {
  //   try {
  //     let res: Response = await customFetch(
  //         Endpoints.sendEmailToLeader,
  //         {
  //             method: "POST",
  //             body: {
  //               toLeaderEmail: email,
  //               postID: props.issue._id,
  //             },
  //         }
  //     );
  //     if (!res.ok) {
  //         const resJson = await res.json();
  //         console.error(resJson.error);
  //     } else {
  //         console.log("Email sent to leader");
  //     }
  //   } catch (error) {
  //     console.error("Network error, please try again later.", error);
  //   }
  // }

  const isLeaderSuggestedByAI = (leaderId: string) => {
    // Ensure that there is at least one suggested department and it has leaders
    if (props.issue.suggestedDepartments.length > 0 && props.issue.suggestedDepartments[0].leaders) {
      console.log("First suggested department:", props.issue.suggestedDepartments[0]); // Log the first suggested department
      console.log("Checking for leader ID:", leaderId); // Log the leader ID being checked
  
      return props.issue.suggestedDepartments[0].leaders.some(leader => leader._id === leaderId);
    }
    return false;
  };
  

  return (
    <View
      style={{
        borderColor: colors.lightestgray,
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        minHeight: open ? 255 : undefined,
        rowGap: 10,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "550",
          fontFamily: "Montserrat",
        }}
      >
        Assignees
      </Text>
      <DropDownPicker
        maxHeight={180}
        multipleText={`${value.length} ${
          value.length == 1 ? "leader" : "leaders"
        } selected`}
        searchable={true}
        searchTextInputStyle={{
          backgroundColor: colors.white,
          borderColor: colors.lightgray,
          borderWidth: 1,
          borderRadius: 10,
        }}
        searchContainerStyle={{
          borderBottomWidth: 1,
          paddingBottom: 7,
          paddingTop: 7,
          paddingHorizontal: 4,
          borderBottomColor: colors.lightergray,
          marginBottom: 5
        }}
        searchPlaceholder="Search..."
        // addCustomItem={true}
        multiple={true}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        categorySelectable={true}
        onSelectItem={onUserSelect}
        //onChangeValue={onChangeValue} // Custom logic for selection changes
        // onChangeValue={(currentValue) => {
        //   console.log("Current Value:", currentValue);
        //   // Add any additional logic you need to handle the value change
        // }}
        dropDownDirection="BOTTOM"
        listParentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          height: 20
        }}
        listParentLabelStyle={{
          fontWeight: "bold"
        }}
        listChildContainerStyle={{
          paddingLeft: 20,
          height: 30
        }}
        listChildLabelStyle={{
          color: "grey"
        }}
        style={{
          borderColor: colors.lightgray,
          borderWidth: 1,
          backgroundColor: colors.white,
          minHeight: 30,
        }}
        placeholder="Select users"
        textStyle={{
          fontSize: 15,
          color: colors.black,
          fontWeight: "500",
          fontFamily: "Montserrat",
        }}
        listMode="SCROLLVIEW"
        dropDownContainerStyle={[
          {
            borderTopWidth: 1,
            backgroundColor: colors.white,
            borderColor: colors.lightgray,
          },
        ]}
        ArrowDownIconComponent={() => (
          <FeatherIcon name={"chevron-down"} size={20} color={colors.gray} />
        )}
        ArrowUpIconComponent={() => (
          <FeatherIcon name={"chevron-up"} size={20} color={colors.gray} />
        )}
        TickIconComponent={() => (
          <FeatherIcon name={"check"} size={17} color={colors.gray} />
        )}
      />
      {value.map((item, index) => {
        return <ProfileRow name={item} key={index} />;
      })}
      <View>
        <OrFullWidth />
        <AddLeader inviteLeader={inviteLeader}/>
      </View>
    </View>
  );
};

export default Assignees;
