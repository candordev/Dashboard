import React, { useEffect, useRef, useState } from "react";
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

interface GroupedIssues {
  [key: string]: Post[];
}

const AllScreen = ({ navigation }: any) => {
  const [issues, setIssues] = useState<Post[]>([]);
  const [groupedIssues, setGroupedIssues] = useState<{ [key: string]: Post[] }>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    //console.debug('fetch posts running');
    try {
      const endpoint = Endpoints.getPostsByGroupWithoutLazyScroll;

      const searchParams = {
        groupID: constants.GROUP_ID,
        filterTime: "all",
        filter: "trendy",
      };

      const res: Response = await customFetch(endpoint, searchParams, {
        method: "GET",
      });

      const resJson = await res.json();
      if (!res.ok) {
        console.error("Error loading posts. Please try again later.");
      }
      if (res.ok) {
        const result: Post[] = resJson;
        setIssues([...result]);
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
      <Header />
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
            <FlashList
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

