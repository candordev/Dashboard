import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import colors from "../Styles/colors";
import { BASE_URL, Endpoints } from "../utils/Endpoints";
import { customFetch, formatDate } from "../utils/utils";
// import TextInput from '../Components/Native/TextInput';
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../Styles/styles";
import { StyleSheet } from "react-native";
import Button from "../Components/Button";
import ExpandableTextInput from "../Components/ExpandableTextInput";
import { useUserContext } from "../Hooks/useUserContext";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { io } from "socket.io-client";

interface ChatComponentProps {
  phoneNumber: string; // Assuming phoneNumber is a string
  //onPriorityChange?: () => void;
  onPriorityChange?: (sessionId: string) => void;
  chatType: string;
}

interface MessageItem {
  _id: string;
  content: string;
  author: "AI" | "Resident" | "Leader"; // Assuming these are the only possible authors
  date: string;
}
interface ContactInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  phoneNumber,
  chatType,
  onPriorityChange,
}) => {
  const [inputText, setInputText] = useState(""); // State to hold the input text
  const [isAITurnedOn, setIsAITurnedOn] = useState(false);
  const [priority, setPriority] = useState("Low");
  const [userType, setUserType] = useState("");
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const { state, dispatch } = useUserContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [city, setCity] = useState("");

  useEffect(() => {
    const socketName =
      BASE_URL == "https://candoradmin.com/api"
        ? "https://candoradmin.com"
        : "http://localhost:4000";
    const socket = io(socketName, {
      withCredentials: false,
      // Add any additional options here
    });
    // Construct the room name based on chatMode and postID
    const roomName = `${phoneNumber}`;

    // console.log("ROOM NAME", roomName)
    socket.on("connect", () => {
      console.log("Connected to Socket.io server for join chat");
      // Join the room specific to the chatMode and postID
      socket.emit("join-chat", roomName);
    });

    socket.on("connect_error", (err: any) => {
      console.error("Connection error:", err.message);
    });

    socket.on("new-message", (newMessage: MessageItem) => {
      console.log("new message! ", newMessage);
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    });

    return () => {
      // Leave the room when the component unmounts or chatMode/postID changes
      socket.emit("leave-room", roomName);
      socket.disconnect();
      console.log("DISCONNECTED FROM SOCKET");
    };
  }, [phoneNumber]); // Add chatMode to the dependency array

  const toggleAI = async () => {
    const newAIState = !isAITurnedOn;
    setIsAITurnedOn(newAIState);

    const isPhoneNumber = /^\+?[1-9]\d{1,14}$/.test(phoneNumber);

    // Define the base structure of the bodyData object
    const bodyData: {
      groupID: any;
      AIReply: boolean;
      phoneNumber?: string;
      sessionId?: string;
    } = {
      groupID: state.currentGroup,
      AIReply: newAIState,
    };

    // Conditionally add phoneNumber or sessionId
    if (isPhoneNumber) {
      bodyData.phoneNumber = phoneNumber;
    } else {
      bodyData.sessionId = phoneNumber;
    }

    try {
      const response = await customFetch(Endpoints.updateNumberSettings, {
        method: "POST",
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error("Failed to update AI state");
      }

      console.log("AI state updated successfully");
      if (onPriorityChange) onPriorityChange(phoneNumber);
    } catch (error) {
      console.error("Error updating AI state:", error);
      setIsAITurnedOn(!newAIState);
    }
  };

  const togglePriority = async () => {
    const newPriority = priority === "Low" ? "High" : "Low";
    setPriority(newPriority);

    const isPhoneNumber = /^\+?[1-9]\d{1,14}$/.test(phoneNumber);

    // Define the base structure of the bodyData object
    const bodyData: {
      groupID: any;
      priority: string;
      phoneNumber?: string;
      sessionId?: string;
    } = {
      groupID: state.currentGroup,
      priority: newPriority,
    };

    // Conditionally add phoneNumber or sessionId
    if (isPhoneNumber) {
      bodyData.phoneNumber = phoneNumber;
    } else {
      bodyData.sessionId = phoneNumber;
    }

    try {
      const response = await customFetch(Endpoints.updateNumberSettings, {
        method: "POST",
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error("Failed to update priority");
      }

      console.log("Priority updated successfully");
      if (onPriorityChange) onPriorityChange(phoneNumber);
    } catch (error) {
      console.error("Error updating priority:", error);
      setPriority(priority === "Low" ? "High" : "Low");
    }
  };

  const [messages, setMessages] = useState<MessageItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 15; // Set your desired limit
  const [hasMore, setHasMore] = useState(true); // Flag to determine if there are more items to load

  async function fetchAIChat(
    identifier: string,
    page: number,
    limit: number
  ): Promise<MessageItem[] | undefined> {
    try {
      const isPhoneNumber = /^\+?[1-9]\d{1,14}$/.test(identifier); // Regex to check if identifier is a phone number
      if (isPhoneNumber) {
        setContactInfo(null);
      }
      const queryParams = new URLSearchParams({
        [isPhoneNumber ? "phoneNumber" : "sessionId"]: identifier,
        page: page.toString(),
        limit: limit.toString(),
        groupID: state.currentGroup,
      });

      const url = isPhoneNumber
        ? `${Endpoints.getChatUsingPhoneNumber}?${queryParams.toString()}`
        : `${Endpoints.getChatUsingSessionID}?${queryParams.toString()}`;

      const response = await customFetch(url, { method: "GET" });
      if (!response.ok) {
        console.error("Error fetching chats: ", response.statusText);
        return undefined;
      }

      const data = await response.json();
      if (!isPhoneNumber) {
        setContactInfo(data.contactInfo);
        console.log("THIS THE DATA BEING USED: ");
        setUserType(data.data[data.data.length - 1]?.userType);
      }
      setPriority(data.priority);
      setIsAITurnedOn(data.AIReply);

      if (data.location) {
        setCity(data.location.city);
      }
      console.log("DATA RETURNED NEW: ", data);

      return data.data;
    } catch (error) {
      console.error("Network error while fetching chats: ", error);
      return undefined;
    }
  }

  const handleSendChat = async () => {
    if (inputText.trim()) {
      const currentText = inputText;
      setInputText(""); // Clear the input text immediately
      try {
        const response = await customFetch(Endpoints.sendMessage, {
          method: "POST",

          body: JSON.stringify({
            phoneNumber: phoneNumber,
            message: inputText,
            groupID: state.currentGroup,
          }),
        });

        if (response.ok) {
          const newMessageData = await response.json(); // Assuming the response body will be the new message object
          // Assuming your API returns the message in the format that fits the MessageItem interface
          const newMessage: MessageItem = {
            _id: newMessageData._id, // Assuming the response has an _id field
            content: newMessageData.content, // Assuming the response has a content field
            author: "Leader", // Set the author based on the context; adjust as needed
            date: newMessageData.date, // Make sure this is the correct field from your API
            // include any other fields from MessageItem if necessary
          };
          setMessages((messages) => [newMessage, ...messages]);
          setInputText(""); // Clear the input text
        } else {
          console.error("Failed to send the message");
        }
      } catch (error) {
        setInputText(currentText); // Restore the input text in case of an error
        console.error("Network error while sending message:", error);
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleInfoPress = () => {
    setModalVisible(true);
  };

  function fetchMoreChats() {
    //if (loading || !hasMore) return;
    setLoading(true);
    console.log("fetch ran with page: ", page);
    fetchAIChat(phoneNumber, page, limit)
      .then((newMessages) => {
        if (newMessages) {
          if (newMessages.length === 0) {
            setHasMore(false); // No more messages are available to load
          } else {
            setMessages((prevMessages) => [...prevMessages, ...newMessages]);
            setPage((prevPage) => prevPage + 1);
          }
        } else {
          setHasMore(false); // If undefined, assume no more messages are available
        }
      })
      .catch((error) => console.error("Error fetching chats:", error))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // This effect is only responsible for resetting state
    setPage(1);
    setMessages([]);
    setHasMore(true);
    setLoading(false);
  }, [phoneNumber, chatType]); // Runs when phoneNumber changes

  useEffect(() => {
    // A separate effect that depends on `page` to fetch chats
    // This ensures it runs after the state has been reset in the previous effect
    console.log("Page now is:", page); // Should log the updated value
    if (page === 1) {
      // This condition can help ensure we're in a reset state; adjust logic as needed
      fetchMoreChats();
    }
  }, [page, phoneNumber, chatType]); // Runs after `page` is updated, and also accounts for phoneNumber changes

  const renderMessage = ({ item }: { item: MessageItem }) => {
    const rightMessage = item.author === "Leader" || item.author === "AI";
    const formattedDate = formatDate(item.date); // Ensure you handle formatting as needed

    return (
      <View
        style={{
          alignSelf: rightMessage ? "flex-end" : "flex-start",
          marginBottom: 10,
          marginRight: rightMessage ? 0 : 100,
          marginLeft: rightMessage ? 100 : 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: rightMessage ? "flex-end" : "flex-start",
          }}
        >
          <Text
            style={{
              color: colors.purple,
              fontSize: 14.5,
              fontFamily: "Montserrat",
              fontWeight: "500",
              marginHorizontal: 5,
            }}
          >
            {item.author}
          </Text>
          <Text
            style={{
              color: colors.gray, // Set the color to gray for the date
              fontSize: 14, // You can make the font size smaller if desired
              fontFamily: "Montserrat",
              fontWeight: "500",
            }}
          >
            {` ${formattedDate}`}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: rightMessage ? colors.purple : colors.lightergray,
            borderRadius: 20,
            padding: 10,
            marginTop: 3,
            alignSelf: rightMessage ? "flex-end" : "flex-start",
          }}
        >
          <Text
            style={{
              color: rightMessage ? colors.white : colors.black,
              fontWeight: "500",
              fontFamily: "Montserrat",
            }}
          >
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  const handleOnEndReached = () => {
    console.log("End reached - should load more");
    console.log("hasMore: ", hasMore);
    console.log("loading: ", !loading);

    if (!loading && hasMore) {
      console.log("Attempting to fetch more chats");
      fetchMoreChats();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 10,
          marginTop: -10,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Phone Number Display */}
        {contactInfo && (
          <TouchableOpacity onPress={handleInfoPress}>
            <MaterialIcons
              name="info"
              size={24}
              color={colors.purple}
              style={{ marginRight: 5.3 }}
            />
          </TouchableOpacity>
        )}
        <Modal
          visible={modalVisible}
          transparent={true}
          // animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={additionalStyles.modalBackground}>
            <View style={additionalStyles.modalContainer}>
              <Text style={additionalStyles.modalText}>
                First Name: {contactInfo?.firstName || "N/A"}
              </Text>
              <Text style={additionalStyles.modalText}>
                Last Name: {contactInfo?.lastName || "N/A"}
              </Text>
              <Text style={additionalStyles.modalText}>
                Email: {contactInfo?.email || "N/A"}
              </Text>
              <Text style={additionalStyles.modalText}>
                Phone Number: {contactInfo?.phoneNumber || "N/A"}
              </Text>
              <TouchableOpacity
                onPress={closeModal}
                style={additionalStyles.closeButton}
              >
                <Text style={additionalStyles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text
          style={{
            flex: 1,
            color: colors.black,
            fontSize: 18,
            fontFamily: "Montserrat",
          }}
        >
          {contactInfo && (contactInfo.firstName || contactInfo.lastName)
            ? `${contactInfo.firstName || ""} ${
                contactInfo.lastName || ""
              }`.trim()
            : phoneNumber}{" "}
          {userType ? "(" + userType + ")" : ""}
          {/* <Text
            style={{
              flex: 1,
              color: colors.purple,
              fontSize: 18,
              textAlign: "left",
              marginLeft: 5,
              fontFamily: "Montserrat",
            }}
          >
            {city}
          </Text> */}
        </Text>
        {/* <Text
          style={{
            flex: 1,
            color: colors.black,
            fontSize: 18,
            fontFamily: "Montserrat",
          }}
        >
          {phoneNumber + "(" + userType + ")"}
        </Text> */}
        {/* Buttons Container */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button
            text={isAITurnedOn ? "AI ON" : "AI OFF"}
            onPress={toggleAI}
            style={{
              backgroundColor: isAITurnedOn ? colors.purple : colors.lightgray,
              marginRight: 5,
            }}
            textStyle={{ color: colors.white, fontSize: 14, fontWeight: 700 }}
          />
          <Button
            text={`Priority: ${priority}`}
            onPress={togglePriority}
            style={{
              backgroundColor:
                priority === "High" ? colors.purple : colors.lightgray,
            }}
            textStyle={{ color: colors.white, fontSize: 14, fontWeight: 700 }}
          />
        </View>
      </View>
      <FlatList
        inverted
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={0.05} // May need to adjust
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        ListFooterComponent={
          loading ? (
            <View style={{ paddingVertical: 10 }}>
              <ActivityIndicator size="small" color={colors.purple} />
            </View>
          ) : null
        }
      />

      <View
        style={[
          styles.textInput,
          {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 20,
            borderColor: colors.lightergray,
            borderWidth: 1,
          },
        ]}
      >
        <ExpandableTextInput
          style={{ flex: 1, borderWidth: 0 }}
          onInputChange={setInputText}
          onSubmit={handleSendChat}
          value={inputText}
        />
        <TouchableOpacity
          onPress={handleSendChat}
          disabled={!inputText.trim()} // Disable the button when the input is empty
        >
          <Icon
            name="paper-plane"
            size={20}
            style={{ marginRight: 5 }}
            color={inputText.trim() ? colors.purple : colors.lightgray}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const additionalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    // width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    alignSelf: "flex-start",
    fontSize: 16,
    marginVertical: 5,
    fontFamily: "Montserrat",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.purple,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Montserrat",
  },
});

export default ChatComponent;
