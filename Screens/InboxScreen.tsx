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
  Text,
} from "react-native";
import NotifSection from "../Components/NotifSection";
import { event, eventNames } from "../Events";
import { useUserContext } from "../Hooks/useUserContext";
import colors from "../Styles/colors";
import styles from "../Styles/styles";
import { Endpoints } from "../utils/Endpoints";
import { Notification, NotificationType, Post } from "../utils/interfaces";
import Hyperlink from "react-native-hyperlink";

import { FlatList, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import IssueView from "../Components/IssueView";
import OuterView from "../Components/OuterView";
import { useNotification } from "../Structure/NotificationContext"; // Update the import path as necessary
import NotificationPopup from "../Components/NotificationPopup";
import { customFetch } from "../utils/utils";

type Props = PropsWithChildren<{
  route: any;
  navigation: any;
}>;

function NotificationsScreen({ route, navigation }: Props): JSX.Element {
  const isFocused = useIsFocused(); // Assuming you're using something like this
  const { notifications } = useNotification();
  const selectedNotificationFromPopup = route.params?.selectedNotification;

  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);

  let [notifs, setNotifs] = useState<Notification[]>([]);
  let skip = useRef<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const stopped = useRef<boolean>(false);
  const refreshing = useRef<boolean>(false);
  const { state } = useUserContext();
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>();

  const [selectedPost, setSelectedPost] = useState<Post | null>();

  const fetchPost = async (postId: string | undefined) => {
    try {
      if (postId) {
        let res: Response = await customFetch(
          Endpoints.getPostById +
            new URLSearchParams({
              postID: postId,
            }),
          {
            method: "GET",
          }
        );
        let resJson = await res.json();
        if (!res.ok) {
        }
        if (res.ok) {
          const result: Post = resJson;
          // console.info("fetched post is ", result);
          return result;
        }
      }
    } catch (error) {}
  };

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
    // console.log(
    //   "reset",
    //   reset,
    //   "skip",
    //   skip.current,
    //   "stopped",
    //   stopped.current,
    //   "notifs",
    //   notifs.length
    // );
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
        console.log("notifs: ", resJson.notifications)
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
        // console.log("NOTIF HAPPENED");
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
  }, [isFocused, notifications]);

  const [isLoading, setIsLoading] = useState(false);

  const handleCloseComplete = () => {
    setIsLoading(true);
    fetchNotifs(true);
    setIsLoading(false);
  };

  const handleReadAll = async () => {
    // Implement the functionality to mark all notifications as read
    console.log("Read All pressed");
    let res = await customFetch(Endpoints.deleteYourNotifications, {
      method: "DELETE",
      body: JSON.stringify({
        type: "seen",
      }),
    });
    let resJson = await res.json();
    if (!res.ok) {
      // setLoading(false);
      // throw new Error(resJson.error);
      console.log("reading failed");
    } else {
      console.log("read all chilling");
    }
    event.emit(eventNames.FETCH_NOTIFS);
  };

  const renderItem = ({ item }: { item: Notification }) => {
    return (
      <NotifSection
        isDisabled={isLoading}
        onPopoverCloseComplete={handleCloseComplete}
        notif={item}
        navigation={navigation}
        setSelectedNotification={setSelectedNotification}
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
        style={{
          alignSelf: "center",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: colors.purple4,
          marginTop: 16,
          marginBottom: 8,
        }}
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

  async function onRefresh() {
    // console.log("is focused on refresh");
    refreshing.current = true;
    stopped.current = false;
    await fetchNotifs(true);
    refreshing.current = false;
    setLoading(false);
    event.emit(eventNames.NOTIFICATIONS_REFRESHED); // Emit an event here

    // console.log("selectedNotif", selectedNotificationFromPopup)
    if (selectedNotificationFromPopup) {
      // console.log("selectedNotif3", selectedNotificationFromPopup)
      setSelectedNotification(selectedNotificationFromPopup);
      const post = await fetchPost(selectedNotificationFromPopup.data.postID);
      setSelectedPost(post);
    }
  }

  useEffect(() => {
    // console.log("HAS BEEN CHANGED TO: ", selectedPost);
  }, [selectedPost]);

  return (
    <>
      <NotificationPopup navigation={navigation} />
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
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <TouchableOpacity
              onPress={handleReadAll}
              style={{
                backgroundColor: colors.purple, // Adjust button color as needed
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
                marginTop: 8,
              }}
            >
              <Text style={{ color: colors.white, fontWeight: "bold" }}>
                Read All
              </Text>
            </TouchableOpacity>
          </View>
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
          {selectedNotification &&
          selectedNotification.data?.contentType ===
            NotificationType.reminder ? (
            <View style={{ padding: 20 }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
              >
                {selectedNotification.title}
              </Text>
              <Hyperlink
                linkDefault={true}
                linkStyle={{ color: colors.purple }}
              >
                <Text style={{ fontSize: 16 }}>
                  {selectedNotification.content}
                </Text>
              </Hyperlink>
            </View>
          ) : (
            selectedPost && (
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
            )
          )}
        </View>
      </OuterView>
    </>
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
