import React, { PropsWithChildren } from "react";
import OuterView from "../Components/OuterView";
import Text from "../Components/Text";
import { View } from "react-native";
import colors from "../Styles/colors";
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
      <NotificationPopup navigation={navigation} />
      <OuterView>
        <GeneralSettings />
        <TagSettings />
        <DeadlineSettings />
      </OuterView>
    </>
  );
}

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const GeneralSettings = () => {
  return (
    <SettingsSection title={"General"}>
      <Text>World</Text>
    </SettingsSection>
  );
};

const TagSettings = () => {
  return (
    <SettingsSection title={"Tag"}>
      <Text>World</Text>
    </SettingsSection>
  );
};

const DeadlineSettings = () => {
  return (
    <SettingsSection title={"Deadline"}>
      <Text>World</Text>
    </SettingsSection>
  );
};

const SettingsSection = (props: SettingsSectionProps) => {
  return (
    <View
      style={{
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 10,
        marginHorizontal: 50,
        borderRadius: 15,
        backgroundColor: colors.white,
      }}
    >
      <Text
        style={{
          fontFamily: "Montserrat",
          fontSize: 20,
          fontWeight: "600",
          marginBottom: 10,
        }}
      >
        {props.title}
      </Text>
      {props.children}
    </View>
  );
};

export default SettingsScreen;
