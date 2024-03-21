import React, { PropsWithChildren, useEffect, useState } from "react";
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
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import { last } from "lodash";

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
        {/* <DepartmentSettings />
        <TagSettings />
        <DeadlineSettings /> */}
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
  const { state, dispatch } = useUserContext();
  const [firstName, setFirstName] = useState(state.firstName);
  const [lastName, setLastName] = useState(state.lastName);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(state.imageUrl);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

  }, [firstName, lastName, previewUrl]);

  async function editProfile(first: string, last: string, profilePicture: any) {
    try {
      setIsLoading(true);
      let formData = new FormData();
      formData.append('firstName', first);
      formData.append('lastName', last);

      if (profilePicture) {
        formData.append('image', profilePicture);
      }

      const res = await customFetch(Endpoints.updateProfile, {
        method: 'PUT',
        body: formData,
      },0,
      true,
      );

      const data = await res.json();
      if (res.ok) {
        dispatch({ type: 'UPDATE_FIRST_NAME', payload: data.profile.firstName });
        setFirstName(data.profile.firstName);
        dispatch({ type: 'UPDATE_LAST_NAME', payload: data.profile.lastName });
        setLastName(data.profile.lastName);
        dispatch({ type: 'UPDATE_PROFILE_PICTURE', payload: data.profile.profilePicture });
        setPreviewUrl(data.profile.profilePicture);
        setImageFile(null);
        console.log("Profile edited successfully: ", data)
      } else {
        console.error("Error editing profile: ", data.error);
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
    setIsLoading(false);
  }

  const onImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Please select an image file.');
    }
  };

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
          <ProfilePicture imageUrl={previewUrl} type="editProfile" />
          <input 
            type="file" 
            onChange={onImageChange}
            style={{
              display: "none",
            }}
            id="fileInput"
          />
          <label htmlFor="fileInput" style={{
              backgroundColor: colors.lightestgray,
              borderRadius: 15,
              padding: '7px 20px',
              marginTop: 10,
              fontFamily: 'Montserrat',
              cursor: 'pointer',
              display: 'inline-block',
              color: colors.black,
              fontSize: 14,
              fontWeight: "600",
          }}>Edit Picture</label>
        </View>
        <View>
          <View style={{ height: 90, justifyContent: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontSize: 15, fontWeight: "500", marginRight: 10 }}
              >
                First Name:
              </Text>
              <TextInput
                style={styles.textInput}
                value={firstName}
                onChangeText={setFirstName} />
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
              <TextInput
                style={styles.textInput}
                value={lastName}
                onChangeText={setLastName} />
            </View>
          </View>
          <Button
            text={isLoading ? "Loading..." : "Save Changes"} // Change text based on isLoading
            onPress={() => !isLoading && editProfile(firstName, lastName, imageFile)} // Prevent function call if isLoading
            disabled={isLoading} // Disable button when loading
            style={{
              backgroundColor: colors.lightestgray,
              borderRadius: 15,
              paddingVertical: 7,
              marginTop: 10,
              alignSelf: "center",
              opacity: isLoading ? 0.5 : 1, // Optional: change opacity when disabled for a visual cue
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

const EmailSettings = () => {
  const [ccEmail, setCCEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useUserContext();

  useEffect(() => {
    setCCEmail(state.ccEmail || "");
  }, [state.ccEmail]);

  async function editCCEmail() {
    if (!ccEmail) {
      alert("Please enter a CC email.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await customFetch(Endpoints.editCCEmail, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ccEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch({ type: 'UPDATE_CC_EMAIL', payload: data.ccEmail });
        setCCEmail(data.ccEmail);
        console.log("CC email edited successfully: ", data);
      } else {
        console.error("Error editing cc email: ", data.error);
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SettingsSection title={"Emails"}>
      <View
        style={{
          flexDirection: "column",
          padding: 20,
        }}
      >
          {/* <Text
            style={{ fontSize: 15, fontWeight: "500", marginRight: 12 }}
          >
            Email: {state.email}
          </Text> */}
          <View style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
          <Text style={{ fontSize: 15, fontWeight: "500", marginRight: 12 }}>
            CC Email:
          </Text>
          <TextInput
            style={styles.ccEmailInput}
            value={ccEmail}
            onChangeText={setCCEmail}
            placeholder="Enter CC Email"
          />
          <Button
            text={isLoading ? "Loading..." : "Save Changes"}
            onPress={editCCEmail}
            disabled={isLoading}
            style={{
              backgroundColor: colors.lightestgray,
              borderRadius: 15,
              paddingVertical: 7,
              marginLeft: 10, // Adjust as necessary for spacing
              opacity: isLoading ? 0.5 : 1,
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
