import React, { useEffect, useState } from 'react';
import { View, ScrollView, FlatList, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Text from '../Components/Text';
import colors from '../Styles/colors';
import { customFetch } from '../utils/utils';
import { Endpoints } from '../utils/Endpoints';
import { useUserContext } from '../Hooks/useUserContext';
import { Post, ChatInsights } from "../utils/interfaces";
import DropDown from '../Components/DropDown'; // Assuming DropDown is in your components directory
import PostWithDropdown from '../Components/PostWithDropDown';
import GroupInsightsComponent from '../Components/GroupInsightsComponent';
import OuterView from '../Components/OuterView';
import NotificationPopup from '../Components/NotificationPopup';
import ChatInsightsHeader from '../Components/ChatInsightsHeader';
import additionalStyles from '../Styles/styles';
import InsightsBarChart from "../Components/InsightsBarChart";
import ChatsLineGraph from '../Components/ChatsLineGraph';



const ChatInsightsScreen = ({ navigation }: any) => {
  // State to hold fetched data (though we're using dummy data here)
  const { state } = useUserContext();
  const [chatInsights, setChatInsights] = useState<ChatInsights>();


  const fetchChatInsights = async () => {
    try {

        const queryParams = new URLSearchParams({
            groupID: state.currentGroup // or simply groupID if key and variable name are the same
          });
          
          const response = await customFetch(
            `${Endpoints.getChatInsights}?${queryParams.toString()}`,
            {
              method: "GET",
            }
          );

      if (response.ok) {
        const data = await response.json();
        console.log("CHAT INSIGHTS FROM GET REQUEST: ", data)
        setChatInsights(data); // Assuming data is directly structured as required    
      } else {
        console.error("Failed to fetch chat insights.");
      }
    } catch (error) {
      console.error("Error fetching chat insights:", error);
    }
  };

  useEffect(() => {
    fetchChatInsights();
  }, []);

  const handleCardPress = (sessionId: string) => {
    navigation.navigate('chats', { sessionId });
  };


  
  return (
    <>
     <NotificationPopup navigation={navigation} />
    <OuterView style={{ backgroundColor: colors.white, flexDirection: 'column', flex: 1, borderRadius: 20, overflow: 'visible'}}> 
      {chatInsights && (
          <View style={{flex: 0.15, margin: 10}}>
            <ChatInsightsHeader chatInsights={chatInsights} />
          </View>
        )}        
      <View style={[additionalStyles.insightsSection, {flex: 0.43}]}>
                <Text
                    style={{
                        color: colors.black,
                        fontFamily: "OpenSans",
                        fontSize: 25,
                        fontWeight: "450",
                    }}
                >
                    Chats
                </Text>
                <View style={{flex: 1, overflow: 'hidden'}}>
                  <ChatsLineGraph data={chatInsights?.chatsPerDayLineGraphWeb || []} />
                </View>
            </View>
        <View style={{flexDirection: 'row', justifyContent: "space-around", flex: 0.5}}>
        <View style={[additionalStyles.insightsSection, { flex: 1}]}>
            <Text
                style={{
                    color: colors.black,
                    fontFamily: "Montserrat",
                    fontSize: 25,
                    fontWeight: "450",
                }}
            >
            All Time User Types
            </Text>
            <View style={{ alignItems: 'center', flex: 1}}>
                <InsightsBarChart chatInsights={chatInsights}/>
             </View>
        </View>
        <View style={[additionalStyles.insightsSection, { flex: 1}]}>
            <Text
                style={{
                    color: colors.black,
                    fontFamily: "Montserrat",
                    fontSize: 25,
                    fontWeight: "450",
                }}
            >
            Unanswered Questions
            </Text>
            <ScrollView>
                {chatInsights?.unansweredResidentQuestionsContentWeb?.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.card, styles.shadow]}
                    onPress={() => handleCardPress(question.sessionId)}
                  >
                  <Text style={{ fontFamily: "Montserrat", fontSize: 16, color: colors.darkGray }}>
                    {question.userType}: {question.content}
                  </Text>
                </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    </View>
    </OuterView>
    </>
  );
};



const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 10,
        margin: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
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
            boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
          }
        }),
      },
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
    //flex: 1,
    //alignContent: 'flex-start'
  },
  cardTitle: {
    fontWeight: 'bold',
    fontFamily: 'Montserrat'
  },
  group: {
    marginRight: 20,
  },
});

export default ChatInsightsScreen;
