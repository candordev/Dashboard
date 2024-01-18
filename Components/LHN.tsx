import { View, TouchableOpacity, FlexAlignType } from "react-native";
import Text from "./Text";
import { Link } from "@react-navigation/native";
import colors from "../Styles/colors";
import FeatherIcon from "react-native-vector-icons/Feather";
import { event, eventNames } from "../Events";
import { AppState, Pressable } from "react-native";
import { getUnreadNotifs } from "../utils/utils";
import React, { useCallback, useEffect, useState } from "react";
import { useUserContext } from "../Hooks/useUserContext";
import { useSignout } from "../Hooks/useSignout";

const LHN = (props: any) => {
  const [unread, setUnread] = useState<number>(0);
  const {state, dispatch} = useUserContext();
 

  //current route name
  // const currRoute = props.state.routeNames[props.state.index];
  const navIndex = props.state.index;

  useEffect(() => {
    console.log("sparsisparsi");
    console.log(props);
    // console.log(currRoute);
    // event.on(eventNames.FOREGROUND_NOTIFICATION, incrementLocal);
    getUnreadDB();
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
      console.log("GET UNREAD NOTIF");
      setUnread(await getUnreadNotifs());
    } catch (err) {
      console.error("Error getting notification count", err);
    }
  }, []);

  return (
    <View style={styles.container}>
      <NavItem
        name={"Map"}
        route="/map"
        icon="map"
        selected={navIndex == 0}
      />
      <NavItem
        name={"All Issues"}
        route="/all"
        icon="list"
        selected={navIndex == 1}
      />
      {/* <NavItem name={"Your Issues"} route="/your" icon="list" />
      <NavItem name={"Suggested Issues"} route="/suggested" icon="list" /> */}
      <NavItem
        name={"Inbox"}
        route="/inbox"
        icon="inbox"
        unreadCount={unread}
        selected={navIndex == 2}
      />
      <View style={{ flex: 1 }} />
      <NavItem
        name="Sign out"
        onPress={() => {
          useSignout({ dispatch });
        }}
        icon="log-out"
        selected={false}
      />
    </View>
  );
};

type NavItemProps = {
  route?: string;
  onPress?: () => void;
  icon: string;
  name: string;
  unreadCount?: number;
  selected: boolean;
};

const NavItem = ({
  route,
  icon,
  name,
  unreadCount,
  onPress,
  selected,
}: NavItemProps) => {
  if (route) {
    return (
      <Link to={route}>
        <View
          style={{
            marginBottom: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            columnGap: 10,
            backgroundColor: selected ? colors.white : colors.black,
            borderRadius: 12.5,
            width: "100%",
          }}
        >
          <FeatherIcon
            name={icon}
            size={20}
            color={selected ? colors.black : colors.white}
          />
          <Text
            style={[
              styles.navItemText,
              { color: selected ? colors.black : colors.white },
            ]}
          >
            {name}
          </Text>
          {unreadCount ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          ) : (
            <View></View>
          )}
        </View>
      </Link>
    );
  } else {
    return (
      <Pressable onPress={onPress}>
        <View
          style={{
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
        </View>
      </Pressable>
    );
  }
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingVertical: 50,
    paddingHorizontal: 15,
  },
  navItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
  unreadBadge: {
    backgroundColor: "red", // Change as per your design
    width: 20, // Set a fixed width
    height: 20, // Set the same value for height to make it a circle
    borderRadius: 10, // Half of width/height to make it a perfect circle
    marginLeft: 5,
    justifyContent: "center" as any,
    alignItems: "center" as FlexAlignType,
  },
  unreadText: {
    color: "white",
    fontSize: 12,
  },
};

export default LHN;
