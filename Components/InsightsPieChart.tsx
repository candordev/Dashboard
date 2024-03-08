import React from "react";
import { PieChart, Pie } from "recharts";
import colors from "../Styles/colors";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const data02 = [
  { name: "A1", value: 100, text: "100 Potholes" },
  { name: "A2", value: 300, text: "300 Broken Streetlights" },
  { name: "B1", value: 100, text: "100 Fallen Trees" },
  { name: "B2", value: 80, text: "80 Graffiti Reports" },
  { name: "B3", value: 40, text: "40 Damaged Benches" },
  { name: "B4", value: 30, text: "30 Blocked Sidewalks" },
  { name: "B5", value: 50, text: "50 Overflowing Trash Bins" },
  { name: "C1", value: 100, text: "100 Water Leaks" },
  { name: "C2", value: 200, text: "200 Faded Road Markings" },
  { name: "D1", value: 150, text: "150 Unkempt Parks" },
  { name: "D2", value: 50, text: "50 Vandalized Signs" },
];

const renderLabel = (entry: any) => {
  return entry.text;
};

export default function InsightsPieChart() {
  return (
    <PieChart width={600} height={400}>
      <Pie
        data={data01}
        dataKey="value"
        cx={300}
        cy={200}
        outerRadius={80}
        fill={colors.otherPurple}
      />
      <Pie
        data={data02}
        dataKey="value"
        cx={300}
        cy={200}
        innerRadius={90}
        outerRadius={110}
        fill={colors.purple}
        label={renderLabel}
      />
    </PieChart>
  );
}
