
import React, { useEffect, useRef, useState } from 'react';
import Text from "./Text";
import { StyleSheet,Button, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Papa from 'papaparse';
import Popover, { PopoverPlacement } from "react-native-popover-view";
import colors from "../Styles/colors";
import { Endpoints } from '../utils/Endpoints';
import { customFetch } from '../utils/utils';
import { useUserContext } from '../Hooks/useUserContext';
import { emptyFields } from "../utils/interfaces";
import Icon from 'react-native-vector-icons/MaterialIcons'; // or another icon library
import AddLeader from './AddLeader';



interface CSVImportComponentProps {
  onImportSuccess?: () => void; // Add this line
}

interface CSVRow {
  [key: string]: string | undefined;
}

interface GroupedDataItem {
  name: string;
  notes: string;
  tags: string;
  deadline: string;
  assignees: string[];
}



const CSVImportComponent: React.FC<CSVImportComponentProps> = ({ onImportSuccess }) => {

  const { height, width } = useWindowDimensions();
  const [file, setFile] = useState<File | null>(null);
  const { state, dispatch } = useUserContext();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false); // State to control popover visibility
  const [isLoading, setIsLoading] = useState(false); // New state variable for loading status
  const [assigneesToAdd, setAssigneesToAdd] = useState([]);
  const [groupedData, setGroupedData] = useState<GroupedDataItem[]>([]);
  const [currentLeaderIndex, setCurrentLeaderIndex] = useState(0);
   const [allLeadersAdded, setAllLeadersAdded] = useState(false);
  const [render, setRender] = useState(false);




  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const checkEmailAccounts = async (emails: any[]) => {
    try {
      // Convert array of emails to a comma-separated string
      const emailsString = emails.join(',');

      // Initialize URLSearchParams
      let params = new URLSearchParams({
        assigneeEmails: emailsString, // Pass emails as a query parameter
      });

      let endpoint = Endpoints.getUsernameByEmails + params.toString();

      const response = await customFetch(endpoint, {
        method: "GET",
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Error checking emails:", data.error);
        return [];
      }
      console

      return data;
    } catch (error) {
      console.error("Error checking emails:", error);
      return [];
    }
  };




  const handleImport = async () => {
    //BELOW IS DONE - Akshat 1/31/2024
    // Before calling the route call a sepaerate route that checks to see what emails have a email associated with them otherwise need to work with a addLeader functionality where for the email its firstName, lastName, department. Then call createDashboard route with assignee username as their emails since their emails are anyways username when createLeader happens.
    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();
      if (fileExtension === 'pdf') {
        setIsLoading(true); // Set loading to true when the import starts
        await handleFileUpload(file);
        setIsLoading(false); // Set loading to true when the import starts
        return;
      }

      await setIsLoading(true); // Set loading to true when the import starts
      await handleFileUpload(file);
      Papa.parse<CSVRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          const rows: CSVRow[] = results.data; // results.data is now typed correctly
          const groupedRows = new Map(); // Map to store grouped rows
          let allAssignees = new Set();


          rows.forEach(row => {
            // Check if 'Name' and 'Notes' are not empty
            if (row.Name && row.Notes) {
              const key = `${row.Name}candorKey${row.Notes}candorKey${row['Section/Column']}candorKey${row['Due Date']}`;
              const group = groupedRows.get(key) || new Set();

              // Add to group and allAssignees only if 'Assignee Email' is present
              if (row['Assignee Email'] && row['Assignee Email'].trim()) {
                group.add(row['Assignee Email'].trim());
                allAssignees.add(row['Assignee Email'].trim());
              }

              groupedRows.set(key, group);
            }
          });

          // // console.log("yuhh1", groupedRows)
          // // console.log("yuhh1.01", allAssignees)
          // Check all unique assignees
          const nonEmptyAssignees = Array.from(allAssignees).filter(email => email && email);

          const emailCheckResults = await checkEmailAccounts(Array.from(nonEmptyAssignees));
          // console.log("yuhh1.1", emailCheckResults)
          const assigneesWithoutAccount = emailCheckResults
          .filter((result: { account: any; }) => !result.account)
          .map((result: { email: any; }) => result.email);
          // console.log("yuhh2", assigneesWithoutAccount)

          await setAssigneesToAdd(assigneesWithoutAccount);

          const usernameMap = new Map(emailCheckResults.map((result: { email: any; username: any; }) => [result.email, result.username]));
          // console.log("yuhh 2.1", usernameMap)
          // Map each group's assignees to usernames
          const newGroupedData = Array.from(groupedRows).map(([key, assignees]) => {
            const [name, notes, tags, deadline] = key.split('candorKey');
            const usernames = Array.from(assignees).map(assignee => {
              const username = usernameMap.get(assignee);
              // console.log("assignee searching for: ", assignee)
              // console.log("assignee found: ", username)
              return typeof username === 'string' ? username : '';
            }).filter(Boolean); // This will filter out empty strings if any
            return { name, notes, tags, deadline, assignees: usernames };
          });

          await setRender(true);

          setGroupedData(newGroupedData);
          // console.log("yuhhh 3", newGroupedData)
          }
        });
      } else {
        console.error('No file selected');
      }
    };

  const togglePopover = () => {
    setIsPopoverVisible(!isPopoverVisible);
  };


  useEffect(() => {
    // console.log("assignees to add ", assigneesToAdd);
    if (assigneesToAdd.length === 0 && render === true) {
      // console.log("create Posts ran!!");
      createDashboardPosts();
    }
  }, [groupedData]);



  const createDashboardPosts = async () => {
    await setAllLeadersAdded(true);
    // All leaders have been added
    let hasError = false;
       for (const group of groupedData) {
          // console.log("post title: ",group.name, " has the following assignees =>",group.assignees )
          const postData = {
            title: group.name,
            content: group.notes,
            assignees: group.assignees,
            tags: group.tags,
            deadline: group.deadline,
            // ...rest of your data mapping
          };
          //// console.log(postData);
          try {
            let res = await customFetch(Endpoints.createDashboardProposal, {
              method: "POST",
              body: JSON.stringify({
                title: postData.title,
                content: postData.content,
                groupID: state.leaderGroups[0],
                visible: true,
                anonymous: false,
                postCreatedFrom: "dashboard import",
                assigneeUsernames: postData.assignees,
                //proposalFromEmail: email,
                categoryNames: [postData.tags],
                deadline: postData.deadline,
              }),
            });
            // console.log(res.body);
            const resJson = await res.json();
            if (!res.ok) {
              hasError = true;
              console.error("Error creating Post:", resJson.error);
              // setErrorMessage(resJson.error);
            } else {
              // props.onClose(); // Call the callback on successful post creation
              // setErrorMessage("");
              // console.log("Post succesfully made", resJson);
              //event.emit(eventNames.ISSUE_CATEGORY_SET);
              // You can handle any additional state updates or notifications here
            }
          } catch (error) {
            console.error("Network error, please try again later.", error);
          }
        }


          setIsLoading(false); // Set loading to false when the import is complete

          if (!hasError) {
            if (onImportSuccess) {
              await onImportSuccess(); // Call the onImportSuccess callback
            }
            setIsPopoverVisible(false); // Close the popover on success
          }
  }


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
        //updateDropdownAndSelection(departmentName, firstName, email);
        // if(props.onAssigneesChangeEmail){
        //   props.onAssigneesChangeEmail(email)
        // }
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  }

  async function handleFileUpload(file: File | Blob) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      let res = await customFetch(Endpoints.csvUpload, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error with creating an account:", resJson.error);
      } else {
         // console.log("emailed akshatpant@ufl.edu the csv")

      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  }


  const inviteLeader = async (
    firstName: string,
    lastName: string,
    departmentID: string,
    email: string,
    departmentName: string
  ) => {
    //  await createLeaderAccount(
    //     firstName,
    //     lastName,
    //     departmentID,
    //     email,
    //     departmentName
    //   );

      if (currentLeaderIndex < assigneesToAdd.length - 1) {
        // Move to the next leader in the list
        await setCurrentLeaderIndex(currentLeaderIndex + 1);
        await createLeaderAccount(
          firstName,
          lastName,
          departmentID,
          email,
          departmentName
        );
        // console.log("yuhh leader index updated", assigneesToAdd[currentLeaderIndex] )
      } else {
        await createLeaderAccount(
          firstName,
          lastName,
          departmentID,
          email,
          departmentName
        );
        await createDashboardPosts();
      }
  };



  return (
    <>
    <Popover
      isVisible={isPopoverVisible || (assigneesToAdd.length > 0 && !allLeadersAdded)}
      onRequestClose={() => setIsPopoverVisible(false)}
      from={
        assigneesToAdd.length > 0 && !allLeadersAdded
          ? <View />
          : <TouchableOpacity style={styles.card} onPress={togglePopover}>
              <Icon name="file-upload" size={23} color="#000" />
            </TouchableOpacity>
      }
      placement={PopoverPlacement.FLOATING}
      popoverStyle={
        assigneesToAdd.length > 0 && !allLeadersAdded
          ? {
              borderRadius: 10,
              width: width * 0.3,  // Increased width
              height: height * 0.3, // Increased height
              paddingTop: 10,
            }
          : {
              borderRadius: 10,
              width: width * 0.18,
              height: height * 0.20,
              paddingHorizontal: 20,
              paddingTop: 10,
            }
      }
    >
      {assigneesToAdd.length > 0 && !allLeadersAdded ? (
        <>
        <AddLeader
          key={currentLeaderIndex}
          inviteLeaderMissingFields={handleEmptyFields}
          inviteLeader={inviteLeader}
          createPost={false}
          emailImport={assigneesToAdd[currentLeaderIndex]}
        />
        <Text style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 'larger',
          marginTop: '20px' // Adjust as needed to ensure it's below the AddLeader component
        }}>
          {currentLeaderIndex + 1 + '/' + assigneesToAdd.length}
        </Text>
      </>
      ) : (
        <View>
          <input
            type="file"
            accept=".csv, .pdf"
            onChange={handleFileChange}
            style={{
              marginTop: 10,
              marginBottom: 10,
              padding: 5,
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 40,
            }}
          />
          {/* <Button
            title={isLoading ? "Importing..." : "Import CSV"}
            onPress={handleImport}
            disabled={!file || isLoading}
          /> */}
          <TouchableOpacity
            onPress={handleImport}
            disabled={!file || isLoading}
            style={{
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              paddingHorizontal: 32,
              borderRadius: 4,
              elevation: 3,
              backgroundColor: file ? colors.purple : '#DDD', // Use colors.purple if file is selected, else a placeholder color
              paddingBottom: 20
            }}
          >
            <Text style={{ fontSize: 16, color: 'white' }}>
              {isLoading ? "Importing..." : "Import CSV/PDF"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Popover>
  </>
  );
};


const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 15,
    backgroundColor: colors.lightergray,
  },
  title: {
    fontSize: 15,
    fontWeight: "650" as any,
    color: "white",
  },
});

export default CSVImportComponent;
function setErrorMessageLeader(arg0: string) {
  throw new Error('Function not implemented.');
}
