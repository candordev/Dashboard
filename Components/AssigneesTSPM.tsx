import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
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
import { values } from "lodash";

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
    { label: "Akshat Pant", value: "Akshat Pant"},
    { label: "Department A", value: "Department A" },
    { label: "Department B", value: "Department B" },
    {
      label: "Tanuj Dunthuluri",
      value: "Tanuj Dunthuluri",
      parent: "Department B",
    },
    { label: "Srikar Parsi", value: "Srikar Parsi" },
  ]);

  const [leaders, setLeaders] = useState<UserProfile[]>([]);
  const [errorMessageLeader, setErrorMessageLeader] = useState<string>();

  useEffect(() => {
    setSelectedChildren([]);
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
      setLeaders([]);
      setSelectedChildren([]);
      // console.log("THESE THE LEADER GROUPS",state.currentGroup);
      // Initialize URLSearchParams
      let params = new URLSearchParams({
        //page: "1",
        groupID: state.currentGroup,
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
    const initialValues: string[] = [];
    const itemsArray: Item[] = leaders
      .filter(leader => leader.username !== "CandorTeamTSPM") // Filter out CandorTeamTSPM
      .map((leader) => ({
        label: `${leader.firstName} ${leader.lastName}`,
        value: leader.username,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  
    console.log("Items without parents:", itemsArray);
  
    // Populate initial values with accepted leaders
    leaders.forEach((leader) => {
      if (leader.acceptedPost) {
        initialValues.push(leader.username);
      }
    });
  
    setItems(itemsArray);
    console.log("Initial Values!!: ", initialValues);
    setValue(initialValues);
  }, [leaders]);
  

  const isString = (value: any): value is string => typeof value === "string";







//   const onCloseDropDown = async () => {
//     console.log("Close dropdown", selectedChildren);
//     if (!props.createPost && props.issue && props.issue._id) {


//       if (hasChildrenChanged) {
//         // console.log("Selected children have changed. Making route call...");
//         // Make your route call here

//         try {
//           let res = await customFetch(Endpoints.setAssignees, {
//             method: "POST",
//             body: JSON.stringify({
//               postID: props.issue._id,
//               assignees: currentSelectedChildren, // Assuming issueId is available in this component
//             }),
//           });

//           if (!res.ok) {
//             const resJson = await res.json();
//             console.error("Error adding ASSIGNEES:", resJson.error);
//           } else {
//             // console.log("ASSIGNEES added successfully");
//             //event.emit(eventNames.ISSUE_CATEGORY_SET);
//             // You can handle any additional state updates or notifications here
//           }
//         } catch (error) {
//           console.error("Network error, please try again later.", error);
//         }

//         // // ...

//         // // Update the previousValueChild state
//         setPreviousChildValue(currentSelectedChildren);
//       } else {
//         // console.log("No change in selected children.");
//       }

//       previousValueRefChildB.current = currentSelectedChildrenRef.current;
//     } else {
//       const currentSelectedChildren = currentSelectedChildrenRef.current;
//       if (props.onAssigneesChange) {
//         props.onAssigneesChange(currentSelectedChildren);
//       }
//     }
//   };


  const onUserSelect = async (
    selectedItems: ItemType<string>[] | ItemType<string>
  ) => {
    console.log("SELECT IS RUNNING!!!", selectedItems);
  
    // Ensure selectedItems is treated as an array
    const selectedArray = Array.isArray(selectedItems)
      ? selectedItems
      : [selectedItems];
  
    // Convert to a string array and filter
    const currentValueAsString = selectedArray
      .map((obj) => obj.value)
      .filter(isString);
  
    console.log("Selected Items:", currentValueAsString);


        try {
        if (!props.createPost && props.issue && props.issue._id) {
            let res = await customFetch(Endpoints.setAssignees, {
                method: "POST",
                body: JSON.stringify({
                postID: props.issue._id,
                assignees: currentValueAsString, // Assuming issueId is available in this component
                }),
            });

            if (!res.ok) {
                const resJson = await res.json();
                console.error("Error adding ASSIGNEES:", resJson.error);
            } else {
                // console.log("ASSIGNEES added successfully");
                //event.emit(eventNames.ISSUE_CATEGORY_SET);
                // You can handle any additional state updates or notifications here
            }
            }
        } catch (error) {
          console.error("Network error, please try again later.", error);
        }
  
    // Set the state directly
    //setValue(currentValueAsString);
  
    setSelectedChildren(currentValueAsString); // To manage selected children state
  };
  

//   const updateDropdownAndSelection = (
//     departmentName: string,
//     leaderFirstName: string,
//     leaderEmail: string
//   ) => {
//     let updatedItems = [...items];
//     let departmentExists = updatedItems.some(
//       (item) => item.label === departmentName
//     );
//     const newSelectedChildren = new Set<string>(previousValueRefChild.current);

//     // if (!departmentExists) {
//     //   // Add new department
//     //   updatedItems.push({
//     //     label: departmentName,
//     //     value: departmentName
//     //   });
//     // }
//     // console.log("department exists", departmentExists);
//     if (departmentExists) {
//       // Add new leader as a separate item with a parent property
//       updatedItems.push({
//         label: leaderFirstName,
//         value: leaderEmail,
//         parent: departmentName,
//       });
//     }

//     // Update items state
//     setItems(updatedItems);
//     newSelectedChildren.add(leaderEmail);

//     if (props.onAssigneesChange && props.createPost) {
//       props.onAssigneesChange(Array.from(newSelectedChildren));
//     }
//     // Update selected values to include new leader and department
//     let updatedValue = [...value, departmentName, leaderEmail];
//     setValue(updatedValue);
//     // console.log(
//     //   "set Selected Children in UPDATE DROPDOWN",
//     //   Array.from(newSelectedChildren)
//     // );
//     setSelectedChildren(Array.from(newSelectedChildren));
//   };

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
    await fetchLeaders();
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
          groupID:state.currentGroup,
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with creating an account:", resJson.error);
      } else {
        //updateDropdownAndSelection(departmentName, firstName, email);
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
      //const currentSelectedChildren = currentSelectedChildrenRef.current;
      // console.log("This is the department Name", departmentName);
      try {
        // console.log("This is the email: ", email);
        // console.log("This is the issue ID: ", props.issue._id);
        let res = await customFetch(Endpoints.sendEmailToLeader, {
          method: "POST",
          body: JSON.stringify({
            postID: props.issue._id,
            firstName: firstName,
            lastName: lastName,
            departmentID: departmentID,
            email: email,
            groupID: props.issue.group._id,
            //assigneeUsernames: currentSelectedChildren,
          }),
        });

        if (!res.ok) {
          const resJson = await res.json();
          console.error("Error  EMAIL:", resJson.error);
          setErrorMessageLeader(resJson.error);
        } else {
          setErrorMessageLeader("");
          // console.log("EMAIL successfully");
          //updateDropdownAndSelection(departmentName, firstName, email);
        }
      } catch (error) {
        console.error("Network error, please try again later.", error);
      }
    }
  }

  return (
    <OuterComponentView title="Assignees" style={[props.style, {maxHeight: 600, flexGrow: 1}]}>
      <DropDownPicker
        maxHeight={180}
        multipleText={`${value.length} ${
          value.length == 1 ? "leader" : "leaders"
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
        //categorySelectable={true}
        onSelectItem={onUserSelect}
        //onClose={onCloseDropDown}
        dropDownDirection="BOTTOM"
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
      <ScrollView>
      {
        value.map((username, index) => {
          // Find the leader corresponding to the username
          const leader = leaders.find(leader => leader.username === username);
          // Assuming leader is always found. You might want to handle the case where a leader is not found
          const name = leader ? `${leader.firstName} ${leader.lastName}` : 'Loading...';
          const profilePicture = leader ? leader.profilePicture : 'defaultProfilePictureUrl'; // Provide a default profile picture URL or handle it in ProfileRow

          return <ProfileRow name={name} profilePicture={profilePicture} key={index} />;
        })
      }
      </ScrollView>
      <View>
      </View>
      <View>
        {/* <OrFullWidth />
        {errorMessageLeader && (
          <Text style={{ color: "red" }}>{errorMessageLeader}</Text>
        )}
        <ScrollView>
        <AddLeader
          inviteLeaderMissingFields={handleEmptyFields}
          inviteLeader={inviteLeader}
          createPost={props.createPost}
          emailImport=""
        />
        </ScrollView> */}
      </View>
    </OuterComponentView>
  );
}

export default Assignees;

