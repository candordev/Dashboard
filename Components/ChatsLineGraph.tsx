import React from "react";
import { ResponsiveContainer, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import colors from "../Styles/colors";

interface DataPoint {
  date: string;
  count: number;
}

interface CasesChartProps {
  data: DataPoint[];
}

const ChatsLineGraph: React.FC<CasesChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          bottom: 5,
          right: 50,
        }}
        style={{ fontFamily: 'Montserrat' }}
      >
        <XAxis
          dataKey="date"
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
        <Line
          type="monotone"
          dataKey="count"
          stroke={colors.purple}
          legendType="wye"
          dot={false}
          strokeWidth={3}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChatsLineGraph;
