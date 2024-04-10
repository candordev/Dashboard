import {
  View,
  TouchableOpacity,
  FlexAlignType,
  ScrollView,
} from "react-native";
import Text from "./Text";
import { Link } from "@react-navigation/native";
import colors from "../Styles/colors";
import FeatherIcon from "react-native-vector-icons/Feather";
import { event, eventNames } from "../Events";
import { AppState, Pressable } from "react-native";
import { downloadPDF, getUnreadNotifs } from "../utils/utils";
import React, { useCallback, useEffect, useState } from "react";
import { useUserContext } from "../Hooks/useUserContext";
import { useSignout } from "../Hooks/useSignout";
import { useNotification } from "../Structure/NotificationContext"; // Update the import path as necessary
import ProfilePicture from "./ProfilePicture";

interface LHNProps {
  navigation: any;
}

const LHN = ({ navigation }: LHNProps, ...props: any) => {
  const [unread, setUnread] = useState<number>(0);
  const { state, dispatch } = useUserContext();
  const { notifications } = useNotification();

  useEffect(() => {
    setUnread(1 + unread);
  }, [notifications]);

  //current route name
  // const currRoute = props.state.routeNames[props.state.index];
  const navIndex = props.state?.index;
  console.log("nav index: ", props.state?.index);
  console.log("nav state: ", props.navigation);

  const handleGroupSelect = async (currentGroup: any) => {
    // Update the current group in the global state
    await dispatch({ type: "SET_CURRENT_GROUP", payload: currentGroup });
    console.log("Event Triggg: ", state.currentGroup);
    // Navigate to the "All" screen
    navigation.navigate("all");
  };

  useEffect(() => {
    // console.log("sparsisparsi");
    // console.log(props);
    // console.log(currRoute);
    // event.on(eventNames.FOREGROUND_NOTIFICATION, incrementLocal);
    getUnreadDB();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      // console.log("Notifications refreshed, updating unread count");
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
    console.log("Leader groups: ", state.leaderGroups);

    return () => {
      // event.off(eventNames.FOREGROUND_NOTIFICATION, incrementLocal);
      event.off(eventNames.FETCH_NOTIFS, getUnreadDB);
    };
  }, []);

  const getUnreadDB = useCallback(async () => {
    try {
      // console.log("GET UNREAD NOTIF");
      setUnread(await getUnreadNotifs());
    } catch (err) {
      console.error("Error getting notification count", err);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 10,
        }}
      >
        <ProfilePicture
          imageUrl={state.imageUrl}
          type="profile"
          style={{ marginVertical: 10 }}
        />
        <Text
          style={{
            color: colors.white,
            fontWeight: "500",
            textAlign: "center",
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          {state.firstName} {state.lastName}
        </Text>
      </View>
      {state.master ? (
        <>
          <NavItem
            name={"Master"}
            route="/master"
            icon="list"
            selected={navIndex === 4}
          />
          <View style={{ maxHeight: 140, paddingLeft: 30, marginBottom: 18 }}>
            <ScrollView>
              {state.leaderGroups.map(
                (
                  group: { name: any; _id: any },
                  index: React.Key | null | undefined
                ) => (
                  <Pressable
                    key={index}
                    onPress={() => handleGroupSelect(group._id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginVertical: 4,
                    }}
                  >
                    <FeatherIcon
                      name="trello"
                      size={20}
                      color={colors.white}
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={{
                        color: colors.white,
                        fontFamily: "Montserrat",
                        textAlign: "left",
                        flex: 1,
                      }}
                    >
                      {group.name.length > 15
                        ? `${group.name.slice(0, 15)}...`
                        : group.name}
                    </Text>
                  </Pressable>
                )
              )}
            </ScrollView>
          </View>
        </>
      ) : (
        <NavItem
          name={"Issues"}
          route="/all"
          icon="list"
          selected={navIndex === 0}
        />
      )}

      {/* <NavItem
        name={"Map"}
        route="/map"
        icon="map"
        selected={navIndex == 1}
      /> */}
      {/* <NavItem name={"Your Issues"} route="/your" icon="list" />
      <NavItem name={"Suggested Issues"} route="/suggested" icon="list" /> */}
      <NavItem
        name={"Inbox"}
        route="/inbox"
        icon="inbox"
        unreadCount={unread}
        selected={navIndex == 1}
      />
      {/* {state.groupType !== "HOA" && ( */}
        <NavItem
          name={"Settings"}
          route="/settings"
          icon="settings"
          selected={navIndex == 2}
        />
      {/* )} */}
      <NavItem
        name={"Group Settings"}
        route="/groupSettings"
        icon="user"
        selected={navIndex == 4}
      />
       <NavItem
        name="24/7 Support"
        route="/support"
        icon="check-circle"
        selected={false}
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
      <NavItem
        name="Download"
        onPress={() => {
          downloadPDF(state.leaderGroups?.[0] ? state.currentGroup : undefined);
        }}
        icon="download"
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
            marginLeft: 10,
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
    paddingVertical: 20,
    wdith: 500,
    paddingHorizontal: 15,
  },
  navItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
  unreadBadge: {
    backgroundColor: "red", // Change as per your design
    borderRadius: 20, // Half of width/height to make it a perfect circle
    marginLeft: 5,
    justifyContent: "center" as any,
    alignItems: "center" as FlexAlignType,
    height: 23,
    width: 23,
  },
  unreadText: {
    color: "white",
    fontSize: 12,
  },
};

export default LHN;
