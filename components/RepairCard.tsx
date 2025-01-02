import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Clock, Smartphone, Tool } from "lucide-react-native";

type RepairCardProps = {
  repair: Repair;
  onViewDetails: (repairId: number) => void;
};

export const RepairCard: React.FC<RepairCardProps> = ({
  repair,
  onViewDetails,
}) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-sm p-4 mb-4"
      onPress={() => onViewDetails(repair.id)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-800">
          Repair #{repair.id}
        </Text>
        <Text
          className={`text-sm font-semibold ${
            repair.status === "Assigned"
              ? "text-yellow-500"
              : repair.status === "In Progress"
              ? "text-blue-500"
              : "text-green-500"
          }`}
        >
          {repair.status}
        </Text>
      </View>
      <Text className="text-gray-600 mb-2">{repair.deviceName}</Text>
      <View className="flex-row items-center mb-1">
        <Smartphone className="w-4 h-4 text-gray-400 mr-2" />
        <Text className="text-sm text-gray-600">{repair.deviceType}</Text>
      </View>
      <View className="flex-row items-center mb-1">
        <Tool className="w-4 h-4 text-gray-400 mr-2" />
        <Text className="text-sm text-gray-600">{repair.issueDescription}</Text>
      </View>
      <View className="flex-row items-center">
        <Clock className="w-4 h-4 text-gray-400 mr-2" />
        <Text className="text-sm text-gray-600">Due: {repair.dueDate}</Text>
      </View>
    </TouchableOpacity>
  );
};
