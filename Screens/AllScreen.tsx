import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import Card from "../Components/Card";
import colors from "../Styles/colors";
import { Post, Department } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import Text from "../Components/Text";
import { FlashList } from "@shopify/flash-list";
import { constants } from "../utils/constants";
import Header from "../Components/Header";
import OuterView from "../Components/OuterView";
import styles from "../Styles/styles";
import { useUserContext } from "../Hooks/useUserContext";

interface GroupedIssues {
  [key: string]: Post[];
}


interface Status {
  newSelected: boolean;
  assignedSelected: boolean;
  updatedSelected: boolean;
  completedSelected: boolean;
}

const sampleStatus: Status = {
  newSelected: true,
  assignedSelected: true,
  updatedSelected: true,
  completedSelected: true,
};


// let user = {
//   username: resJson.username,
//   firstName: resJson.firstName,
//   lastName: resJson.lastName,
//   email: resJson.email,
//   dob: resJson.dateOfBirth,
//   token: token,
//   imageUrl: resJson.profilePicture,
//   candorPoints: resJson.candorPoints,
//   candorPointsByGroup: resJson.candorPointsByGroup,
//   totalCandorCoins: resJson.totalCandorCoins,
//   candorCoinsByGroup: resJson.candorCoinsByGroup,
//   bio: resJson.bio,
//   _id: resJson.user,
//   leaderPoints: resJson.leaderPoints,
//   leaderGroups: resJson.leaderGroups,
// };

const AllScreen = ({ navigation }: any) => {
  const [issues, setIssues] = useState<Post[]>([]);
  const [groupedIssues, setGroupedIssues] = useState<{ [key: string]: Post[] }>({});
  const { state, dispatch } = useUserContext();
  const [refreshKey, setRefreshKey] = useState(0);

  // useEffect(() => {
  //   console.log("First time loaded in DOM called")
  //   fetchPosts(sampleStatus);
  // }, []);

  const handleStatusChange = useCallback((status: Status) => {
    console.log("status changed", status);
    fetchPosts(status);
  }, []); // Empty dependency array ensures this function is created once and reused

  

  const fetchPosts = async (status: Status | undefined) => {
    //console.debug('fetch posts running');
    try {
      //const endpointDP = Endpoints.dashboardPosts;

      // Construct the query parameters
      const params = {
        filter: 'top',
        tab: 'all',
        //adminPassword: 'CandorDev345!'
        // status: JSON.stringify([
        //   status?.newSelected,
        //   status?.assignedSelected,
        //   status?.updatedSelected,
        //   status?.completedSelected,
        // ]),
      };
  
      // Construct the query string

      let res: Response = await customFetch(
        Endpoints.dashboardPosts +
          new URLSearchParams({
            filter: 'top',
            tab: 'all',     
            status: JSON.stringify([
              status?.newSelected,
              status?.assignedSelected,
              status?.updatedSelected,
              status?.completedSelected,
            ]),     
            //adminPassword: 'CandorDev345!',
            //user: '6551ed235e8ef7b3d6f1b7eb'
          }),
        {
          method: 'GET',
        },
      );

      // const queryString = new URLSearchParams(params).toString();
      // const url = `${endpointDP}?${queryString}`;
  
      // let res: Response = await customFetch(url, {
      //   method: "GET",
      // });
      let resJson = await res.json();
      if (!res.ok) {
        console.error("Error loading posts. Please try again later.");
      }
      if (res.ok) {
        console.log("GOT HERE YUH")
        const result: Post[] = resJson;
        setIssues([...result]);
        setRefreshKey(prevKey => prevKey + 1); // Increment the key to force update
        console.log("ISSUES WERE SET")
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    }
  };

  useEffect(() => {
    // Group posts by suggestedDepartment[0] or 'No Department'
    const newGroupedIssues = issues.reduce<GroupedIssues>((acc, issue) => {
      const department = issue.suggestedDepartments[0]?.name || 'No Department';
      if (!acc[department]) {
        acc[department] = [];
      }
      acc[department].push(issue);
      return acc;
    }, {});

    setGroupedIssues(newGroupedIssues);
  }, [issues]);

   return (
    <View style={{ flex: 1 }}>
       <Header onStatusChange={handleStatusChange} headerTitle={'All Issues'} />
       <ScrollView horizontal style={{ /* Add styles for the outer ScrollView if necessary */ }}>
        {Object.entries(groupedIssues).map(([departmentName, departmentIssues]) => (
          <View
            key={departmentName}
            style={{
              width: 400, // Set a specific width or use a percentage of the screen width
              marginHorizontal: 20, // Add horizontal margin to space out the columns
              // Add other styles as needed
            }}
          >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "550",
              color: colors.black,
              marginBottom: 10,
              marginTop: 10,
              fontFamily: "Montserrat",

            }}>{departmentName}</Text>
            {/* <FlashList
              data={departmentIssues}
              renderItem={({ item }) => <Card issue={item} />} */}
               <FlashList
                  key={`${departmentName}-${refreshKey}`} // Unique key for each FlashList
                  data={departmentIssues}
                  renderItem={({ item }) => <Card issue={item} />}
              // ... other FlashList props ...
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default AllScreen;

