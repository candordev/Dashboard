import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import OuterView from "../Components/OuterView";
import SearchBar from "../Components/SearchBar";
import { useUserContext } from "../Hooks/useUserContext";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import ChatComponent from "./ChatComponent";
import { TabView, TabBar } from 'react-native-tab-view';
import { Modal, TextInput } from "react-native";
import Button from "../Components/Button";
import { isGroupInProdOrDev } from "../utils/utils";
import { GroupIds } from "../utils/constants";

// Step 1: Define the interface
interface ContactInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

interface NumberItem {
  sessionId?: string;
  number?: string;
  priority: string;
  contactInfo?: ContactInfo;
}

const ChatsScreen = ({ navigation, route }: any) => {
  const { state } = useUserContext();
  const { sessionId } = route.params;
  const [loading, setLoading] = useState(false);

  // Step 2: Use the interface to type your state
  const [webChats, setWebChats] = useState<NumberItem[]>([]);
  const [smsChats, setSmsChats] = useState<NumberItem[]>([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(sessionId || null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+1");
  const [message, setMessage] = useState("");

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'webChats', title: 'Web Chats' },
    { key: 'smsChats', title: 'SMS Chats' },
  ]);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const webChatsEndpoint = `${Endpoints.getAllWebChats}?groupID=${state.currentGroup}`;
      const smsChatsEndpoint = `${Endpoints.getAllSMSChats}?groupID=${state.currentGroup}`;
      const [webResponse, smsResponse] = await Promise.all([
        fetch(webChatsEndpoint, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }),
        fetch(smsChatsEndpoint, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }),
      ]);

      const webChatsData = await webResponse.json();
      const smsChatsData = await smsResponse.json();

      if (!webResponse.ok) {
        throw new Error(webChatsData.error);
      }
      if (!smsResponse.ok) {
        throw new Error(smsChatsData.error);
      }

      setWebChats(webChatsData.data);
      setSmsChats(smsChatsData.data);
      setSelectedPhoneNumber(
        webChatsData.data.length ? webChatsData.data[0].sessionId : smsChatsData.data.length ? smsChatsData.data[0].number : null
      );
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handlePriorityChange = async (id: string, key: string) => {
    await fetchChats();
    setSelectedPhoneNumber(id);
    const data = key === 'webChats' ? webChats : smsChats;
    const index = data.findIndex(item => item.sessionId === id || item.number === id);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  const handleSend = async () => {
    const endpoint = `${Endpoints.sendMessage}`;
    const payload = {
      phoneNumber: phoneNumber,
      message: message,
      groupID: state.currentGroup
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const responseData = await response.json();
      console.log('Message sent successfully:', responseData);
      await fetchChats();
      setModalVisible(false);
      setPhoneNumber("+1");
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleScrollToIndexFailed = (info: any) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    });
  };

  const renderScene = ({ route }: any) => {
    const data = route.key === 'webChats' ? webChats : smsChats;
    const keyExtractor = route.key === 'webChats' ? (item: any, index: number) => item.sessionId || index.toString() : (item: any, index: number) => item.number || index.toString();

    return (
      <>
        {loading ? (
          <ActivityIndicator size="small" color={colors.purple} />
        ) : (
          <FlatList
            ref={flatListRef}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedPhoneNumber(item.sessionId || item.number)}
                style={{
                  backgroundColor: (item.sessionId === selectedPhoneNumber || item.number === selectedPhoneNumber) ? colors.lightergray : colors.white,
                  padding: 12,
                  paddingLeft: 15,
                  borderBottomColor: colors.lightergray,
                  borderBottomWidth: 1,
                }}
              >
                <Text style={{ fontFamily: "Montserrat", fontSize: 16, color: colors.darkGray }}>
                  {item.contactInfo && item.contactInfo.firstName && item.contactInfo.lastName
                    ? `${item.contactInfo.firstName} ${item.contactInfo.lastName}`
                    : item.sessionId || item.number} - Priority: {item.priority}
                </Text>
              </TouchableOpacity>
            )}
            onScrollToIndexFailed={handleScrollToIndexFailed}
          />
        )}
      </>
    );
  };

  return (
    <OuterView style={{ backgroundColor: colors.white, flexDirection: "row", padding: 0 }}>
      <View style={{ flex: 1, borderRightWidth: 1, borderColor: colors.lightergray }}>
        { isGroupInProdOrDev(state.currentGroup, GroupIds.Brock) || isGroupInProdOrDev(state.currentGroup, GroupIds.Caleb) ? (
          renderScene({ route: { key: 'smsChats' } })
        ) : (
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get('window').width }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: colors.purple, height: 2 }}
                style={{ backgroundColor: colors.white }}
                labelStyle={{ color: colors.black }}
              />
            )}
          />
        )}
        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 7 }}>
          <SearchBar
            searchPhrase={searchQuery}
            setSearchPhrase={setSearchQuery}
            placeholder="Search Residents"
            containerStyle={{ flex: 1, backgroundColor: colors.white, margin: 10 }}
            searchBarStyle={{ borderWidth: 1.3, borderColor: colors.lightestgray }}
          />
          {isGroupInProdOrDev(state.currentGroup, GroupIds.Brock) || isGroupInProdOrDev(state.currentGroup, GroupIds.Caleb) && (
            <AntDesignIcon
              name="form"
              size={24}
              color={colors.gray}
              onPress={() => setModalVisible(true)}
              style={{ margin: 7 }}
            />
          )}
        </View>
      </View>
      <View style={{ flex: 3, padding: 20 }}>
        {selectedPhoneNumber ? (
          <ChatComponent
            onPriorityChange={(id: string) => handlePriorityChange(id, routes[index].key)}
            phoneNumber={selectedPhoneNumber}
            chatType={routes[index].key}
          />
        ) : null}
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: colors.white, borderRadius: 10 }}>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: colors.gray,
                marginBottom: 20,
                paddingVertical: 10,
                fontSize: 18,
                color: colors.black,
              }}
              onChangeText={setPhoneNumber}
              value={phoneNumber}
              placeholder="Phone Number"
              placeholderTextColor={colors.lightergray}
              keyboardType="phone-pad"
              underlineColorAndroid="transparent" // Remove blue underline on Android
            />
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: colors.gray,
                marginBottom: 20,
                paddingVertical: 10,
                fontSize: 18,
                color: colors.black,
                fontFamily: 'Montserrat'
              }}
              onChangeText={setMessage}
              value={message}
              placeholder="Message"
              placeholderTextColor={colors.gray}
              multiline
              underlineColorAndroid="transparent" // Remove blue underline on Android
            />
            <Button text="Send" onPress={handleSend} style={{ marginBottom: 5, backgroundColor: colors.purple }} />
            <Button text="Cancel" onPress={() => setModalVisible(false)} style={{ backgroundColor: colors.gray }} />
          </View>
        </View>
      </Modal>
    </OuterView>
  );
};

export default ChatsScreen;
