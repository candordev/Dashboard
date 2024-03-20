import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, FlatList, StyleSheet } from 'react-native';
import colors from '../Styles/colors';
import { customFetch } from '../utils/utils';
import { Endpoints } from '../utils/Endpoints';
import { useUserContext } from '../Hooks/useUserContext';
import { Post } from "../utils/interfaces";
import DropDown from '../Components/DropDown'; // Assuming DropDown is in your components directory
import PostWithDropdown from '../Components/PostWithDropDown';
import GroupInsightsComponent from '../Components/GroupInsightsComponent';




// Dummy data for demonstration
const forwardedEmails = [
  { id: 'email1', subject: 'Email Subject 1', content: 'This is the email content 1.' },
  { id: 'email2', subject: 'Email Subject 2', content: 'This is the email content 2.' },
  // Add more emails as needed
];

const groupsWithCards = [
  {
    groupName: 'Group 1',
    cards: [
      { id: 'card1', title: 'Card 1 Title', description: 'Card 1 description.' },
      { id: 'card2', title: 'Card 2 Title', description: 'Card 2 description.' },
      // Add more cards as needed
    ],
  },
  // Add more groups as needed
];



const MasterScreen = () => {
  // State to hold fetched data (though we're using dummy data here)
  const [forwardedPosts, setForwardedPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState([]);
  const { state } = useUserContext();
  const [selectedGroup, setSelectedGroup] = useState(null);
  

  useEffect(() => {
    if (state?.leaderGroups) {
      const groupItems = state.leaderGroups.map((group: { name: any; _id: any; }) => ({ label: group.name, value: group._id }));
      setGroups(groupItems);
    }
  }, [state?.leaderGroups]);

  const handleSelectGroup = async (postId: string, groupId: null) => {
    try {
      await customFetch(Endpoints.setGroup, {
        method: "POST",
        body: JSON.stringify({ postId, groupId }),
      });
      console.log("Group set successfully");
    } catch (error) {
      console.error("Failed to set group for post:", error);
    }
  };

  async function fetchForwardedPosts() {
    try {
      // Assuming the masterID is stored in state.master
      const queryParams = new URLSearchParams({
        masterID: state.master._id,
      });

      const response = await customFetch(
        `${Endpoints.getForwardedEmails}${queryParams.toString()}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setForwardedPosts(data.forwardedPosts); // Assuming the API response structure
      } else {
        console.error("Failed to fetch forwarded posts.");
      }
    } catch (error) {
      console.error("Error fetching forwarded posts: ", error);
    }
  }

  useEffect(() => {
    if (state?.master) {
      fetchForwardedPosts();
    }
  }, [state?.master]);

  
  return (
    <View style={styles.screenContainer}>
    <View style={styles.emailsContainer}>
      <Text style={styles.title}>Forwarded Emails</Text>
      <ScrollView>
        {forwardedPosts.map((post) => (
           <PostWithDropdown key={post._id} post={post} onClearPosts={fetchForwardedPosts} />
        ))}
      </ScrollView>
    </View>
      <View style={styles.groupsContainer}>
         <Text style={styles.title}>Group Insights</Text>
         <GroupInsightsComponent masterID={state.master ? state.master._id : undefined}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: colors.white, 
    borderRadius: 20,
    overflow: 'visible', // This line is crucial for showing shadows


  },
  emailsContainer: {
    flex: 1.1,
    padding: 10,
    margin: 20,
    backgroundColor: colors.white,
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)', // offsetX offsetY blurRadius color
    borderRadius: 20,
    overflow: 'visible', // Allow overflow to show the shadow

  },
  groupsContainer: {
    flex: 3,
    padding: 10,
    margin: 20,
    backgroundColor: colors.white,
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)', // offsetX offsetY blurRadius color
    borderRadius: 20
  },
  title: {
    fontSize: 23,
    fontWeight: 550,
    marginBottom: 10,
    fontFamily: 'Montserrat',
    marginTop: 6,
    marginLeft: 3
  },
  card: {
    backgroundColor: colors.white,
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxHeight: 300,
    flexDirection: 'column',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontFamily: 'Montserrat'
  },
  group: {
    marginRight: 20,
  },
});

export default MasterScreen;
