import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  AppState,
  Linking,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import NotifSection from "../Components/NotifSection";
import { event, eventNames } from "../Events";
import { useUserContext } from "../Hooks/useUserContext";
import colors from "../Styles/colors";
import styles from "../Styles/styles";
import { Endpoints } from "../utils/Endpoints";
import { Notification, Post } from "../utils/interfaces";
import Text from "../Components/Native/Text";
import { FlatList, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import IssueView from "../Components/IssueView";
import OuterView from "../Components/OuterView";

type Props = PropsWithChildren<{
  route: any;
  navigation: any;
}>;

function NotificationsScreen({ route, navigation }: Props): JSX.Element {
  const isFocused = useIsFocused(); // Assuming you're using something like this
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);

  let [notifs, setNotifs] = useState<Notification[]>([]);
  let skip = useRef<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const stopped = useRef<boolean>(false);
  const refreshing = useRef<boolean>(false);
  const { state } = useUserContext();

  const [selectedPost, setSelectedPost] = useState<Post | null>();

  const getNotifsStatus = async () => {
    try {
    } catch (err) {
      console.error(err);
    }
  };

  const openNotificationSettings = () => {
    Linking.openSettings();
  };

  async function fetchNotifs(reset: boolean) {
    setLoading(true);
    if (reset) {
      skip.current = 0;
      stopped.current = false;
    }
    event.emit(eventNames.FETCH_NOTIFS);
    console.log(
      "reset",
      reset,
      "skip",
      skip.current,
      "stopped",
      stopped.current,
      "notifs",
      notifs.length
    );
    try {
      const endpoint =
        Endpoints.getNotificationPage +
        new URLSearchParams({
          skip: skip.current.toString(),
        });
      let res = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + state.token,
        },
      });

      let resJson = await res.json();
      if (!res.ok) {
        setLoading(false);
        throw new Error(resJson.error);
      } else {
        const newNotifs: Notification[] = resJson.notifications;
        if (newNotifs.length > 0) {
          skip.current += newNotifs.length;
          if (reset) {
            setNotifs(newNotifs);
          } else {
            setNotifs([...notifs, ...newNotifs]);
          }
        } else {
          stopped.current = true;
          if (reset) setNotifs(newNotifs);
        }
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (AppState.currentState === "active") {
        console.log("NOTIF HAPPENED");
        getNotifsStatus();
        onRefresh();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [AppState.currentState]);

  useEffect(() => {
    event.on(eventNames.FOREGROUND_NOTIFICATION, onRefresh);

    return () => {
      event.off(eventNames.FOREGROUND_NOTIFICATION, onRefresh);
    };
  }, []);

  useEffect(() => {
    getNotifsStatus();
  }, []);

  useEffect(() => {
    onRefresh();
  }, [isFocused]);

  const [isLoading, setIsLoading] = useState(false);

  const handleCloseComplete = () => {
    setIsLoading(true);
    fetchNotifs(true);
    setIsLoading(false);
  };

  const renderItem = ({ item }: { item: Notification }) => {
    return (
      <NotifSection
        isDisabled={isLoading}
        onPopoverCloseComplete={handleCloseComplete}
        notif={item}
        navigation={navigation}
        setSelectedPost={setSelectedPost}
        selectedPost={selectedPost}
      />
    );
  };

  const renderHeader = () => {
    if (notificationsEnabled) {
      return <View></View>;
    }

    return (
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={openNotificationSettings}
      >
        <Text style={additionalStyles.buttonText}>Enable Notifications</Text>
      </TouchableOpacity>
    );
  };

  function renderFooter() {
    if (loading) {
      return (
        <View style={{ marginVertical: 20 }}>
          <ActivityIndicator size="small" color={colors.purple} />
        </View>
      );
    }
    if (notifs.length == 0) {
      return (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: colors.gray, textAlign: "center" }}>
            No notifications yet
          </Text>
        </View>
      );
    } else return null;
  }

  function handleEndReached() {
    if (!loading && !stopped.current) {
      console.debug("FETCHING");
      fetchNotifs(false);
    } else {
      console.debug("PREVENTED");
    }
  }

  function onRefresh() {
    console.log("is focused on refresh");
    refreshing.current = true;
    stopped.current = false;
    fetchNotifs(true);
    refreshing.current = false;
    setLoading(false);
    event.emit(eventNames.NOTIFICATIONS_REFRESHED); // Emit an event here
  }

  useEffect(() => {
    console.log("HAS BEEN CHANGED TO: ", selectedPost);
  }, [selectedPost]);

  return (
    <OuterView
      style={{
        flex: 1,
        backgroundColor: colors.white,
        flexDirection: "row",
        padding: 0,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flex: 1,
          borderColor: colors.lightestgray,
          borderRightWidth: 2.5,
        }}
      >
        <FlatList
          data={notifs}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.8} // increase this to render next posts earlier
          indicatorStyle={colors.theme == "dark" ? "white" : "black"}
          showsVerticalScrollIndicator={true}
          ListFooterComponentStyle={{ flexGrow: 1, justifyContent: "center" }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing.current}
              onRefresh={onRefresh}
              title="Pull to refresh"
              tintColor={colors.purple}
              titleColor={colors.purple}
            />
          }
        />
      </View>
      <View style={{ flex: 3 }}>
        {selectedPost && (
          <View
            style={{
              backgroundColor: colors.background,
              padding: 7,
              paddingLeft: 4,
              flex: 1,
            }}
          >
            <IssueView
              issue={selectedPost}
              style={{ borderRadius: 10 }}
              onPopoverCloseComplete={() => {}}
            />
          </View>
        )}
      </View>
    </OuterView>
  );
}

const additionalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
  },
});

export default NotificationsScreen;
