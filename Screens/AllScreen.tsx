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
import OuterView from "../Components/OuterView";
import { useUserContext } from "../Hooks/useUserContext";

const AllScreen = ({ navigation }: any) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('')

  const [categoriesWithPosts, setCategoriesWithPosts] = useState<{
    [key: string]: Post[];
  }>({});

  const [progressSelected, setProgressSelected] = useState<ProgressSelector>({
    newSelected: true,
    assignedSelected: true,
    updatedSelected: true,
    completedSelected: true,
  });
  const [categorySelected, setCategorySelected] = useState<
    string | undefined
  >("Tag");

  const [assigneesSelectedIds, setAssigneesSelectedIds] = useState<
    string[] | undefined
  >();

  const isFocused = useIsFocused(); // Assuming you're using something like this
  const {state} = useUserContext();

  useEffect(() => {
    console.log("Component mounted, fetching posts initially");

    console.log("Event triggered, fetching posts");
    fetchPosts(progressSelected,searchTerm, categorySelected, assigneesSelectedIds);
  }, [progressSelected, categorySelected, isFocused, assigneesSelectedIds, searchTerm]); // Depend on currStatus to refetch when it changes

  const handleStatusChange = async (newStatus: ProgressSelector) => {
    console.log("Received status:", status);
    console.log("Current status:", progressSelected);
    console.log("Status changed, updating current status and refetching posts");
    if (JSON.stringify(newStatus) !== JSON.stringify(progressSelected)) {
      setProgressSelected(newStatus);
    }
  };

  const handleHeaderOptionChange = (option: string) => {
    if (JSON.stringify(option) !== JSON.stringify(categorySelected)) {
      setCategorySelected(option);
    }
    // Additional logic if needed
  };

  const handleAssigneeSelection = (selectedAssigneeIds: string[]) => {
    console.log("Selected Assignees:", selectedAssigneeIds);
    setAssigneesSelectedIds(selectedAssigneeIds);
    // Perform actions with the selected IDs, like updating state or making API calls
  };

  const handleSearchChange = (searchTerm: string) => {
    console.log("Selected Assignees:", searchTerm);
    setSearchTerm(searchTerm);
    // Perform actions with the selected IDs, like updating state or making API calls
  };

  const fetchPosts = async (
    status: ProgressSelector | undefined,
    searchTerm: string,
    headerOption?: string,
    selectedAssigneeIds?: string[],
    
  ) => {
    try {
      console.log("THE SELECTED ID's FOR ASSIGNEES", searchTerm);
      if (selectedAssigneeIds == undefined) {
        selectedAssigneeIds = [];
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
        title: searchTerm,
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
        console.log("resJson DEBUG: ", resJson);
        setCategoriesWithPosts(resJson);
        setRefreshKey((prevKey) => prevKey + 1); // Increment key to force update
      } else {
        console.error("Error loading posts. Please try again later.");
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    }
  };
  
  const [isLoading, setIsLoading] = useState(false);

  const handlePopoverCloseComplete = async () => {
    setIsLoading(true);
    await fetchPosts(progressSelected, searchTerm, categorySelected, assigneesSelectedIds);
    setIsLoading(false);
  };

  return (
    <OuterView style={{paddingHorizontal: 40,}}>
      <Header
        onHeaderOptionChange={handleHeaderOptionChange}
        onStatusChange={handleStatusChange}
        onAssigneeSelection={handleAssigneeSelection}
        headerTitle={"All Issues"}
        groupID={state.leaderGroups[0]}
        onSearchChange={handleSearchChange}
        onPopoverCloseComplete={handlePopoverCloseComplete}
      />
      <ScrollView
        horizontal
        style={{
          backgroundColor: colors.background,
        }}
      >
        {Object.entries(categoriesWithPosts).map(([name, posts]) => (
          <View
            key={name}
            style={{
              width: 350, // Adjust as needed
              marginRight: 20,
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
                <Card 
                key={item._id}
                issue={item} 
                onPopoverCloseComplete={handlePopoverCloseComplete} // Pass the handler here
                isDisabled={isLoading}
              />
              )}
            />
          </View>
        ))}
      </ScrollView>
    </OuterView>
  );
};

export default AllScreen;
