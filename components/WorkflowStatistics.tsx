import React from "react";
import { View, Text } from "react-native";
import { H1, H6 } from "./ui/typography";

type WorkflowStatisticsProps = {
  totalRepairs: number;
  pendingApproval: number;
  inProgress: number;
  completedToday: number;
};

export const WorkflowStatistics: React.FC<WorkflowStatisticsProps> = ({
  totalRepairs,
  pendingApproval,
  inProgress,
  completedToday,
}) => {
  return (
    <View className="flex-row flex-wrap -mx-2">
      <StatItem title="Total Repairs" value={totalRepairs} />
      <StatItem title="Pending Approval" value={pendingApproval} />
      <StatItem title="In Progress" value={inProgress} />
      <StatItem title="Completed Today" value={completedToday} />
    </View>
  );
};

const StatItem: React.FC<{ title: string; value: number }> = ({
  title,
  value,
}) => (
  <View className="w-1/2 px-2 mb-4">
    <View className="bg-white rounded-sm p-4 shadow-sm">
      <H6 className="text-gray-600 text-xs mb-1">{title}</H6>
      <H1 className="text-2xl text-gray-800">{value}</H1>
    </View>
  </View>
);
