import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import colors from '../Styles/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { ChatInsights } from '../utils/interfaces';
import { useUserContext } from '../Hooks/useUserContext';
import {isGroupInProdOrDev} from "../utils/utils";
import {GroupIds} from "../utils/constants"


// Interface to type the props
interface ChatInsightsHeaderProps {
    chatInsights: ChatInsights; // Assume this is the structure of the chat insights you want to pass
  }

const ChatInsightsHeader: React.FC<ChatInsightsHeaderProps> = ({ chatInsights }) => {
  const { state } = useUserContext();

  const isInternalAIChat = isGroupInProdOrDev(state.currentGroup, GroupIds.Brock) || isGroupInProdOrDev(state.currentGroup, GroupIds.Caleb);

  return (
    <View style={styles.insightsContainer}>
      <View style={[styles.card, styles.shadow]}>
        <Text style={styles.cardNumber}>
          {isInternalAIChat ? chatInsights.chatsTodayPhone : chatInsights.chatsTodayWeb}
        </Text>
        <Text style={styles.cardTitle}>Chats Today</Text>
      </View>
      <View style={[styles.card, styles.shadow]}>
        <Text style={styles.cardNumber}>
          {isInternalAIChat ? chatInsights.messagesTodayPhone : chatInsights.messagesTodayWeb}
        </Text>
        <Text style={styles.cardTitle}>Messages Today</Text>
      </View>
      <View style={[styles.card, styles.shadow]}>
        <Text style={styles.cardNumber}>
          {isInternalAIChat ? chatInsights.chatsPastMonthPhone : chatInsights.chatsPastMonthWeb}
        </Text>
        <Text style={styles.cardTitle}>Chats Past Month</Text>
      </View>
      <View style={[styles.card, styles.shadow]}>
        <Text style={styles.cardNumber}>
          {isInternalAIChat ? chatInsights.messagesPastMonthPhone : chatInsights.messagesPastMonthWeb}
        </Text>
        <Text style={styles.cardTitle}>Messages Past Month</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 20,
    zIndex: 1
  },
  insightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1
  },
  card: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    width: '23%',
    minHeight: 80
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
        boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
      }
    }),
  },
});

export default ChatInsightsHeader;
