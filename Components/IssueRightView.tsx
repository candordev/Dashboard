import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Text from "./Text";
import colors from "../Styles/colors";
import ProfileRow from "./ProfileRow";
import Assignees from "./Assignees";
import Category from "./Category";
import MarkDone from "./MarkDone";
import CloseIssue from "./CloseIssue";
import SendTo from "./AddLeader";
import { CategoryPost, Post, UserProfile } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { constants } from "../utils/constants";
import { customFetch } from "../utils/utils";
import { useUserContext } from "../Hooks/useUserContext";
import DatePicker from 'react-datepicker';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import 'react-datepicker/dist/react-datepicker.css';


interface IssueRightViewProps {
    issue: Post;
}

function IssueRightView(props: IssueRightViewProps): JSX.Element {
    const [leaders, setLeaders] = useState<UserProfile[]>([]);
    const [categories, setCategories] = useState<CategoryPost[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());



    const handleDateChange = async (date: Date | null) => {
        
        try {
          let res = await customFetch(Endpoints.setDeadline, {
            method: "POST",
            body: JSON.stringify({
              postID: props.issue._id, 
              deadline: date, // Assuming issueId is available in this component
            }),
          });
  
          if (!res.ok) {
            const resJson = await res.json();
            console.error("Error adding DEADLINE:", resJson.error);
          } else {
            console.log("DEADLINE added successfully");
            setSelectedDate(date);
            //event.emit(eventNames.ISSUE_CATEGORY_SET);
            // You can handle any additional state updates or notifications here
          }
        } catch (error) {
          console.error("Network error, please try again later.", error);
        }

    };

    const {state, dispatch} = useUserContext();

    useEffect(() => {
      fetchLeaders();
      getCategories();
      console.log("THIS IS THE DEADLINE", props.issue.deadline)
      if(props.issue.deadline){
        setSelectedDate(new Date(props.issue.deadline));
      }else{
        setSelectedDate(null);
      }
     
    }, []);

    const fetchLeaders = async () => {
        try {
            console.log("THESE THE LEADER GROUPS", state.leaderGroups[0])
            let endpoint: string;
            endpoint =
              Endpoints.getGroupLeadersForAcceptCustom +
              new URLSearchParams({
                //page: "1",
                postID: props.issue._id,
              });
      
            const res: Response = await customFetch(endpoint, {
              method: 'GET',
            });

            const resJson = await res.json();
            if (!res.ok) {
              console.error(resJson.error);
            }
            if (res.ok) {
                const result: UserProfile[] = resJson;
                console.log("leaders are", result);

                setLeaders(result);
            }
        } catch (error) {
            console.error("Error loading posts. Please try again later.", error);
        }
    };

    const getCategories = async () => {
        try {
            console.log("THESE THE LEADER GROUPS", state.leaderGroups[0])
            let endpoint: string;
            endpoint =
              Endpoints.getCategoryForPost +
              new URLSearchParams({
                //page: "1",
                postID: props.issue._id,
              });
      
            const res: Response = await customFetch(endpoint, {
              method: 'GET',
            });

            const resJson = await res.json();
            if (!res.ok) {
              console.error(resJson.error);
            }
            if (res.ok) {
                const result: CategoryPost[] = resJson;
                console.log("CATEGORIES ARE...", result);

                setCategories(result);
            }
        } catch (error) {
            console.error("Error loading categories. Please try again later.", error);
        }
    };



    const suggestedDepartmentName = props.issue.suggestedDepartments?.[0]?.name || "No Department Suggested";

    return (
        <View
            style={{
                height: "100%",
                flex: 1,
                justifyContent: "space-between",
            }}
        >
            <View style={{ rowGap: 10 }}>
                <Assignees leaders={leaders} issue={props.issue}/>
                <Category issueId={props.issue._id} categories={categories}/>
                {/* <View style={{ marginTop: 10}}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'Montserrat' }}>
                    Candor Suggested To:
                    </Text>
                    <Text style={{ fontSize: 14, fontFamily: 'Montserrat' }}>
                    {suggestedDepartmentName}
                    </Text>
                </View> */}
                   <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "550",
                      fontFamily: "Montserrat",
                    }}
                  >
                    Select Deadline
                  </Text>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  showTimeSelect
                  dateFormat="Pp"
              />

            </View>  

            <View style={{ rowGap: 10 }}>
                <MarkDone />
                {/* <CloseIssue /> */}
            </View>
        </View>
    );
}

export default IssueRightView;
