import React from "react";
import { View, Text } from "react-native";
import { H4, H5, P } from "./ui/typography";

type StatisticsCardProps = {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
};

export const StatisticsCard = ({
  title,
  value,
  trend,
  className = "",
}: StatisticsCardProps) => {
  return (
    <View className={`bg-white rounded-sm p-4 shadow-sm ${className}`}>
      <H5 className="text-gray-600 text-sm mb-2">{title}</H5>
      <H4 className="text-2xl text-gray-900">{value}</H4>
      {trend && (
        <View className="flex-row items-center mt-1">
          <P
            className={`text-sm ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </P>
        </View>
      )}
    </View>
  );
};
