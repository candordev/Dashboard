import React, { PropsWithChildren } from "react";
import OuterView from "../Components/OuterView";
import Text from "../Components/Text";
import NotificationPopup from "../Components/NotificationPopup";

type SettingsScreenProps = {
  navigation: any;
  route: any;
};


interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const SettingsScreen = ({ route, navigation }: SettingsScreenProps) => {




  return (
    <>
      <NotificationPopup navigation={navigation} />
      <OuterView>
        <Text>Settings</Text>
      </OuterView>
    </>
  );
  };

export default SettingsScreen;