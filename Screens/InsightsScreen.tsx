import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import OuterView from "../Components/OuterView";
import Text from "../Components/Text";
import colors from "../Styles/colors";
import styles from "../Styles/styles";
import Button from "../Components/Button";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    AreaChart,
} from "recharts";
import CasesChart from "../Components/CasesChart";

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
            style={{
                backgroundColor: colors.white,
                paddingVertical: 40,
                rowGap: 20,
            }}
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
        <View
            style={[
                styles.insightsSection,
                { width: 275, marginHorizontal: 0 },
            ]}
        >
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
        <View
            style={{ width: "50%", flex: 1, justifyContent: "space-between" }}
        >
            <Activity />
            <Affinity />
        </View>
    );
};

const RightColumn = () => {
    return (
        <View style={{ width: "50%", flex: 1 }}>
            <Breakdown />
        </View>
    );
};

const Activity = () => {
    const activityData = [
        { name: "Mar 4", opened: 10, closed: 120 },
        { name: "Mar 5", opened: 80, closed: 11 },
        { name: "Mar 6", opened: 90, closed: 150 },
        { name: "Mar 7", opened: 74, closed: 180 },
        { name: "Mar 8", opened: 130, closed: 59 },
        { name: "Mar 9", opened: 190, closed: 140 },
        { name: "Mar 10", opened: 150, closed: 190 },
    ];

    return (
        <View style={styles.insightsSection}>
            <Text style={styles.insightsSectionTitle}>Activity</Text>
            <CasesChart data={activityData} />
        </View>
    );
};

const Affinity = () => {
    return (
        <View style={styles.insightsSection}>
            <Text style={styles.insightsSectionTitle}>Affinity</Text>
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
