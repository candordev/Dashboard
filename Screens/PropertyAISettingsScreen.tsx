import React, { PropsWithChildren, useEffect, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import Button from "../Components/Button";
import NotificationPopup from "../Components/NotificationPopup";
import OuterView from "../Components/OuterView";
import Text from "../Components/Text";
import { useUserContext } from "../Hooks/useUserContext";
import colors from "../Styles/colors";
import styles from "../Styles/styles";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import { isGroup } from "../utils/utils";
import { GroupIds } from "../utils/constants";

type Props = PropsWithChildren<{
  route: any;
  navigation: any;
}>;

function PropertyAISettingsScreen({ route, navigation }: Props): JSX.Element {
  const { state, dispatch } = useUserContext();
  const isDemoGroup =
    isGroup(state.currentGroup, GroupIds.Demo); 

  return (
    <>
      <NotificationPopup navigation={navigation} />
      <OuterView style={{ backgroundColor: colors.white, flexDirection: "row", flex: 1 }}>
        <PhoneSettings />
        {isDemoGroup && <ClearAIChatGroup />}
      </OuterView>
    </>
  );
}

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
  style?: any;
};

const ClearAIChatGroup = () => {
  const { state } = useUserContext();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearGroup = async () => {
    if (!selectedOption) return; // Ensure a valid option is selected

    try {
      setIsLoading(true);
      const res = await customFetch(Endpoints.clearAIChat, {
        method: "POST",
        body: JSON.stringify({
          groupId: state.currentGroup,
          smsWebOrBoth: selectedOption,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Group cleared successfully.");
        setSelectedOption(null); // Reset selection after clearing
      } else {
        console.error("Error clearing group: ", data.error);
      }
    } catch (error) {
      console.error("Network error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <SettingsSection title={"Clear AI Chats"} style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10}}>
        <Button
          text="Web Sessions Only"
          onPress={() => setSelectedOption("Web")}
          style={{
            margin: 5,flex: 1,backgroundColor: selectedOption === "Web" ? colors.purple : colors.gray,
          }}
        />
        <Button
          text="SMS Numbers Only"
          onPress={() => setSelectedOption("SMS")}
          style={{
            margin: 5,flex: 1, backgroundColor: selectedOption === "SMS" ? colors.purple : colors.gray,
          }}
        />
        <Button
          text="Both"
          onPress={() => setSelectedOption("Both")}
          style={{
            margin: 5,flex: 1,backgroundColor: selectedOption === "Both" ? colors.purple : colors.gray,
          }}
        />
      </View>
      <Button
        text="Press To Clear"
        onPress={clearGroup}
        style={{
          marginTop: 20,
          backgroundColor: selectedOption ? colors.purple : colors.gray,
        }}
        disabled={!selectedOption}
        loading={isLoading}
      />
    </SettingsSection>
  );
};

const PhoneSettings = () => {
  const { state, dispatch } = useUserContext();
  const [firstName, setFirstName] = useState(state.firstName);
  const [lastName, setLastName] = useState(state.lastName);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(state.imageUrl);
  const [isLoading, setIsLoading] = useState(false);

  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newPhoneNumberError, setNewPhoneNumberError] = useState("");

  useEffect(() => {
    getPhoneNumbers();
  }, []);

  async function getPhoneNumbers() {
    try {
      const params = new URLSearchParams({
        groupId: state.currentGroup,
      });
      const endpoint = Endpoints.getPhoneNumbers + params;
      const res = await customFetch(endpoint, {
        method: "GET",
      });

      console.log(endpoint);

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setPhoneNumbers(data);
      } else {
        console.error("Error getting phone numbers: ", data.error);
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  }

  async function addPhoneNumber() {
    if (!newPhoneNumber) {
      setNewPhoneNumberError("Please enter a phone number");
      return;
    }

    // Check if the string is a number
    if (isNaN(Number(newPhoneNumber))) {
      setNewPhoneNumberError("Please enter a valid phone number - should only contain numbers");
      return;
    }

    // Check whether the phone number has the correct number of digits
    if (newPhoneNumber.length !== 10) {
      setNewPhoneNumberError("Please enter a valid phone number - should be 10 digits long");
      return;
    }

    try {
      setIsLoading(true);
      const res = await customFetch(Endpoints.addPhoneNumber, {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: newPhoneNumber,
          groupId: state.currentGroup,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPhoneNumbers([...phoneNumbers, newPhoneNumber]);
        setNewPhoneNumber("");
      } else {
        console.error("Error adding phone number: ", data.error);
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
    setIsLoading(false);
  }

  async function deletePhoneNumber(phoneNumber: string) {
    try {
      const res = await customFetch(Endpoints.deletePhoneNumber, {
        method: "DELETE",
        body: JSON.stringify({
          phoneNumber: "+1" + phoneNumber,
          groupId: state.currentGroup,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPhoneNumbers(phoneNumbers.filter((num) => num !== phoneNumber));
      } else {
        console.error("Error deleting phone number: ", data.error);
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  }

  return (
      <SettingsSection title={"Phone Numbers"} style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <ScrollView>
            {phoneNumbers &&
              phoneNumbers.map((number, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomColor: colors.lightergray,
                    borderBottomWidth: 1,
                    paddingVertical: 7,
                    paddingHorizontal: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 15, marginRight: 10 }}>
                    {number}
                  </Text>
                  <Button
                    text={"Remove"}
                    onPress={() => {
                      deletePhoneNumber(number);
                    }}
                    style={{
                      backgroundColor: colors.red,
                      padding: 7,
                      borderRadius: 5,
                    }}
                    textStyle={{ fontSize: 12 }}
                  />
                </View>
              ))}
          </ScrollView>
          <View style={{}}>
            <TextInput
              style={[
                styles.textInput,
                { fontFamily: "Montserrat", marginBottom: 10 },
              ]}
              value={newPhoneNumber}
              onChangeText={setNewPhoneNumber}
              placeholder="Add a new phone number"
              placeholderTextColor={colors.gray}
            />
            <Button
              text="Add Phone Number"
              onPress={addPhoneNumber}
              style={{ backgroundColor: colors.purple }}
              loading={isLoading}
            />
            <Text style={{ color: colors.red, fontSize: 12, marginTop: 3 }}>
              {newPhoneNumberError}
            </Text>
          </View>
        </View>
      </SettingsSection>
  );
};

const SettingsSection = (props: SettingsSectionProps) => {
  return (
    <View
      style={[
        styles.groupSettingsContainer,
        {
          paddingVertical: 15,
          paddingHorizontal: 20,
          marginHorizontal: 50,
          borderRadius: 15,
        },
        props.style,
      ]}
    >
      <Text
        style={{
          fontFamily: "Montserrat",
          fontSize: 30,
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

export default PropertyAISettingsScreen;
