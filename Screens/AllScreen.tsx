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
import { Post } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import Text from "../Components/Native/Text";
import { FlashList } from "@shopify/flash-list";
import { constants } from "../utils/constants";
import Header from "../Components/Header";
import OuterView from "../Components/OuterView";

const AllScreen = ({ navigation }: any) => {
  const [issues, setIssues] = useState<Post[]>([]);
  const dev = false;

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

  return (
    <OuterView>
      <Header />
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "92.5%",
            marginBottom: 30,
            paddingTop: 10,
          }}
        >
          {issues.map((issue, index) => (
            <Card key={index} issue={issue} remainOpen={dev && index == 0}/>
          ))}
        </View>
      </ScrollView>
    </OuterView>
  );
};

export default AllScreen;
