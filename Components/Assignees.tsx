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
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
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
  const [previousValueChild, setPreviousChildValue] = useState<string[]>([]);

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
    //console.log("GROUP FOR A POST", props.issue.group)
    const departments: { [key: string]: Department } = {};
    const initialValues: string[] = [];
  
    props.leaders.forEach((leader) => {
      console.log("suggested should be running")
      const aiSuggests = isLeaderSuggestedByAI(leader.user);
  
      const departmentName = leader.departmentNames[0]
        if (!departments[departmentName]) {
          departments[departmentName] = {
            label: departmentName,
            value: departmentName,
            children: [],
            aiSuggests: aiSuggests,
          };
        } else if (aiSuggests) {
          departments[departmentName].aiSuggests = true;
        }
  
        departments[departmentName].children.push({
          label: leader.firstName,
          value: leader.username,
          parent: departmentName,
        });
  
        // If leader is accepted, add to initial values
        if (leader.acceptedPost) {
          currentSelectedChildrenRef.current.push(leader.username);
          previousValueRefChild.current.push(leader.username)
          previousValueRefChildB.current.push(leader.username)
          if(!initialValues.includes(leader.departmentNames[0])){
            initialValues.push(leader.departmentNames[0])
          }     
          initialValues.push(leader.username)
        }

    });
  
    const itemsArray: Item[] = Object.values(departments).sort((a, b) => {
      if (a.aiSuggests && !b.aiSuggests) return -1;
      if (!a.aiSuggests && b.aiSuggests) return 1;
      return 0;
    })
    .flatMap(department => {
      // Then map each department and its children to items
      return [
        {
          label: department.aiSuggests ? `${department.label} [AI suggests]` : department.label,
          value: department.value,
        },
        ...department.children.map(child => ({
          label: child.label,
          value: child.value,
          parent: department.value,
        }))
      ];
    });
  
    setItems(itemsArray);
    setValue(initialValues);
  }, [props.leaders]);
  



  const isString = (value: any): value is string => typeof value === 'string';


  useEffect(() => {
    console.log('Value state updated:', value);
        setPreviousValue(value);
        setPreviousChildValue(selectedChildren)
        previousValueRefChild.current = previousValueChild;

  }, [value, selectedChildren],);

  const previousValueRef = useRef<string[]>([]);
  const previousValueRefChild = useRef<string[]>([]);
  const previousValueRefChildB = useRef<string[]>([]);
  const currentSelectedChildrenRef = useRef<string[]>([]);


  useEffect(() => {
    // Update the ref when previousValue state changes
    previousValueRef.current = previousValue;
    previousValueRefChild.current = previousValueChild;
  }, [previousValue, previousValueChild]);
  

  const onCloseDropDown = async () => {
    const currentSelectedChildren = currentSelectedChildrenRef.current;
    const previousSelectedChildren = previousValueRefChildB.current;
  
    // Check if selectedChildren has changed
    const hasChildrenChanged = previousSelectedChildren.length !== currentSelectedChildren.length ||
                               previousSelectedChildren.some((child, index) => child !== currentSelectedChildren[index]);
  
    console.log("current child", currentSelectedChildren);
    console.log("previous child", previousSelectedChildren);
  
    if (hasChildrenChanged) {
      console.log("Selected children have changed. Making route call...");
      // Make your route call here

      try {
        let res = await customFetch(Endpoints.setAssignees, {
          method: "POST",
          body: JSON.stringify({
            postID: props.issue._id, 
            assignees: currentSelectedChildren, // Assuming issueId is available in this component
          }),
        });

        if (!res.ok) {
          const resJson = await res.json();
          console.error("Error adding ASSIGNEES:", resJson.error);
        } else {
          console.log("ASSIGNEES added successfully");
          //event.emit(eventNames.ISSUE_CATEGORY_SET);
          // You can handle any additional state updates or notifications here
        }
      } catch (error) {
        console.error("Network error, please try again later.", error);
      }


      // // ...

      // // Update the previousValueChild state
      setPreviousChildValue(currentSelectedChildren);
    } else {
      console.log("No change in selected children.");
    }

    previousValueRefChildB.current = currentSelectedChildrenRef.current;
  };
  

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
    const newSelectedChildren = new Set<string>(previousValueRefChild.current);
    console.log("initial children", newSelectedChildren)

  
  
    // Handle selection of new values
    currentValueAsString.forEach(val => {
      //currentValueSet.add(val);
      if (!previousValueSet.has(val)) {
        const childItem = items.find(item => item.value === val && item.parent);
        if (childItem) { 
          newSelectedChildren.add(childItem.value);    
          console.log("children after child ite selected", newSelectedChildren)  
          console.log("CHILD SELECT", val);
          if (childItem.parent && !currentValueSet.has(childItem.parent)) {
            currentValueSet.add(childItem.parent);
            //isStateChanged = true;
          }
        } else {   
          console.log("PARENT SELECT");
          const children = items.filter(item => item.parent === val);
          children.forEach(child => currentValueSet.add(child.value));
          children.forEach(child => newSelectedChildren.add(child.value));
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
          newSelectedChildren.delete(childItem.value)
          if (!isAnySiblingSelected) {
            if (childItem.parent && currentValueSet.delete(childItem.parent)) {
              
              
            }
          }
        } else {
          console.log("deselecting parent");
          const children = items.filter(item => item.parent === val);
          children.forEach(child => {
            currentValueSet.delete(child.value);
            newSelectedChildren.delete(child.value)
           
          });
        }
      }
    });
  
    // Update state only if there's a change
    //if (isStateChanged) {
      console.log("THIS IS THE FINAL VALUES TO BE SELECTED", Array.from(currentValueSet))
      setValue(Array.from(currentValueSet)); 
     
      console.log("set Selected Children",Array.from(newSelectedChildren))
      setSelectedChildren(Array.from(newSelectedChildren));
      currentSelectedChildrenRef.current = Array.from(newSelectedChildren);
      // const updatedPreviousValue = new Set([...valAdded, ...currentValueSet]);
      // setPreviousValue(Array.from(updatedPreviousValue));
    //}
  };
  
  

  const updateDropdownAndSelection = (departmentName: string, leaderFirstName: string, leaderEmail: string) => {
    let updatedItems = [...items];
    let departmentExists = updatedItems.some(item => item.label === departmentName);
    const newSelectedChildren = new Set<string>(previousValueRefChild.current);
  
    // if (!departmentExists) {
    //   // Add new department
    //   updatedItems.push({
    //     label: departmentName,
    //     value: departmentName
    //   });
    // }
    console.log("department exists", departmentExists)
    if(departmentExists){
      // Add new leader as a separate item with a parent property
      updatedItems.push({
        label: leaderFirstName,
        value: leaderEmail,
        parent: departmentName
      });
    }
  
    // Update items state
    setItems(updatedItems);
    newSelectedChildren.add(leaderEmail)
  
    // Update selected values to include new leader and department
    let updatedValue = [...value, departmentName, leaderEmail];
    setValue(updatedValue);
    setSelectedChildren(Array.from(newSelectedChildren))
  };
  
  

  const inviteLeader = async (firstName: string,lastName:string, departmentID: string, email: string, departmentName: string) => {
    await sendEmailToLeader(firstName, lastName, departmentID, email, departmentName);
  };

  async function sendEmailToLeader(firstName: string,lastName:string, departmentID: string, email: string, departmentName: string) {
    const currentSelectedChildren = currentSelectedChildrenRef.current;
    console.log("This is the department Name", departmentName)
    try {
      console.log("This is the email: ", email)
      console.log("This is the issue ID: ", props.issue._id)
      let res = await customFetch(Endpoints.sendEmailToLeader, {
        method: "POST",
        body: JSON.stringify({
          postID: props.issue._id, 
          toLeaderEmail: email, // Assuming issueId is available in this component
          firstName: firstName,
          lastName: lastName,
          departmentID: departmentID,
          email: email,
          groupID: props.issue.group._id,
          assigneeUsernames: currentSelectedChildren,
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error  EMAIL:", resJson.error);
      } else {
        console.log("EMAIL successfully");
        updateDropdownAndSelection(departmentName, firstName, email);
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  }

  const isLeaderSuggestedByAI = (leaderId: string) => {
    // Ensure that there is at least one suggested department and it has leaders
    console.log("suggested departments", props.issue.suggestedDepartments)
    //console.log("suggested departments", props.issue.suggestedDepartments)

    if (props.issue.suggestedDepartments.length > 0 && props.issue.suggestedDepartments[0].leaders.length > 0) {
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
        rowGap: 10,
        zIndex: 2,
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
        multipleText={`${selectedChildren.length} ${
          selectedChildren.length == 1 ? "leader" : "leaders"
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
        onClose={onCloseDropDown}
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
      {selectedChildren.map((item, index) => {
        return <ProfileRow name={item} key={index} />;
      })}
      <View>
    </View>
      <View>
        <OrFullWidth />
        <AddLeader inviteLeader={inviteLeader}  groupID={props.issue.group._id}/>
      </View>
    </View>
  );
};

export default Assignees;
