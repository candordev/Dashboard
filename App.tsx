import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useState } from "react";
import "react-native-gesture-handler";
import NavigationWrapper from "./Structure/NavigationWrapper";
import { UserProvider } from "./Structure/UserContext";
import { PostIdProvider } from "./Structure/PostContext";
import { NotificationProvider } from "./Structure/NotificationContext";
import NotificationPopup from "./Components/NotificationPopup";

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("./assets/fonts/Montserrat-VariableFont_wght.ttf"),
    OpenSans: require("./assets/fonts/OpenSans-VariableFont_wdth,wght.ttf"),
  });

  const [loading, setLoading] = useState(true);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PostIdProvider>
      <UserProvider>
        <NotificationProvider> 
          {/* <NotificationPopup /> Include NotificationPopup only once */}
          <NavigationWrapper />
        </NotificationProvider> 
      </UserProvider>
    </PostIdProvider>
  );
  
}
