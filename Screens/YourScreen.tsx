import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Card from "../Components/Card";
import Header from "../Components/Header";
import OuterView from "../Components/OuterView";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { Post } from "../utils/interfaces";
import { customFetch } from "../utils/utils";


const YourScreen = ({ navigation }: any) => {
  const [issues, setIssues] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    //console.debug('fetch posts running');
    try {
      const endpoint = Endpoints.getYourProposals;

      const searchParams = {};

      const res: Response = await customFetch(endpoint, searchParams, {
        method: "GET",
      });

      const resJson = await res.json();
      if (!res.ok) {
        console.error("Error loading posts. Please try again later.");
      }
      if (res.ok) {
        const result: Post[] = resJson;
        console.log("your posts are", result);
        setIssues([...result]);
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    }
  };

  return (
    //center scroll view
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
            width: "90%",
            marginBottom: 30,
            paddingTop: 10,
          }}
        >
          {issues.map((issue, index) => (
            <Card key={index} issue={issue} />
          ))}
        </View>
      </ScrollView>
    </OuterView>
  );
};

export default YourScreen;
