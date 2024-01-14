import React, { useState } from 'react';
import Text from "./Text";
import { StyleSheet,Button, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Papa from 'papaparse';
import Popover, { PopoverPlacement } from "react-native-popover-view";
import colors from "../Styles/colors";
import { Endpoints } from '../utils/Endpoints';
import { customFetch } from '../utils/utils';
import { useUserContext } from '../Hooks/useUserContext';

interface CSVImportComponentProps {
  onImportSuccess?: () => void; // Add this line
}

interface CSVRow {
  [key: string]: string | undefined;
}



const CSVImportComponent: React.FC<CSVImportComponentProps> = ({ onImportSuccess }) => {

  const { height, width } = useWindowDimensions();
  const [file, setFile] = useState<File | null>(null);
  const { state, dispatch } = useUserContext();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false); // State to control popover visibility
  const [isLoading, setIsLoading] = useState(false); // New state variable for loading status



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleImport = () => {
    if (file) {
      setIsLoading(true); // Set loading to true when the import starts
      Papa.parse<CSVRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const rows: CSVRow[] = results.data; // results.data is now typed correctly
          let hasError = false;
          rows.forEach(async row => {
            const postData = {
              title: row.Name, // Assuming 'Name' is a header in the CSV file
              content: row.Notes, // Assuming 'Notes' is a header in the CSV file
              tags: row['Section/Column'], // Assuming 'Section/Column' is a header in the CSV file
              deadline: row['Due Date'], // Assuming 'Due Date' is a header in the CSV file
              // ...rest of your data mapping
            };
  
            console.log(postData);
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
                  //proposalFromEmail: email,
                  categoryNames: [postData.tags],
                  deadline: postData.deadline,
                }),
              });
              console.log(res.body);
              const resJson = await res.json();
              if (!res.ok) {
                hasError = true;
                console.error("Error creating Post:", resJson.error);
                // setErrorMessage(resJson.error);
              } else {
                // props.onClose(); // Call the callback on successful post creation
                // setErrorMessage("");
                console.log("Post succesfully made", resJson);
                //event.emit(eventNames.ISSUE_CATEGORY_SET);
                // You can handle any additional state updates or notifications here
              }
            } catch (error) {
              console.error("Network error, please try again later.", error);
            }

            setIsLoading(false); // Set loading to false when the import is complete

            if(!hasError){
              if (onImportSuccess) {
                await onImportSuccess(); // Call the onImportSuccess callback
              }
              setIsPopoverVisible(false); // Close the popover on success
            }       
            // TODO: Call your createDashboardProposal route with postData
          });

        },
        error: function (error) {
          console.error('Error while parsing CSV: ', error.message);
        }
      });
    } else {
      console.error('No file selected');
    }
  };

  const togglePopover = () => {
    setIsPopoverVisible(!isPopoverVisible);
  };
  

  return (  
    <>
    <Popover
        isVisible={isPopoverVisible}
        onRequestClose={() => setIsPopoverVisible(false)} // Allow closing the popover
          from={
            <TouchableOpacity style={styles.card}  onPress={togglePopover}>
              <Text style={styles.title}>Import CSV</Text>
            </TouchableOpacity>
          }
          placement={PopoverPlacement.FLOATING}
            popoverStyle={{
              borderRadius: 10,
              width: width * 0.16,
              height: height * 0.18,
            }}
    >
       <View>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{
              marginTop: 10,
              marginBottom: 80,
              padding: 5,
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 5,
            }}
          />
          <Button
            title={isLoading ? "Importing..." : "Import CSV"}
            onPress={handleImport}
            disabled={!file || isLoading}
          />
        </View>
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
    backgroundColor: colors.purple,
  },
  title: {
    fontSize: 15,
    fontWeight: "650" as any,
    color: "white",
  },
});

export default CSVImportComponent;
