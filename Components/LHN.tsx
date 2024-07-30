import { Link } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlexAlignType, Pressable, ScrollView, View } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { event, eventNames } from "../Events";
import { useSignout } from "../Hooks/useSignout";
import { useUserContext } from "../Hooks/useUserContext";
import { useNotification } from "../Structure/NotificationContext"; // Update the import path as necessary
import colors from "../Styles/colors";
import { downloadPDF, getUnreadNotifs } from "../utils/utils";
import ProfilePicture from "./ProfilePicture";
import SearchBar from "./SearchBar";
import Text from "./Text";

interface LHNProps {
  navigation: any;
  state: any;
}

const LHN = (props: LHNProps) => {
  const [unread, setUnread] = useState<number>(0);
  const { state, dispatch } = useUserContext();
  const { notifications } = useNotification();
  const [searchPhrase, setSearchPhrase] = useState("");
  
  let filteredGroups = []
  if(state && state.leaderGroups) {
    filteredGroups = state.leaderGroups.filter((group: { name: string; }) =>
      group.name.toLowerCase().includes(searchPhrase.toLowerCase())
    );
  }
  

  const isFirstRender = useRef(true);

  useEffect(() => {
    getUnreadDB();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      // If it's the first render, update the ref and return early
      isFirstRender.current = false;
      return;
    }
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
    props.navigation.navigate("all");
  };

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

  if (state.groupType === "Convention") {
    return <View style={styles.container}>
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
      <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 10,
          }}
      ></View>
      <NavItem
        name={"Events"}
        route="/events"
        icon="calendar"
        selected={navIndex === 10}/>
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
  }

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
      <>
        {/* Original navigation structure for non-AIChat groupType */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 10,
          }}
        ></View>
        {(state.groupType === "AIChat" || state.groupType === "InternalAIChat") && (
          <>
            <NavItem
              name={"ChatInsights"}
              route="/chatInsights"
              icon="pie-chart"
              selected={navIndex === 2}
            />
        {
            <NavItem
              name={"Train"}
              route="/trainChat"
              icon="activity"
              selected={navIndex === 1}
            />
        }
            <NavItem
              name={"Chats"}
              route="/chats"
              icon="message-circle"
              selected={navIndex === 0}
            />
        {(state.groupType != "InternalAIChat") && (
            <NavItem
              name={"Leads"}
              route="/leads"
              icon="user"
              selected={navIndex === 9}
            />
          )}
          </>
        )}
        {state.master ? (
          <>
            <NavItem
              name={"Master"}
              route="/master"
              icon="list"
              selected={navIndex === 3}
            />
            <View style={{ backgroundColor: colors.darkGray, padding: 7.5, borderRadius: 10, marginBottom: 10, }}>
              <SearchBar
                searchPhrase={searchPhrase}
                setSearchPhrase={setSearchPhrase}
                placeholder="Search groups..."
                containerStyle={{
                  width: "100%",
                  borderRadius: 10,
                  marginBottom: 5,
                  backgroundColor: colors.white,
                }}
              />
              <View
                style={{ height: Math.min(140, state.leaderGroups.length * 28), paddingLeft: 25, marginBottom: 5 }}
              >
                <ScrollView>
                  {filteredGroups.map((group: { _id: any; name: string | any[]; }, index: React.Key | null | undefined) => (
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
                  ))}
                </ScrollView>
              </View>
            </View>
          </>
        ) : (
          <NavItem
            name={"Issues"}
            route="/all"
            icon="list"
            selected={navIndex === 4}
          />
        )}
        {/* {(state.groupType !== "AIChat" || state.groupType !== "InternalAIChat") && (
          // <NavItem
          //   name={"Inbox"}
          //   route="/inbox"
          //   icon="inbox"
          //   unreadCount={unread}
          //   selected={navIndex === 5}
          // />
        )} */}
        {/* <NavItem
          name={"Settings"}
          route="/settings"
          icon="settings"
          selected={navIndex === 6}
        /> */}
        {/* {(state.groupType !== "AIChat" || state.groupType !== "InternalAIChat") && (
          <NavItem
            name={"Group Settings"}
            route="/groupSettings"
            icon="user"
            selected={navIndex === 7}
          />
        )} */}
{/* 
        <NavItem
          name="24/7 Support"
          route="/support"
          icon="check-circle"
          selected={navIndex === 8}
        /> */}
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
            downloadPDF(
              state.leaderGroups?.[0] ? state.currentGroup : undefined
            );
          }}
          icon="download"
          selected={false}
        />
      </>
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
            flexDirection: "row",
            paddingHorizontal: 15,
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
    fontWeight: "500",
  },
};

export default LHN;
