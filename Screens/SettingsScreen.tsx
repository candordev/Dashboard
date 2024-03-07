    import React, { PropsWithChildren, useState } from "react";
    import { TouchableOpacity, View, Image} from "react-native";
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
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";

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
      };

    type SettingsSectionProps = {
      title: string;
      children: React.ReactNode;
    };

    const GeneralSettings = () => {
      const [imageFile, setImageFile] = useState(null);
      const [previewUrl, setPreviewUrl] = useState('');
      const [profilePictureData, setProfilePictureData] = useState<Object | null>(
        null,
      );
      const { state, dispatch} = useUserContext();


      const onImageChange = async (event : any) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
          setImageFile(file);
          const newPreviewUrl = URL.createObjectURL(file);
          setPreviewUrl(newPreviewUrl);
          let formData = new FormData();
          formData.append('profilePicture', file); // The key here ('profilePicture') should match the name expected by your backend for the file
          console.log(file);  
          try {
              let res = await fetch(Endpoints.updateProfile, {
                method: 'PUT', 
                body: formData,
                headers: {
                  "Authorization": `Bearer ${state.token}`,
                }
              });
            const resJson = await res.json();
          if (!res.ok) {
            console.error('Profile could not be updated because of :', resJson.error);
          } else {
            dispatch({type: "UPDATE_USER", payload: {...state.user, imageUrl: newPreviewUrl}});
            console.log('Profile updated successfully');
          }
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      }
        else {
          alert('Please select an image file.');
        }
      };

      const clearImage = () => {
        setImageFile(null);
        setPreviewUrl('');
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
              <ProfilePicture imageUrl={state.imageUrl} type="editProfile" />
              <TouchableOpacity
                onPress={() => {
                  const inputElement = document.getElementById('profile-picture-input');
                  if (inputElement !== null) {
                    inputElement.click();
                  }
                }}       
                style={{
                  backgroundColor: colors.lightestgray,
                  borderRadius: 15,
                  paddingHorizontal: 7,
                  paddingVertical: 7,
                  marginTop: 10,
                }}
                  >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    style={{ display: 'none' }}
                    id="profile-picture-input"
                  />
                  <Text style={{color: colors.black, fontSize: 15, fontWeight: "600",}}>Select Image</Text>
                </TouchableOpacity>
            </View>
            <View>
              <View style={{ height: 90, justifyContent: "center"}}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* <Text
                    style={{ fontSize: 15, fontWeight: "500", marginRight: 10 }}
                  >
                    First Name:
                  </Text> */}
                  <TextInput style={styles.textInput} placeholder="First Name" placeholderTextColor={colors.lightgray}/>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10, 
                    justifyContent: "space-between",
                  }}
                >
                  {/* <Text
                    style={{ fontSize: 15, fontWeight: "500", marginRight: 12 }}
                  >
                    Last Name:
                  </Text> */}
                  <TextInput style={styles.textInput} placeholder="Last Name" placeholderTextColor={colors.lightgray} />
                  {/* <TextInput style= {[styles.textInput, {marginLeft : 100}]} placeholder="Last Name" placeholderTextColor={colors.lightgray} /> */}
                </View>
              </View>
              <Button
                  text="Save Changes"
                  onPress={() => {}}
                  style={{
                    backgroundColor: colors.purple,
                    borderRadius: 15,
                    paddingVertical: 7,
                    marginTop: 10,
                    alignSelf: "flex-start",
                  }}
                  textStyle={{
                    color: colors.white,
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
          {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 15, fontWeight: "500", marginRight: 10 }}>
              Email:
            </Text>
            <TextInput style={styles.textInput} />
          </View> */}
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