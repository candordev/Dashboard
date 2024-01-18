import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
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
import { usePostId } from "../Structure/PostContext";
import Popover, { PopoverPlacement } from "react-native-popover-view";

const AllScreen = ({ navigation }: any) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { height, width } = useWindowDimensions();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [categoriesWithPosts, setCategoriesWithPosts] = useState<{
    [key: string]: Post[];
  }>({});

  const [progressSelected, setProgressSelected] = useState<ProgressSelector>({
    newSelected: true,
    assignedSelected: true,
    updatedSelected: true,
    completedSelected: true,
  });
  const [categorySelected, setCategorySelected] = useState<string | undefined>(
    "Tag"
  );

  const [assigneesSelectedIds, setAssigneesSelectedIds] = useState<
    string[] | undefined
  >();

  const isFocused = useIsFocused(); // Assuming you're using something like this
  const { state } = useUserContext();
  const { postId } = usePostId();

  useEffect(() => {
    console.log("Component mounted, fetching posts initially");

    console.log("Event triggered, fetching posts");
    fetchPosts(
      progressSelected,
      searchTerm,
      categorySelected,
      assigneesSelectedIds
    );
  }, [progressSelected, categorySelected, assigneesSelectedIds, searchTerm]); // Depend on currStatus to refetch when it changes

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
    selectedAssigneeIds?: string[]
  ) => {
    try {
      console.log("THE SELECTED ID's FOR ASSIGNEES", searchTerm);
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handlePopoverCloseComplete = async () => {
    setIsLoading(true);
    await fetchPosts(
      progressSelected,
      searchTerm,
      categorySelected,
      assigneesSelectedIds
    );
    setIsLoading(false);
  };

  const [initialPostId, setInitialPostId] = useState<string | null>(null);
  const [hasInitialOpenOccurred, setHasInitialOpenOccurred] = useState(false);
  const hasInitialOpen = async () => {
    setHasInitialOpenOccurred(true);
  };

  useEffect(() => {
    console.log("THS THE ST: ", state);
    // Check if postId exists and set it
    if (postId && !hasInitialOpenOccurred) {
      setInitialPostId(postId);
    }
  }, []);

  const [popoverVisible, setPopoverVisible] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemoveCategory = async (categoryName: any) => {
    try {
      let res: Response = await customFetch(Endpoints.deleteCategory, {
        method: "DELETE",
        body: JSON.stringify({
          groupID: state.leaderGroups[0],
          categoryName: categoryName,
        }),
      });

      const resJson = await res.json();

      if (!res.ok) {
        console.log("category deletion request failed");
      } else {
        console.log("categroy deleted");
        setIsDeleting(true); // Start loading
        await handlePopoverCloseComplete();
        setIsDeleting(false); // Start loading
      }
    } catch (error: any) {
      console.log(error);
    }

    // Call your route and handle the action here
    console.log(`Remove category: ${categoryName}`);
    // Update state or UI as needed after removing the category
    setPopoverVisible(false); // Close the popover after action
  };

  return (
    <OuterView style={{ paddingHorizontal: 40 }}>
      <Header
        onHeaderOptionChange={handleHeaderOptionChange}
        onStatusChange={handleStatusChange}
        onAssigneeSelection={handleAssigneeSelection}
        headerTitle={"All Issues"}
        groupID={state.leaderGroups?.[0] ? state.leaderGroups[0] : undefined}
        onSearchChange={handleSearchChange}
        onPopoverCloseComplete={handlePopoverCloseComplete}
      />
      {loading && (
        <View style={{ marginVertical: 3 }}>
          <ActivityIndicator color={colors.purple} size={"small"} />
        </View>
      )}
      <ScrollView
        horizontal
        style={{
          backgroundColor: colors.background,
        }}
      >
        {Object.entries(categoriesWithPosts).map(([name, posts], index) => (
          <View key={name} style={{ width: 350, marginRight: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "550",
                  color: colors.black,
                  marginBottom: 10,
                  marginTop: 10,
                  fontFamily: "Montserrat",
                }}
              >
                {name}
              </Text>
              {index !== 0 && (
                <Popover
                  // onCloseComplete={props.onPopoverCloseComplete} // Use the handler here
                  from={
                    <TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 18,
                          color: colors.black,
                          fontWeight: "550",
                        }}
                      >
                        •••
                      </Text>
                    </TouchableOpacity>
                  }
                  // isVisible={isPopupVisible}
                  // onRequestClose={closePopup}
                  placement={PopoverPlacement.FLOATING}
                  popoverStyle={{
                    borderRadius: 10,
                    width: width * 0.13,
                    height: height * 0.16,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        padding: 10,
                      }}
                    >
                      Are you sure you want to delete this category?
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveCategory(name)}
                      style={{
                        backgroundColor: "red",
                        padding: 10,
                        marginTop: 55,
                        borderRadius: 5,
                        marginHorizontal: 10,
                      }}
                    >
                      {isDeleting ? (
                        <Text
                          style={{
                            color: "white",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          Loading...
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: "white",
                            textAlign: "center",
                            fontWeight: "bold",
                            marginTop: -4,
                          }}
                        >
                          Delete
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </Popover>
              )}
            </View>
            <FlatList
              key={`${name}-${refreshKey}`}
              data={posts}
              renderItem={({ item }) => (
                <Card
                  key={item._id}
                  issue={item}
                  onPopoverCloseComplete={handlePopoverCloseComplete} // Pass the handler here
                  isDisabled={isLoading}
                  hasInitialOpen={hasInitialOpen}
                  initialOpen={
                    item._id === initialPostId && !hasInitialOpenOccurred
                  }
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
