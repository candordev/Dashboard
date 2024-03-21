import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Platform } from 'react-native';
import colors from '../Styles/colors';
import { customFetch } from '../utils/utils';
import { Endpoints } from '../utils/Endpoints';
import { ScrollView } from 'react-native-gesture-handler';

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

  }
  

  const GroupInsightsComponent: React.FC<GroupInsightsComponentProps> = ({ sortType,masterID }) => {
    const [insights, setInsights] = useState([]);

  const fetchInsights = async () => {
    try {
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
      } else {
        console.error("Failed to fetch group insights.");
      }
    } catch (error) {
      console.error("Error fetching group insights:", error);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [masterID, sortType]); // Dependency on masterID to refetch if it changes

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={insights}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
            const groupName = Object.keys(item)[0];
            console.log("an item", (Object.values(item as GroupInsights)[0][0]));
            return (
            <View style={styles.groupContainer}>
              <Text style={styles.groupName}>{groupName}</Text>
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
