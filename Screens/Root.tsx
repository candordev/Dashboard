import { createDrawerNavigator } from "@react-navigation/drawer";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import React from "react";
import LHN from "../Components/LHN";
import { useUserContext } from "../Hooks/useUserContext";
import AllScreen from "./AllScreen";
import ChatInsightsScreen from "./ChatInsightsScreen";
import ChatsScreen from "./ChatsScreen";
import EventsScreen from "./EventsScreen";
import GroupSettingsScreen from "./GroupSettingsScreen";
import InboxScreen from "./InboxScreen";
import LeadsScreen from "./LeadsScreen";
import MasterScreen from "./MasterScreen"; // Adjust the import path as necessary
import PhoneSettingsScreen from "./PhoneSettingsScreen";
import SettingsScreen from "./SettingsScreen";
import SupportScreen from "./SupportScreen";
import TrainChatScreen from "./TrainChat";

const Drawer = createDrawerNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyBm_R9VjtEnZvsC5M0JZLO3_xNBOT38NM4",
  authDomain: "candor-9863e.firebaseapp.com",
  projectId: "candor-9863e",
  storageBucket: "candor-9863e.appspot.com",
  messagingSenderId: "230275243650",
  appId: "1:230275243650:web:401b24c1ec5628f9cf1e9b",
  measurementId: "G-DCSB46Z23D",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// function Root() {

type RootScreenProps = {
  route: any;
  navigation: any;
};

function Root({ route, navigation }: RootScreenProps): JSX.Element {
  const { state } = useUserContext();

  // const [unread, setUnread] = useState<number>(0);

  // useEffect(() => {
  //   // event.on(eventNames.FOREGROUND_NOTIFICATION, incrementLocal);
  //     getUnreadDB()

  // }, []);

  // const getUnreadDB = useCallback(async () => {
  //   try {
  //     console.log("GET UNREAD NOTIF")
  //     setUnread(await getUnreadNotifs());
  //   } catch (err) {
  //     console.error('Error getting notification count', err);
  //   }
  // }, []);

  const initialRouteName =
    state.groupType === "AIChat" || state.groupType === "InternalAIChat"
      ? "chatInsights"
      : state.groupType === "Convention"
      ? "events"
      : state.master
      ? "master"
      : "all";

  //const initialRouteName = "chatInsights";

  return (
    <Drawer.Navigator
      useLegacyImplementation={false}
      //get the route name and pass it into LHN
      drawerContent={(props) => (
        <LHN {...props} navigation={props.navigation} />
      )}
      screenOptions={{
        drawerType: "permanent",
        drawerStyle: { width: 250, borderRightWidth: 0 },
        headerShown: false,
      }}
      initialRouteName={initialRouteName}
    >
      <Drawer.Screen
        name="chats"
        component={ChatsScreen}
        options={{ title: "Candor - Chats" }}
      />
      <Drawer.Screen
        name="trainChat"
        component={TrainChatScreen}
        options={{ title: "Candor - Train Chat" }}
      />
      <Drawer.Screen
        name="chatInsights"
        component={ChatInsightsScreen}
        options={{ title: "Candor - Chat Insights" }}
      />
      <Drawer.Screen
        name="master"
        component={MasterScreen}
        options={{ title: "Candor - Master" }}
      />
      <Drawer.Screen
        name="all"
        component={AllScreen}
        options={{ title: "Candor - Issues" }}
      />
      <Drawer.Screen
        name="inbox"
        component={InboxScreen}
        options={{ title: "Candor - Inbox" }}
      />
      <Drawer.Screen
        name="settings"
        component={SettingsScreen}
        options={{ title: "Candor - Settings" }}
      />
      <Drawer.Screen
        name="groupSettings"
        component={GroupSettingsScreen}
        options={{ title: "Candor - Group Settings" }}
      />
      <Drawer.Screen
        name="support"
        component={SupportScreen}
        options={{ title: "Candor - 24/7 Support" }}
      />
      <Drawer.Screen
        name="leads"
        component={LeadsScreen}
        options={{ title: "Candor - Leads" }}
      />
      <Drawer.Screen
        name="events"
        component={EventsScreen}
        options={{ title: "Candor - Events" }}
      />
      <Drawer.Screen
        name="phoneSettings"
        component={PhoneSettingsScreen}
        options={{ title: "Candor - Phone Settings" }}
      />
    </Drawer.Navigator>
  );
}

export default Root;
