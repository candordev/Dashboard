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
  >();

  const isFocused = useIsFocused(); // Assuming you're using something like this







  useEffect(() => {
    console.log("Component mounted, fetching posts initially");

    console.log("Event triggered, fetching posts");
    fetchPosts(currStatus, selectedHeaderOption);
  }, [currStatus, selectedHeaderOption, isFocused ]); // Depend on currStatus to refetch when it changes

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

  const fetchPosts = async (
    status: ProgressSelector | undefined,
    headerOption?: string
  ) => {
    try {
      const queryParams = new URLSearchParams({
        filter: "top",
        tab: "all",
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
        setCategoriesWithPosts(resJson);
        setRefreshKey((prevKey) => prevKey + 1); // Increment key to force update
      } else {
        console.error("Error loading posts. Please try again later.");
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        onHeaderOptionChange={handleHeaderOptionChange}
        onStatusChange={handleStatusChange}
        headerTitle={"All Issues"}
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
                <Card
                  onPopoverVisibilityChange={(isVisible) => {
                    console.log("IS VISIBLE", isVisible)
                    if(!isVisible){
                      fetchPosts(currStatus, selectedHeaderOption);
                    }
                  }}
                  issue={item}
                />
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

export default AllScreen;
