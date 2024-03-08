import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import OuterView from "./OuterView";
import Text from "./Text";
import colors from "../Styles/colors";
import styles from "../Styles/styles";
import Button from "./Button";
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

interface DataPoint {
    name: string;
    opened: number;
    closed: number;
}

interface CasesChartProps {
    data: DataPoint[];
}

const CasesChart: React.FC<CasesChartProps> = ({ data }) => {
    return (
        <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 20,
                bottom: 5,
            }}
        >
            {/* <CartesianGrid /> */}
            <XAxis
                dataKey="name"
                width={4}
                tickLine={false}
                allowDataOverflow={true}
                interval={"preserveEnd"}
            />
            <YAxis
                allowDataOverflow={true}
                tickLine={false}
                interval={"preserveEnd"}
            />
            <Tooltip />
            <Legend />
            <Line
                type="monotone"
                dataKey="closed"
                stroke="#82ca9d"
                legendType="wye"
                dot={false}
                strokeWidth={3}
                isAnimationActive={false}
            />
            <Line
                type="monotone"
                dataKey="opened"
                stroke="#F26E41"
                legendType="wye"
                dot={false}
                strokeWidth={3}
                isAnimationActive={false}
            />
        </LineChart>
    );
};

export default CasesChart;