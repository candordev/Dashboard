import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import colors from "../Styles/colors";

const data = [
  {
    name: "Midtown",
    uv: 4000,
    pv: 50,
    amt: 2400,
  },
  {
    name: "Homepark",
    uv: 3000,
    pv: 75,
    amt: 2210,
  },
  {
    name: "Downtown",
    uv: 2000,
    pv: 80,
    amt: 2290,
  },
  {
    name: "Oakland",
    uv: 2780,
    pv: 33,
    amt: 2000,
  },
  {
    name: "Piedmont",
    uv: 1890,
    pv: 42,
    amt: 2181,
  },
];

const InsightsBarChart = () => {
  return (
    <BarChart
      width={500}
      height={170}
      data={data}
      margin={{
        top: 20,
        bottom: 5,
      }}
      barSize={30}
    >
      <XAxis dataKey="name" scale="point" padding={{ left: 30, right: 30 }} />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Bar dataKey="pv" fill={colors.otherPurple} background={{ fill: "#eee" }} />
    </BarChart>
  );
};

export default InsightsBarChart;
