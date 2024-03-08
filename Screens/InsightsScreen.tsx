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
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

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
        { name: "Jul 4", opened: 100, closed: 120 },
        { name: "Jul 6", opened: 120, closed: 150 },
        // ... add other data points
    ];

    return (
        <View style={styles.insightsSection}>
            <Text>Activity</Text>
            <OfficeActivityChart data={activityData} />
        </View>
    );
};

const Affinity = () => {
    return (
        <View style={styles.insightsSection}>
            <Text>Affinity</Text>
            <CitizenAffinity percentage={50} change={10} />
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

interface DataPoint {
    name: string;
    opened: number;
    closed: number;
}

interface OfficeActivityChartProps {
    data: DataPoint[];
}

const OfficeActivityChart: React.FC<OfficeActivityChartProps> = ({ data }) => {
    return (
        <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="closed" stroke="#82ca9d" />
            <Line
                type="monotone"
                dataKey="opened"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
            />
        </LineChart>
    );
};

interface CitizenAffinityProps {
    percentage: number;
    change: number;
}

const CitizenAffinity: React.FC<CitizenAffinityProps> = ({
    percentage,
    change,
}) => {
  return (
    <div>
      <h2>Citizen Affinity</h2>
      <p>Constituent affinity is calculated based on post-case surveys, sentiment analysis of constituent responses, and response speed.</p>
      <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: `conic-gradient(green ${percentage}%, lightgray ${percentage}%)` }}>
        <div style={{ position: 'absolute', top: '35%', left: '25%', textAlign: 'center' }}>
          <span>{percentage}%</span>
          <span>{change > 0 ? `+${change}` : change}%</span>
        </div>
      </div>
    </div>
  );
};

export default InsightsScreen;
