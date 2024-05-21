import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Platform, Pressable } from 'react-native';
import colors from '../Styles/colors';
import { customFetch } from '../utils/utils';
import { Endpoints } from '../utils/Endpoints';
import { ScrollView } from 'react-native-gesture-handler';
import { useUserContext } from "../Hooks/useUserContext";
import { useFocusEffect } from '@react-navigation/native';

interface InsightValues {
    step0: number;
    step1: number;
    highPriority: number;
    mediumPriority: number;
  }
  
  interface GroupInsights {
    [key: string]: number[];
  }

  // Define the props interface
interface GroupInsightsComponentProps {
    masterID: string;
    sortType: string | undefined; // Add this prop to accept the sort type
    navigation: any;
  }
  

  const GroupInsightsComponent: React.FC<GroupInsightsComponentProps> = ({ sortType,masterID,navigation }) => {
    const [insights, setInsights] = useState([]);
    const [activities, setActivities] = useState({} as any);
    const { state, dispatch } = useUserContext();

  const fetchInsights = async () => {
    try {
      console.log("master", masterID)
      const response = await customFetch(
          `${Endpoints.getMasterInsights}masterID=${masterID}&sortFilter=${sortType}`,

        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("insights", data.insights)
        setInsights(data.insights); // Assuming the API response structure
        console.log("activities", data.activities)
        setActivities(data.activities);
      } else {
        console.error("Failed to fetch group insights.");
      }
    } catch (error) {
      console.error("Error fetching group insights:", error);
    }
  };

  // Next two methods are bad code. Fix
  const fetchActivities = async () => {
    try {
      console.log("master", masterID)
      const response = await customFetch(
          `${Endpoints.getMasterInsights}masterID=${masterID}&sortFilter=${sortType}`,

        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("activities", data.activities)
        setActivities(data.activities);
      } else {
        console.error("Failed to fetch group insights.");
      }
    } catch (error) {
      console.error("Error fetching group insights:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchActivities();

      return;
    }, [])
  );

  const handleGroupSelect = async (currentGroup: any) => {
    console.log("currentGroup", currentGroup);
    // Update the current group in the global state
    await dispatch({ type: "SET_CURRENT_GROUP", payload: currentGroup });
    console.log("Event Triggg: ", state.currentGroup);
    // Navigate to the "All" screen
    navigation.navigate("all");
  };

  useEffect(() => {
    fetchInsights();
  }, [masterID, sortType]); // Dependency on masterID to refetch if it changes

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={insights}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item}) => {
            const groupName = Object.keys(item)[0];
            const isNewActivity = activities[groupName] ? activities[groupName] : false;
            console.log("is new activity", isNewActivity);
            console.log("an item", (Object.values(item as GroupInsights)[0]));
            return (
              <Pressable onPress={() => handleGroupSelect((Object.values(item as GroupInsights)[0][4]))}>
                <View style={styles.groupContainer}>
                  <View style={styles.groupNameContainer}>
                    <View style={isNewActivity ? styles.redDot : styles.invisibleDot} />
                    <Text style={styles.groupName}>{groupName}</Text>
                  </View>
                  <View style={styles.insightsContainer}>
                    <View style={[styles.card, styles.shadow]}>
                      <Text style={styles.cardNumber}>{(Object.values(item as GroupInsights)[0][0])}</Text>
                      <Text style={styles.cardTitle}>Total Unassigned Issues</Text>
                    </View>
                    <View style={[styles.card, styles.shadow]}>
                      <Text style={styles.cardNumber}>{(Object.values(item as GroupInsights)[0][1])}</Text>
                      <Text style={styles.cardTitle}>Total Issues w/ 0 Updates</Text>
                    </View>
                    <View style={[styles.card, styles.shadow]}>
                      <Text style={styles.cardNumber}>{Object.values(item as GroupInsights)[0][2]}</Text>
                      <Text style={styles.cardTitle}>High Priority</Text>
                    </View>
                    <View style={[styles.card, styles.shadow]}>
                      <Text style={styles.cardNumber}>{(Object.values(item as GroupInsights)[0][3])}</Text>
                      <Text style={styles.cardTitle}>Medium Priority</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
          );
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 20,
    zIndex: 1
  },
  groupNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    verticalAlign: 'middle',
    width: '100%',
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginRight: 10,
    marginBottom: 13,
    alignSelf: 'center', 
  },
  invisibleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
    marginRight: 10,
    marginBottom: 13,
    alignSelf: 'center', 
  },
  newActivityText: {
    marginLeft: 5,
    color: 'red',
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '600',
  },
  newActivityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 15,
    fontFamily: 'Montserrat',
  },
  insightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  card: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    width: '23%',
  },
  cardTitle: {
    color: colors.black,
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '500',
  },
  cardNumber: {
    textAlign: 'left',
    color: colors.purple,
    fontFamily: 'Montserrat',
    fontSize: 35,
    fontWeight: '600',
  },
  shadow: {
     ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        // Example values for boxShadow
        boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)', // offsetX offsetY blurRadius color
      }
    }),
  },
});

export default GroupInsightsComponent;
