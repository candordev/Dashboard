
import { View, TouchableOpacity } from "react-native";
import Text from "./Text";
import { Link } from "@react-navigation/native";
import colors from "../Styles/colors";
import FeatherIcon from "react-native-vector-icons/Feather";
import {event, eventNames} from '../Events';
import {AppState, Pressable} from 'react-native';
import {getUnreadNotifs} from '../utils/utils';
import React, { useCallback, useEffect, useState } from "react";

const LHN = ({ props }: any) => {
  const [unread, setUnread] = useState<number>(0);

  useEffect(() => {
    // event.on(eventNames.FOREGROUND_NOTIFICATION, incrementLocal);
      getUnreadDB()

  }, []);

  useEffect(() => {
    const handleRefresh = () => {
        console.log("Notifications refreshed, updating unread count");
        getUnreadDB();
    };

    event.on(eventNames.NOTIFICATIONS_REFRESHED, handleRefresh);

    return () => {
        event.off(eventNames.NOTIFICATIONS_REFRESHED, handleRefresh);
    };
}, []);

    useEffect(() => {
      // event.on(eventNames.FOREGROUND_NOTIFICATION, incrementLocal);
      event.on(eventNames.FETCH_NOTIFS, getUnreadDB);

      return () => {
        // event.off(eventNames.FOREGROUND_NOTIFICATION, incrementLocal);
        event.off(eventNames.FETCH_NOTIFS, getUnreadDB);
      };
    }, []);
  
  const getUnreadDB = useCallback(async () => {
    try {
      console.log("GET UNREAD NOTIF")
      setUnread(await getUnreadNotifs());  
    } catch (err) {
      console.error('Error getting notification count', err);
    }
  }, []);

  const handleNavigation = (screenName: string) => {
    // Handle navigation logic here
    console.log(`Navigating to ${screenName}`);
  };

  return (
    <View style={styles.container}>
      <NavItem name={"All Issues"} route="/all" icon="list" />
      {/* <NavItem name={"Your Issues"} route="/your" icon="list" />
      <NavItem name={"Suggested Issues"} route="/suggested" icon="list" /> */}
      <NavItem name={"Inbox"} route="/inbox" icon="list" unreadCount={unread} />
    </View>
  );
};

type NavItemProps = {
  route: string;
  icon: string;
  name: string;
  unreadCount?: number;
};

const NavItem = ({ route, icon, name, unreadCount }: NavItemProps) => {
  return (
    <Link to={route}>
      <View style={{
          marginBottom: 10,
          paddingVertical: 10,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          columnGap: 10,
        }}
      >
        <FeatherIcon name={icon} size={20} color={colors.white} />
        <Text style={styles.navItemText}>{name}</Text>
        {unreadCount && unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </Link>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  navItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },

    unreadBadge: {
      backgroundColor: 'red', // Change as per your design
      width: 22,            // Set a fixed width
      height: 22,           // Set the same value for height to make it a circle
      borderRadius: 10,     // Half of width/height to make it a perfect circle
      marginLeft: 10,
      justifyContent: 'center', // Center the text vertically
      alignItems: 'center',     // Center the text horizontally
    },
    unreadText: {
      color: 'white',
      fontSize: 12,
    },

};

export default LHN;
