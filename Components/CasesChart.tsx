import React from "react";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import colors from "../Styles/colors";

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
        stroke={colors.purple2}
        legendType="wye"
        dot={false}
        strokeWidth={3}
        isAnimationActive={false}
      />
      <Line
        type="monotone"
        dataKey="opened"
        stroke={colors.purple}
        legendType="wye"
        dot={false}
        strokeWidth={3}
        isAnimationActive={false}
      />
    </LineChart>
  );
};

export default CasesChart;
