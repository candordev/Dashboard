import React, { PropsWithChildren } from "react";
import { TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import NotificationPopup from "../Components/NotificationPopup";
import OuterView from "../Components/OuterView";
import ProfilePicture from "../Components/ProfilePicture";
import Text from "../Components/Text";
import { useUserContext } from "../Hooks/useUserContext";
import colors from "../Styles/colors";
import styles from "../Styles/styles";
import Button from "../Components/Button";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

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
        <DepartmentSettings />
        <TagSettings />
        <DeadlineSettings />
        <EmailSettings />
      </OuterView>
    </>
  );
}

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const GeneralSettings = () => {
  const { state } = useUserContext();

  return (
    <SettingsSection title={"General"}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 20,
          columnGap: 100,
        }}
      >
        <View>
          <ProfilePicture imageUrl={state.imageUrl} type="editProfile" />
          <Button
            text="Edit Picture"
            onPress={() => {}}
            style={{
              backgroundColor: colors.lightestgray,
              borderRadius: 15,
              paddingVertical: 7,
              marginTop: 10,
            }}
            textStyle={{
              color: colors.black,
              fontSize: 14,
              fontWeight: "600",
            }}
          />
        </View>
        <View>
          <View style={{ height: 90, justifyContent: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontSize: 15, fontWeight: "500", marginRight: 10 }}
              >
                First Name:
              </Text>
              <TextInput style={styles.textInput} />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text
                style={{ fontSize: 15, fontWeight: "500", marginRight: 12 }}
              >
                Last Name:
              </Text>
              <TextInput style={styles.textInput} />
            </View>
          </View>
          <Button
            text="Save Changes"
            onPress={() => {}}
            style={{
              backgroundColor: colors.lightestgray,
              borderRadius: 15,
              paddingVertical: 7,
              marginTop: 10,
              alignSelf: "center",
            }}
            textStyle={{
              color: colors.black,
              fontSize: 14,
              fontWeight: "600",
            }}
          />
        </View>
      </View>
    </SettingsSection>
  );
};

const DepartmentSettings = () => {
  return (
    <SettingsSection title={"Departments"}>
      <Text>World</Text>
    </SettingsSection>
  );
};

const TagSettings = () => {
  return (
    <SettingsSection title={"Tags"}>
      <Text>World</Text>
    </SettingsSection>
  );
};

const DeadlineSettings = () => {
  return (
    <SettingsSection title={"Deadlines"}>
      <Text>World</Text>
    </SettingsSection>
  );
};

const EmailSettings = () => {
  return (
    <SettingsSection title={"Emails"}>
      <Text>World</Text>
    </SettingsSection>
  );
};

const SettingsSection = (props: SettingsSectionProps) => {
  return (
    <View
      style={[styles.groupSettingsContainer, {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 50,
        borderRadius: 15,
      }]}
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
