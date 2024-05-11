import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import colors from "../Styles/colors";
import { ChatInsights } from '../utils/interfaces';

interface InsightsBarChartProps {
    chatInsights: ChatInsights | undefined;
}

const InsightsBarChart: React.FC<InsightsBarChartProps> = ({ chatInsights }) => {
  const userTypeToName: { [key: string]: string } = {
    prospectiveResident: 'Prospective Resident',
    owner: 'Owner',
    currentResident: 'Current Resident'
  };

  const chartData = chatInsights?.allTimeUserTypes
    .filter(userType => userType.userType && userType.userType in userTypeToName)
    .map(userType => {
      const name = userType.userType ? userTypeToName[userType.userType as keyof typeof userTypeToName] : 'Unknown';
      return { name, "Unique Sessions Count": userType.uniqueSessionsCount };
    }) || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        style={{ fontFamily: 'Montserrat' }}
        barSize={20}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Bar dataKey="Unique Sessions Count" fill={colors.otherPurple} label={{ position: 'top' }} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default InsightsBarChart;
