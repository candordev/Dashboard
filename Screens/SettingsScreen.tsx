import React, { PropsWithChildren } from "react";
import OuterView from "../Components/OuterView";
import Text from "../Components/Text";
import NotificationPopup from "../Components/NotificationPopup";

// type SettingsScreenProps = {
//   navigation: any;
// };

// const SettingsScreen: React.FC<SettingsScreenProps> = () => {

  type Props = PropsWithChildren<{
    route: any;
    navigation: any;
  }>;
  
  function SettingsScreen({ route, navigation }: Props): JSX.Element {
  return (
    <>
    <NotificationPopup navigation={navigation}/>
    <OuterView>
      <Text>hello</Text>
    </OuterView>
    </>
  );
};

export default SettingsScreen;
