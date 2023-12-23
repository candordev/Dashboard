import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import Card from "../Components/Card";
import Header from "../Components/Header";
import Text from "../Components/Text";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { Post } from "../utils/interfaces";
import { customFetch } from "../utils/utils";
import { ProgressSelector } from "../utils/interfaces";

const AllScreen = ({ navigation }: any) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [categoriesWithPosts, setCategoriesWithPosts] = useState<{
    [key: string]: Post[];
  }>({});
  const [currStatus, setCurrStatus] = useState<ProgressSelector>({
    newSelected: true,
    assignedSelected: true,
    updatedSelected: true,
    completedSelected: true,
  });
  const [selectedHeaderOption, setSelectedHeaderOption] = useState<
    string | undefined
  >('Tag');
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<
  string[] | undefined
>();

  const isFocused = useIsFocused(); // Assuming you're using something like this

  useEffect(() => {
    console.log("Component mounted, fetching posts initially");

    console.log("Event triggered, fetching posts");
    fetchPosts(currStatus, selectedHeaderOption, selectedAssigneeIds);
  }, [currStatus, selectedHeaderOption, isFocused, selectedAssigneeIds ]); // Depend on currStatus to refetch when it changes

  const handleStatusChange = async (newStatus: ProgressSelector) => {
    console.log("Received status:", status);
    console.log("Current status:", currStatus);
    console.log("Status changed, updating current status and refetching posts");
    if (JSON.stringify(newStatus) !== JSON.stringify(currStatus)) {
      setCurrStatus(newStatus);
    }
  };

  const handleHeaderOptionChange = (option: string) => {
    if (JSON.stringify(option) !== JSON.stringify(selectedHeaderOption)) {
      setSelectedHeaderOption(option);
    }
    // Additional logic if needed
  };


  const handleAssigneeSelection = (selectedAssigneeIds: string[]) => {
    console.log("Selected Assignees:", selectedAssigneeIds);
    setSelectedAssigneeIds(selectedAssigneeIds)
    // Perform actions with the selected IDs, like updating state or making API calls
  };
  const fetchPosts = async (
    status: ProgressSelector | undefined,
    headerOption?: string,
    selectedAssigneeIds?: string[]
  ) => {
    try {
      console.log("THE SELECTED ID's FOR ASSIGNEES", selectedAssigneeIds)
      if(selectedAssigneeIds == undefined){
        selectedAssigneeIds = []
      }
      const queryParams = new URLSearchParams({
        filter: "top",
        tab: "all",
        assignees: JSON.stringify(selectedAssigneeIds),
        status: JSON.stringify([
          status?.newSelected,
          status?.assignedSelected,
          status?.updatedSelected,
          status?.completedSelected,
        ]),
      });

      // Add selectedHeaderOption to the query params if it's defined
      if (headerOption) {
        queryParams.append("header", headerOption);
      }

      let res: Response = await customFetch(
        `${Endpoints.dashboardPosts}?${queryParams.toString()}`,
        {
          method: "GET",
        }
      );

      let resJson = await res.json();
      if (res.ok) {
        console.log("resJson DEBUG: ", resJson )
        setCategoriesWithPosts(resJson);
        setRefreshKey((prevKey) => prevKey + 1); // Increment key to force update
      } else {
        console.error("Error loading posts. Please try again later.");
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    }
  };

  const handlePopoverClose = () => {
    fetchPosts(currStatus, selectedHeaderOption);
  };
  const [groupID, setGroupID] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Function to find the first groupID
    const findFirstGroupID = () => {
      for (const category in categoriesWithPosts) {
        const posts = categoriesWithPosts[category];
        if (posts.length > 0 && posts[0].group._id) {
          return posts[0].group._id; // Return the first found groupID
        }
      }
      return undefined; // Return undefined if no groupID is found
    };

    // Set the groupID when categoriesWithPosts changes
    const firstGroupID = findFirstGroupID();
    setGroupID(firstGroupID);
  }, [categoriesWithPosts]);

  return (
    <View style={{ flex: 1 }}>
      <Header
        onHeaderOptionChange={handleHeaderOptionChange}
        onStatusChange={handleStatusChange}
        onAssigneeSelection={handleAssigneeSelection}
        headerTitle={"All Issues"}
        groupID={groupID}
      />
      <ScrollView
        horizontal
        style={
          {
            /* Add styles if necessary */
          }
        }
      >
        {Object.entries(categoriesWithPosts).map(([name, posts]) => (
          <View
            key={name}
            style={{
              width: 400, // Adjust as needed
              marginHorizontal: 20,
              // Other styles
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
              }}
            >
              {name}
            </Text>
            <FlatList
              key={`${name}-${refreshKey}`}
              data={posts}
              renderItem={({ item }) => (
                <Card issue={item} onPopoverClose={handlePopoverClose} />
              )}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default AllScreen;
