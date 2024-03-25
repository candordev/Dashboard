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
import OuterView from '../Components/OuterView';

const sortOptions = [
  { label: 'Unassigned Issues', value: 'step0Count' },
  { label: 'Issues w/ 0 updates', value: 'step1Count' },
  { label: 'High Priority', value: 'highPriorityCount' },
  { label: 'Medium Priority', value: 'mediumPriorityCount' }
];


const MasterScreen = () => {
  // State to hold fetched data (though we're using dummy data here)
  const [forwardedPosts, setForwardedPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState([]);
  const { state } = useUserContext();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedSort, setSelectedSort] = useState();

  

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
    <OuterView style={{ backgroundColor: colors.white, flexDirection: 'row'}}>
    <View style={styles.emailsContainer}>
      <Text style={styles.title}>Forwarded Emails</Text>
      <ScrollView>
        {forwardedPosts.map((post) => (
           <PostWithDropdown key={post._id} post={post} onClearPosts={fetchForwardedPosts} />
        ))}
      </ScrollView>
    </View>
    <View style={styles.groupsContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 3}}>
        <Text style={styles.title}>Group Insights</Text>
        <View style={{alignItems: 'flex-end', marginRight: 40}}>
          <DropDown
            placeholder="Select Sort Option"
            items={sortOptions}
            value={selectedSort}
            setValue={setSelectedSort}
            setItems={sortOptions}
            multiple={false}
            backgroundColor={colors.lightestgray}
            onClose={() => console.log('Dropdown closed')}
            multipleText="Select multiple options"
            dropDownDirection="AUTO"
          />
        </View>
      </View> 
      <GroupInsightsComponent masterID={state.master ? state.master._id : undefined} sortType={selectedSort}/>
    </View>
    </OuterView>
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
    borderRadius: 20,
    zIndex: 1
  },
  title: {
    fontSize: 23,
    fontWeight: '500', // Corrected to be a string. Adjust the value as needed, e.g., '400', 'bold'
    marginBottom: 10,
    fontFamily: 'Montserrat',
    marginTop: 6,
    marginLeft: 3,
    flex: 1,
    alignContent: 'flex-start'
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
