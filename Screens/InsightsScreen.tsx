import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import OuterView from "../Components/OuterView";
import Text from "../Components/Text";
import colors from "../Styles/colors";
import styles from "../Styles/styles";
import InsightsPieChart from "../Components/InsightsPieChart";

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
    <OuterView
      style={{ backgroundColor: colors.white, paddingVertical: 40, rowGap: 20 }}
    >
      <TopRow />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
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
      }}
    >
      <TopRowSection
        number="100"
        subtitle="Completed Issues last week"
        color={colors.purple}
      />
      <TopRowSection
        number="200"
        subtitle="New Issues filed last week"
        color={colors.purple}
      />
      <TopRowSection
        number="400"
        subtitle="Reminders for this week"
        color={colors.purple}
      />
      <TopRowSection
        number="600"
        subtitle="Total Issues Solved"
        color={colors.purple}
      />
    </View>
  );
};

const TopRowSection = (props: {
  number: string;
  subtitle: string;
  color: string;
}) => {
  return (
    <View style={[styles.insightsSection, { width: 275, marginHorizontal: 0 }]}>
      <Text
        style={{
          color: props.color,
          fontFamily: "OpenSans",
          fontSize: 30,
          fontWeight: "500",
        }}
      >
        {props.number}
      </Text>
      <Text
        style={{
          color: colors.black,
          fontFamily: "OpenSans",
          fontSize: 15,
          fontWeight: "500",
        }}
      >
        {props.subtitle}
      </Text>
    </View>
  );
};

const LeftColumn = () => {
  return (
    <View style={{ width: "50%", flex: 1, justifyContent: "space-between" }}>
      <Activity />
    </View>
  );
};

const RightColumn = () => {
  return (
    <View style={{ width: "50%", flex: 1, justifyContent: "space-between" }}>
      <Breakdown />
      <Affinity />
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

const Breakdown = () => {
  return (
    <View style={styles.insightsSection}>
      <Text
        style={{
          color: colors.black,
          fontFamily: "OpenSans",
          fontSize: 25,
          fontWeight: "450",
        }}
      >
        Breakdown
      </Text>
      <InsightsPieChart />
    </View>
  );
};

const Affinity = () => {
    return (
      <View style={styles.insightsSection}>
        <Text
          style={{
            color: colors.black,
            fontFamily: "OpenSans",
            fontSize: 25,
            fontWeight: "450",
          }}
        >
          Satisfaction
        </Text>
      </View>
    );
  };

export default InsightsScreen;
