import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import Card from "../Components/Card";
import colors from "../Styles/colors";
import { Post, Department, CategoryWithPosts,  } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import Text from "../Components/Text";
import { constants } from "../utils/constants";
import Header from "../Components/Header";
import OuterView from "../Components/OuterView";
import styles from "../Styles/styles";
import { useUserContext } from "../Hooks/useUserContext";
import {event, eventNames} from '../Events';
import { useNavigationState } from '../Structure/NavigationProvider';
import FlashList from "@shopify/flash-list/dist/FlashList";
import { useIsFocused } from '@react-navigation/native';
import { cpuUsage } from "process";


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

const SuggestedScreen = ({ navigation }: any) => {

  const [refreshKey, setRefreshKey] = useState(0);  
  const [categoriesWithPosts, setCategoriesWithPosts] = useState<{ [key: string]: Post[] }>({});
  const [currStatus, setCurrStatus] = useState<Status>(sampleStatus);
  const [isVisible, setIsVisible] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [selectedHeaderOption, setSelectedHeaderOption] = useState<string | undefined>();
  const {setUpdatedScreens,updatedScreens, setIsCategoryOpen, isCategoryOpen} = useNavigationState();
  const handlePopoverVisibilityChange = (isVisible: boolean | ((prevState: boolean) => boolean)) => {
    setIsPopoverVisible(isVisible);
  };
  const isFocused = useIsFocused(); // Assuming you're using something like this

  useEffect(() => {
    if (isFocused && updatedScreens.all) {
      // Fetch posts for Screen 1
      fetchPosts(currStatus);
      // Reset the flag for Screen 1
      setUpdatedScreens({ all: false });
    }
  }, [isFocused]); // }, [isFocused, updatedScreens.all]);
  


  useEffect(() => {
    console.log("Component mounted, fetching posts initially");
     
      console.log("Event triggered, fetching posts");
      fetchPosts(currStatus);

  }, [currStatus, selectedHeaderOption]); // Depend on currStatus to refetch when it changes


  useEffect(() => {
    console.log("POP OVER JUST CHANGED: ", isPopoverVisible)
    console.log("Category was set for a post: ", isPopoverVisible)

     if(isPopoverVisible && isCategoryOpen){
      console.log("CHECK")
      fetchPosts(currStatus);
      setIsPopoverVisible(false);
      setIsCategoryOpen(false);
      setUpdatedScreens({ all: true, your: true, suggested: false });
     }
      // console.log("Event triggered, fetching posts");
      // fetchPosts(currStatus);

  }, [isPopoverVisible]); // Depend on currStatus to refetch when it changes

  const handleStatusChange = async (newStatus: Status) => {
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

  
  

  const fetchPosts = async (status: Status | undefined) => {
    try {
      let res: Response = await customFetch(
        Endpoints.dashboardPosts +
          new URLSearchParams({
            filter: 'top',
            tab: 'suggested',     
            status: JSON.stringify([
              status?.newSelected,
              status?.assignedSelected,
              status?.updatedSelected,
              status?.completedSelected,
            ]),     
          }),
        {
          method: 'GET',
        },
      );
  
      let resJson = await res.json();
      if (res.ok) {
        //const result: CategoryWithPosts[] = resJson;
        setCategoriesWithPosts(resJson);
        setRefreshKey(prevKey => prevKey + 1); // Increment key to force update
      } else {
        console.error("Error loading posts. Please try again later.");
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    }
  };
  
  

   return (
    <View style={{ flex: 1 }}>
    <Header onHeaderOptionChange={handleHeaderOptionChange} onStatusChange={handleStatusChange} headerTitle={'Suggested Issues'} />
    <ScrollView horizontal style={{ /* Add styles if necessary */ }}>
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
            renderItem={({ item }) => 
            <Card onPopoverVisibilityChange={handlePopoverVisibilityChange}
            issue={item} 
            />}
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

