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
  console.log(data);

  const newData = [
    {
      date: "Aug 20th",
      count: 10,
    },
    {
      date: "Aug 21st",
      count: 20,
    },
    {
      date: "Aug 22nd",
      count: 15,
    },
    {
      date: "Aug 23rd",
      count: 25,
    },
    {
      date: "Aug 24th",
      count: 10,
    },
    {
      date: "Aug 25th",
      count: 15,
    },
    {
      date: "Aug 26th",
      count: 40,
    },
    {
      date: "Aug 27th",
      count: 45,
    },
    {
      date: "Aug 28th",
      count: 50,
    },
    {
      date: "Aug 29th",
      count: 20,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={newData}
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
        />
        <YAxis
          allowDataOverflow={true}
          tickLine={false}
        />
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
