import React from "react";
import { ResponsiveContainer, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
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
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          bottom: 5,
        }}
        style={{ fontFamily: 'Montserrat' }}
      >
        <XAxis
          dataKey="date"
          tick={false} // This disables all the X-axis labels
          tickLine={false}
          allowDataOverflow={true}
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