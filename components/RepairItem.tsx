import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Clock, Tool, User } from "lucide-react-native";

type RepairItemProps = {
  repair: Repair;
  onViewDetails: (repairId: number) => void;
};

export const RepairItem: React.FC<RepairItemProps> = ({
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
            repair.status === "Pending Approval"
              ? "text-yellow-500"
              : repair.status === "In Progress"
              ? "text-blue-500"
              : "text-green-500"
          }`}
        >
          {repair.status}
        </Text>
      </View>
      <Text className="text-gray-600 mb-2">{repair.productName}</Text>
      <View className="flex-row items-center mb-1">
        <User className="w-4 h-4 text-gray-400 mr-2" />
        <Text className="text-sm text-gray-600">{repair.customerName}</Text>
      </View>
      <View className="flex-row items-center mb-1">
        <Tool className="w-4 h-4 text-gray-400 mr-2" />
        <Text className="text-sm text-gray-600">{repair.technicianName}</Text>
      </View>
      <View className="flex-row items-center">
        <Clock className="w-4 h-4 text-gray-400 mr-2" />
        <Text className="text-sm text-gray-600">
          {repair.estimatedCompletion}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
