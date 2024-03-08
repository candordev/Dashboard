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

function InsightsScreen({ route, navigation }: Props): JSX.Element {
  return (
    <OuterView>
      <TopRow />
      <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
        <LeftColumn />
        <RightColumn />
      </View>
    </OuterView>
  );
}

const TopRow = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginBottom: 50,
      }}
    >
      <View
        style={[
          styles.insightsSection,
          { width: 275, height: 100, marginHorizontal: 0 },
        ]}
      >
        <Text> 200 </Text>
      </View>
      <View
        style={[
          styles.insightsSection,
          { width: 275, height: 100, marginHorizontal: 0 },
        ]}
      >
        <Text> 400 </Text>
      </View>
      <View
        style={[
          styles.insightsSection,
          { width: 275, height: 100, marginHorizontal: 0 },
        ]}
      >
        <Text> 600 </Text>
      </View>
      <View
        style={[
          styles.insightsSection,
          { width: 275, height: 100, marginHorizontal: 0 },
        ]}
      >
        <Text> 600 </Text>
      </View>
    </View>
  );
};

const LeftColumn = () => {
  return (
    <View style={{ width: "50%", flex: 1, justifyContent: "space-between" }}>
      <Activity />
      <Affinity />
    </View>
  );
};

const RightColumn = () => {
  return (
    <View style={{ width: "50%", flex: 1, }}>
      <Breakdown />
    </View>
  );
};

const Activity = () => {
  return (
    <View style={styles.insightsSection}>
      <Text>Activity</Text>
    </View>
  );
};

const Affinity = () => {
  return (
    <View style={styles.insightsSection}>
      <Text>Affinity</Text>
    </View>
  );
};

const Breakdown = () => {
  return (
    <View style={styles.insightsSection}>
      <Text>Breakdown</Text>
    </View>
  );
};

export default InsightsScreen;
