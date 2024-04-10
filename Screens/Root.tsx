import { createDrawerNavigator } from "@react-navigation/drawer";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import React, { useContext } from "react";
import LHN from "../Components/LHN";
import AllScreen from "./AllScreen";
import InboxScreen from "./InboxScreen";
import SettingsScreen from "./SettingsScreen";
import GroupSettingsScreen from "./GroupSettingsScreen";
import NotificationPopup from "../Components/NotificationPopup";
import MasterScreen from "./MasterScreen"; // Adjust the import path as necessary
import { useUserContext } from "../Hooks/useUserContext";
import SupportScreen from "./SupportScreen";


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

function Root({route, navigation}: RootScreenProps): JSX.Element {
  console.log("AABBCCDD");
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


  const initialRouteName = state.master ? "master" : "all"; // Replace "someOtherRoute" with your default route if state.master doesn't exist

  return (
    <Drawer.Navigator
      useLegacyImplementation={false}
      //get the route name and pass it into LHN
      drawerContent={(props) => <LHN {...props} navigation={props.navigation} />}
      screenOptions={{
        drawerType: "permanent",
        drawerStyle: { width: 250, borderRightWidth: 0 },
        headerShown: false,
      }}
      initialRouteName={initialRouteName}
    >    
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
      {/* <Drawer.Screen
        name="map"
        component={MapScreen}
        options={{ title: "Candor - Map" }}
      /> */}
      {/* <Drawer.Screen name="your" component={YourScreen} />
      <Drawer.Screen name="suggested" component={SuggestedScreen} /> */}
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
    </Drawer.Navigator>
  );
}

export default Root;
