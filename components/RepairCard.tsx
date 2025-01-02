import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Box, Clock, Clock1, Clock10, Smartphone } from "lucide-react-native";
import { H3, H4, H5, H6, P } from "./ui/typography";
import { formatDate } from "~/lib/format-date";


export const RepairCard = ({
  repair,
  onViewDetails,
}: {
  repair: any;
  onViewDetails: any;
}) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-sm p-4 mb-4"
      onPress={() => onViewDetails(repair.id)}
    >
      <View className="flex-row justify-between items-center mb-2">
        {/* <H5
        className={`text-sm font-semibold capitalize ${
          repair.status === "Assigned"
            ? "text-yellow-500"
            : repair.status === "In Progress"
            ? "text-blue-500"
            : "text-green-500"
        }`}
      >
        {repair.status}
      </H5> */}
      </View>
      <H4 className="text-gray-600 mb-2">{repair.services.name}</H4>
      {/* <View className="flex-row items-center mb-1">
        <P className="text-sm text-gray-600">{repair.products.name}</P>
      </View> */}
      <View className="flex-row items-center mb-1">
        <H4 className="text-sm text-gray-600">{repair.services.description}</H4>
      </View>
      <View className="flex-row items-center justify-between mt-8 gap-2">
        <View className="flex-row items-center gap-2">
          <Clock10 color={"#4b5563"} size={14} />
          <H5 className="text-sm text-gray-600">
            Created: {formatDate(repair.created_at)}
          </H5>
        </View>
        <H5 className="text-sm text-gray-600">View &rarr;</H5>
      </View>
    </TouchableOpacity>
  );
};
