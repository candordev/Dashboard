import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useUserContext } from "../Hooks/useUserContext";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { Post, UserProfile, emptyFields } from "../utils/interfaces";
import { customFetch } from "../utils/utils";
import AddLeader from "./AddLeader";
import OrFullWidth from "./OrFullWidth";
import OuterComponentView from "./PopoverComponentView";
import ProfileRow from "./ProfileRow";
import Text from "./Text";

interface AssigneesProps {
  issue?: Post;
  createPost: Boolean;
  onAssigneesChange?: (option: string[]) => void;
  onAssigneesChangeEmail?: (option: string) => void;
  style?: any;
}

function Assignees(props: AssigneesProps): JSX.Element {
  const { state, dispatch } = useUserContext();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
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
  const [previousValue, setPreviousValue] = useState<string[]>([]);
  const [previousValueChild, setPreviousChildValue] = useState<string[]>([]);
  const [leaders, setLeaders] = useState<UserProfile[]>([]);
  const [errorMessageLeader, setErrorMessageLeader] = useState<string>();

  useEffect(() => {
    console.log("selected children", selectedChildren);
  }, [selectedChildren]);

  useEffect(() => {
    setSelectedChildren([]);
    setPreviousChildValue([]);
    setPreviousValue([])
    setLeaders([])
    setValue([])
    setItems([])
    setOpen(false)
  }, [props.issue]);

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

  const fetchLeaders = async () => {
    try {
      console.log("THESE THE LEADER GROUPS", state.leaderGroups[0]);
      // Initialize URLSearchParams
      let params = new URLSearchParams({
        //page: "1",
        groupID: state.leaderGroups[0],
      });

      // Add postID only if props.issue is defined
      if (props.issue && props.issue._id) {
        params.append("postID", props.issue._id);
      }

      let endpoint = Endpoints.getGroupLeadersForAcceptCustom + params;

      const res = await customFetch(endpoint, {
        method: "GET",
      });

      const resJson = await res.json();
      if (!res.ok) {
        console.error(resJson.error);
        return;
      }

      const result = resJson; // Assuming resJson is an array of UserProfile
      console.log("leaders are", result);
      setLeaders(result);
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, [props.issue]);

  useEffect(() => {
    //console.log("GROUP FOR A POST", props.issue.group)
    const departments: { [key: string]: Department } = {};
    const initialValues: string[] = [];

    leaders.forEach((leader) => {
      console.log("suggested should be running");
      const aiSuggests = isLeaderSuggestedByAI(leader.user);

      const departmentName = leader.departmentNames[0];
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
        label: leader.firstName + " " + leader.lastName,
        value: leader.username,
        parent: departmentName,
      });

      // If leader is accepted, add to initial values
      if (leader.acceptedPost) {
        currentSelectedChildrenRef.current.push(leader.username);
        previousValueRefChild.current.push(leader.username);
        previousValueRefChildB.current.push(leader.username);
        if (!initialValues.includes(leader.departmentNames[0])) {
          initialValues.push(leader.departmentNames[0]);
        }
        initialValues.push(leader.username);
      }
    });

    const itemsArray: Item[] = Object.values(departments)
      .sort((a, b) => {
        if (a.aiSuggests && !b.aiSuggests) return -1;
        if (!a.aiSuggests && b.aiSuggests) return 1;
        return 0;
      })
      .flatMap((department) => {
        // Then map each department and its children to items
        return [
          {
            label: department.aiSuggests
              ? `${department.label} [AI suggests]`
              : department.label, //The reason for two sometimes is because a suggested leader can be part of multiple departments in database rn
            value: department.value,
          },
          ...department.children.map((child) => ({
            label: child.label,
            value: child.value,
            parent: department.value,
          })),
        ];
      });

    setItems(itemsArray);
    setValue(initialValues);
  }, [leaders]);

  const isString = (value: any): value is string => typeof value === "string";

  useEffect(() => {
    console.log("Value state updated:", value);
    setPreviousValue(value);
    setPreviousChildValue(selectedChildren);
    previousValueRefChild.current = previousValueChild;
  }, [value, selectedChildren]);

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
    console.log("Close dropdown", selectedChildren);
    if (!props.createPost && props.issue && props.issue._id) {
      const currentSelectedChildren = currentSelectedChildrenRef.current;
      const previousSelectedChildren = previousValueRefChildB.current;

      // Check if selectedChildren has changed
      const hasChildrenChanged =
        previousSelectedChildren.length !== currentSelectedChildren.length ||
        previousSelectedChildren.some(
          (child, index) => child !== currentSelectedChildren[index]
        );

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
    } else {
      const currentSelectedChildren = currentSelectedChildrenRef.current;
      if (props.onAssigneesChange) {
        props.onAssigneesChange(currentSelectedChildren);
      }
    }
  };

  const onUserSelect = (
    selectedItems: ItemType<string>[] | ItemType<string>
  ) => {
    console.log("Value changed", selectedItems);

    // Ensure selectedItems is always treated as an array
    const selectedArray = Array.isArray(selectedItems)
      ? selectedItems
      : [selectedItems];

    // Filter and convert to string array
    const currentValueAsString = selectedArray
      .map((obj) => obj.value)
      .filter(isString);

    console.log("Value changed", currentValueAsString);

    const previousValueSet = new Set<string>(previousValueRef.current);
    const currentValueSet = new Set<string>(previousValueRef.current);
    const currentValueB = new Set<string>(currentValueAsString);
    //const valAdded =  new Set<string>();
    console.log("previousValueSet", previousValueRef.current);
    const newSelectedChildren = new Set<string>(previousValueRefChild.current);
    console.log("initial children", newSelectedChildren);

    // Handle selection of new values
    currentValueAsString.forEach((val) => {
      //currentValueSet.add(val);
      if (!previousValueSet.has(val)) {
        const childItem = items.find(
          (item) => item.value === val && item.parent
        );
        if (childItem) {
          newSelectedChildren.add(childItem.value);
          console.log("children after child ite selected", newSelectedChildren);
          console.log("CHILD SELECT", val);
          if (childItem.parent && !currentValueSet.has(childItem.parent)) {
            currentValueSet.add(childItem.parent);
            //isStateChanged = true;
          }
        } else {
          console.log("PARENT SELECT");
          const children = items.filter((item) => item.parent === val);
          children.forEach((child) => currentValueSet.add(child.value));
          children.forEach((child) => newSelectedChildren.add(child.value));
          //isStateChanged = true;
        }
        console.log("This was THE value selected", val);
        //valAdded.add(val)
      }
    });

    // Handle deselection
    previousValueSet.forEach((val) => {
      if (!currentValueB.has(val)) {
        const childItem = items.find(
          (item) => item.value === val && item.parent
        );
        if (childItem) {
          console.log("deselecting child");
          const siblings = items.filter(
            (item) => item.parent === childItem.parent
          );
          const isAnySiblingSelected = siblings.some((sibling) =>
            currentValueB.has(sibling.value)
          );
          newSelectedChildren.delete(childItem.value);
          if (!isAnySiblingSelected) {
            if (childItem.parent && currentValueSet.delete(childItem.parent)) {
            }
          }
        } else {
          console.log("deselecting parent");
          const children = items.filter((item) => item.parent === val);
          children.forEach((child) => {
            currentValueSet.delete(child.value);
            newSelectedChildren.delete(child.value);
          });
        }
      }
    });

    // Update state only if there's a change
    //if (isStateChanged) {
    console.log(
      "THIS IS THE FINAL VALUES TO BE SELECTED",
      Array.from(currentValueSet)
    );
    setValue(Array.from(currentValueSet));

    console.log("set Selected Children", Array.from(newSelectedChildren));
    setSelectedChildren(Array.from(newSelectedChildren));
    currentSelectedChildrenRef.current = Array.from(newSelectedChildren);
    // const updatedPreviousValue = new Set([...valAdded, ...currentValueSet]);
    // setPreviousValue(Array.from(updatedPreviousValue));
    //}
  };

  const updateDropdownAndSelection = (
    departmentName: string,
    leaderFirstName: string,
    leaderEmail: string
  ) => {
    let updatedItems = [...items];
    let departmentExists = updatedItems.some(
      (item) => item.label === departmentName
    );
    const newSelectedChildren = new Set<string>(previousValueRefChild.current);

    // if (!departmentExists) {
    //   // Add new department
    //   updatedItems.push({
    //     label: departmentName,
    //     value: departmentName
    //   });
    // }
    console.log("department exists", departmentExists);
    if (departmentExists) {
      // Add new leader as a separate item with a parent property
      updatedItems.push({
        label: leaderFirstName,
        value: leaderEmail,
        parent: departmentName,
      });
    }

    // Update items state
    setItems(updatedItems);
    newSelectedChildren.add(leaderEmail);

    if (props.onAssigneesChange && props.createPost) {
      props.onAssigneesChange(Array.from(newSelectedChildren));
    }
    // Update selected values to include new leader and department
    let updatedValue = [...value, departmentName, leaderEmail];
    setValue(updatedValue);
    console.log(
      "set Selected Children in UPDATE DROPDOWN",
      Array.from(newSelectedChildren)
    );
    setSelectedChildren(Array.from(newSelectedChildren));
  };

  const inviteLeader = async (
    firstName: string,
    lastName: string,
    departmentID: string,
    email: string,
    departmentName: string
  ) => {
    if (!props.createPost) {
      await sendEmailToLeader(
        firstName,
        lastName,
        departmentID,
        email,
        departmentName
      );
    } else {
      await createLeaderAccount(
        firstName,
        lastName,
        departmentID,
        email,
        departmentName
      );
    }
  };
  const handleEmptyFields = (emptyFields: emptyFields) => {
    let errorMessage = "";

    if (emptyFields.firstName) {
      errorMessage += "First name, ";
    }
    if (emptyFields.lastName) {
      errorMessage += "Last name, ";
    }
    if (emptyFields.email) {
      errorMessage += "Email, ";
    }
    if (emptyFields.department) {
      errorMessage += "Department selection, ";
    }

    errorMessage += "is missing.";

    setErrorMessageLeader(errorMessage.trim());
  };

  async function createLeaderAccount(
    firstName: string,
    lastName: string,
    departmentID: string,
    email: string,
    departmentName: string
  ) {
    try {
      let res = await customFetch(Endpoints.addLeaderCreatePost, {
        method: "POST",
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          departmentID: departmentID,
          email: email,
          groupID: state.leaderGroups[0],
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with creating an account:", resJson.error);
      } else {
        updateDropdownAndSelection(departmentName, firstName, email);
        // if(props.onAssigneesChangeEmail){
        //   props.onAssigneesChangeEmail(email)
        // }
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  }

  async function sendEmailToLeader(
    firstName: string,
    lastName: string,
    departmentID: string,
    email: string,
    departmentName: string
  ) {
    if (!props.createPost && props.issue && props.issue._id) {
      const currentSelectedChildren = currentSelectedChildrenRef.current;
      console.log("This is the department Name", departmentName);
      try {
        console.log("This is the email: ", email);
        console.log("This is the issue ID: ", props.issue._id);
        let res = await customFetch(Endpoints.sendEmailToLeader, {
          method: "POST",
          body: JSON.stringify({
            postID: props.issue._id,
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
          setErrorMessageLeader(resJson.error);
        } else {
          setErrorMessageLeader("");
          console.log("EMAIL successfully");
          updateDropdownAndSelection(departmentName, firstName, email);
        }
      } catch (error) {
        console.error("Network error, please try again later.", error);
      }
    }
  }

  const isLeaderSuggestedByAI = (leaderId: string) => {
    if (!props.createPost && props.issue && props.issue._id) {
      // Ensure that there is at least one suggested department and it has leaders
      console.log("suggested departments", props.issue.suggestedDepartments);
      //console.log("suggested departments", props.issue.suggestedDepartments)

      if (
        props.issue.suggestedDepartments.length > 0 &&
        props.issue.suggestedDepartments[0].leaders.length > 0
      ) {
        console.log(
          "First suggested department:",
          props.issue.suggestedDepartments[0]
        ); // Log the first suggested department
        console.log("Checking for leader ID:", leaderId); // Log the leader ID being checked

        return props.issue.suggestedDepartments[0].leaders.some(
          (leader) => leader._id === leaderId
        );
      }
      return false;
    }
  };

  return (
    <OuterComponentView title="Assignees" style={props.style}>
      <DropDownPicker
        maxHeight={180}
        multipleText={`${selectedChildren.length} ${
          selectedChildren.length == 1 ? "leader" : "leaders"
        } selected`}
        searchable={true}
        searchTextInputStyle={{
          backgroundColor: colors.white,
          borderRadius: 10,
          borderWidth: 0,
        }}
        searchContainerStyle={{
          borderWidth: 0,
          paddingBottom: 7,
          paddingTop: 7,
          paddingHorizontal: 7,
          borderBottomColor: colors.lightergray,
          marginBottom: 5,
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
        dropDownDirection="BOTTOM"
        listParentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          height: 20,
        }}
        listParentLabelStyle={{
          fontWeight: "bold",
        }}
        listChildContainerStyle={{
          paddingLeft: 20,
          height: 30,
        }}
        listChildLabelStyle={{
          color: "grey",
        }}
        style={{
          borderWidth: open ? 1 : 0,
          borderColor: colors.lightergray,
          backgroundColor: colors.lightestgray,
          borderRadius: 15,
          minHeight: 37,
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
            borderWidth: open ? 1 : 0,
            backgroundColor: colors.lightestgray,
            borderColor: colors.lightergray,
            borderRadius: 15,
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
      <View></View>
      <View>
        <OrFullWidth />
        {errorMessageLeader && (
          <Text style={{ color: "red" }}>{errorMessageLeader}</Text>
        )}

        <AddLeader
          inviteLeaderMissingFields={handleEmptyFields}
          inviteLeader={inviteLeader}
          createPost={props.createPost}
        />
      </View>
    </OuterComponentView>
  );
}

export default Assignees;
