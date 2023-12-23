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
import 'react-datepicker/dist/react-datepicker.css';
import { GooglePlacesAutocomplete, GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import { getAuth } from "firebase/auth";



interface IssueRightViewProps {
    fetchStatusUpdates: () => void;
    issue: Post;
}

function IssueRightView(props: IssueRightViewProps): JSX.Element {
    const [leaders, setLeaders] = useState<UserProfile[]>([]);
    const [categories, setCategories] = useState<CategoryPost[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [idToken, setIdToken] = useState<string | ''>('');
    const [inputValue, setInputValue] = useState('');
    const [key, setKey] = useState(0); // Initialize a key state
    const auth = getAuth();
    // console.log("THIS IS THE AUTH", auth)

    useEffect(() => {
      // Fetch the ID token
      const fetchToken = async () => {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          console.log("DAA TOKEN", token)
          setIdToken(token);
        }
      };
      console.log("THE LOCATION INPUT VALUE: ", props.issue.neighborhood)
      setInputValue(props.issue.neighborhood)



      fetchToken();
    }, []);


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

    const handleSelect = async (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
      const address = data.description; // Or use details.formatted_address

      try {
          let res = await customFetch(Endpoints.setNeighborhood, {
              method: "POST",
              body: JSON.stringify({ address: address, postID: props.issue._id }),
          });

          if (!res.ok) {
              const resJson = await res.json();
              console.error("Error setting neighborhood:", resJson.error);
          } else {
              const resJson = await res.json();
              console.log("THE NEIGHBORHOOD: ",resJson.neighborhood )
              setInputValue(resJson.neighborhood); // Update the input box with the neighborhood
              setKey(prevKey => prevKey + 1);
          }
      } catch (error) {
          console.error("Network error, please try again later.", error);
      }
  };

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
                      marginTop: 7
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
            <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "550",
                      fontFamily: "Montserrat",
                      marginTop: 20,
                    }}
                  >
                    Select Location
            </Text>
            <GooglePlacesAutocomplete
                key={key} // Use the key here
                placeholder= {inputValue ? inputValue : 'Search'}
                onPress={handleSelect}
                query={{
                  key: 'AIzaSyD-DMOdct5BYGr0zv9UHIZ3Sk9ZWWdJEUY',
                  language: 'en',
                }}
                requestUrl={{
                  useOnPlatform: 'web', // or "all"
                  url:
                    'http://184.72.74.25:4000/api/userActivity/google-places-proxy', // or any proxy server that hits https://maps.googleapis.com/maps/api
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                      Authorization: 'Bearer ' + idToken,
                    },

                }}   
              />

            <View style={{ rowGap: 10 }}>
                <MarkDone fetchStatusUpdates={props.fetchStatusUpdates} issueId={props.issue._id}/>
                {/* <CloseIssue /> */}
            </View>
        </View>
    );
}

export default IssueRightView;
