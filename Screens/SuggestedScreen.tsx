import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import Card from "../Components/Card";
import Header from "../Components/Header";
import Text from "../Components/Text";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { Post, Status } from "../utils/interfaces";
import { customFetch } from "../utils/utils";

interface GroupedIssues {
  [key: string]: Post[];
}

const sampleStatus: Status = {
  newSelected: true,
  assignedSelected: true,
  updatedSelected: true,
  completedSelected: true,
};

const SuggestedScreen = ({ navigation }: any) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [categoriesWithPosts, setCategoriesWithPosts] = useState<{
    [key: string]: Post[];
  }>({});
  const [currStatus, setCurrStatus] = useState<Status>(sampleStatus);
  const [isVisible, setIsVisible] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [selectedHeaderOption, setSelectedHeaderOption] = useState<
  string | undefined
>('Tag');
const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<
string[] | undefined
>();

  const handlePopoverVisibilityChange = (
    isVisible: boolean | ((prevState: boolean) => boolean)
  ) => {
    setIsPopoverVisible(isVisible);
  };
  const isFocused = useIsFocused(); // Assuming you're using something like this

  useEffect(() => {
    console.log("Component mounted, fetching posts initially");

    console.log("Event triggered, fetching posts");
    fetchPosts(currStatus, selectedHeaderOption, selectedAssigneeIds);
  }, [currStatus, selectedHeaderOption, isFocused, selectedAssigneeIds ]);

  const handleStatusChange = async (newStatus: Status) => {
    console.log("Received status:", status);
    console.log("Current status:", currStatus);
    console.log("Status changed, updating current status and refetching posts");
    if (JSON.stringify(newStatus) !== JSON.stringify(currStatus)) {
      setCurrStatus(newStatus);
    }
  };
  const handleAssigneeSelection = (selectedAssigneeIds: string[]) => {
    console.log("Selected Assignees:", selectedAssigneeIds);
    setSelectedAssigneeIds(selectedAssigneeIds)
    // Perform actions with the selected IDs, like updating state or making API calls
  };

  const handleHeaderOptionChange = (option: string) => {
    if (JSON.stringify(option) !== JSON.stringify(selectedHeaderOption)) {
      setSelectedHeaderOption(option);
    }
    // Additional logic if needed
  };

  const fetchPosts = async (
    status: Status | undefined,
    headerOption?: string,
    selectedAssigneeIds?: string[]
  ) => {
    try {
      if(selectedAssigneeIds == undefined){
        selectedAssigneeIds = []
      }
      console.log("THE HEADER OPTION", headerOption);
      const queryParams = new URLSearchParams({
        filter: "top",
        tab: "suggested",
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
        console.log("appended");
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
        onAssigneeSelection={handleAssigneeSelection}
        onStatusChange={handleStatusChange}
        headerTitle={"Suggested Issues"}
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
              //estimatedItemSize={135} // Adjust this value based on your average item size
              // ... other FlashList props ...
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default SuggestedScreen;
