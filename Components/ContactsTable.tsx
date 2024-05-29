import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import colors from '../Styles/colors';
import {LeadContact} from '../utils/interfaces';
import { useState, useEffect } from 'react';
import { Endpoints } from '../utils/Endpoints';
import { customFetch } from '../utils/utils';
import { TouchableOpacity } from 'react-native-gesture-handler';

type TagEditorProps = {
  groupID: string;
  navigation: any;
};

const ContactsTable = ({ groupID, navigation}: TagEditorProps):JSX.Element => {
  const [contacts, setContacts] = useState<LeadContact[]>([]);

  const handleCardPress = (sessionId: string) => {
    navigation.navigate('chats', { sessionId });
  };

  useEffect(() => {
    async function queryData() {
      try {
        const queryParams = new URLSearchParams({ groupId: groupID});
        const url = `${Endpoints.getProspectiveClients}${queryParams.toString()}`;
        console.log("URL", url);
        const response = await customFetch(url, { method: "GET" });
        const data = await response.json();
        console.log("DATA", data);
        if (response.ok) {
          setContacts(data.prospectiveClients);
        } else {
          console.error("Error querying data: ", data.error);
        }
      } catch (error) {
        console.error('Error querying data', error);
      }
    }
    queryData();
  }, [groupID]);

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>First Name</Text>
        <Text style={styles.header}>Last Name</Text>
        <Text style={styles.header}>Email</Text>
        <Text style={styles.header}>Phone</Text>
        <Text style={styles.header}>Session ID</Text>
      </View>
      {contacts.map((item) => (
        <TouchableOpacity key={item._id} style={styles.row} onPress={() => handleCardPress(item.sessionId)}>
          <Text style={styles.cell}>{item.firstName}</Text>
          <Text style={styles.cell}>{item.lastName}</Text>
          <Text style={styles.cell}>{item.email}</Text>
          <Text style={styles.cell}>{item.phoneNumber}</Text>
          <Text style={styles.cell}>{item.sessionId}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    marginTop: 20,
    marginHorizontal: 10,
  },
  headerRow: {
    flexDirection: 'row',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderColor: colors.lightgray,
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 20,
    marginVertical: 4,
    borderRadius: 10,
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
      },
    }),
    backgroundColor: colors.white, // Ensure background color is set for shadow to be visible
  },
  header: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Montserrat', // Ensure the font is loaded
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Montserrat', // Ensure the font is loaded
    fontSize: 16,
  },
});

export default ContactsTable;
