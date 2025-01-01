import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar, Clock, User } from "lucide-react-native";
import { H3, H4, H5, H6, P } from "./ui/typography";
import { formatDate } from "~/lib/format-date";
import { formatTime } from "~/lib/format-time";
import { Button } from "./ui/button";

type OrderItemProps = {
  order: Order;
  onAssign: (orderId: number) => void;
};

export const OrderItem: React.FC<OrderItemProps> = ({ order, onAssign }) => {
  const [loading, setLoading] = useState(false)
  return (
    <View className="p-4 h-40 flex ">
      <View>
        <View className="flex-row justify-end items-center mb-2">
          {/* <H6 className="text-sm text-gray-800">Order #{order.id}</H6> */}
        </View>
        <H3 className="text-white mb-2">{order.services.name}</H3>
        <View className="flex-row items-center mb-1 gap-2">
          <Calendar size={14} color={"#4b5563"} />
          <H5 className="text-sm text-gray-600">
            {formatDate(order.created_at)}
          </H5>
          <P className="text-sm text-gray-600">{formatTime(order.time)}</P>
          <P
            className={`text-sm capitalize ml-auto ${
              order.status === "pending" ? "text-yellow-500" : "text-green-500"
            }`}
          >
            {order.status}
          </P>
        </View>
        <View className="mt-auto">
          {order.status === "pending" && (
            <Button
              onPress={() => onAssign(order.id)}
              className="w-full rounded-full"
              size={"default"}
              variant="default"
              disabled={loading}
            >
              <H5 className=" text-black">
                {loading ? "Logging In" : "Assign Technician"}
              </H5>
            </Button>
          )}
        </View>
      </View>
      {order.status === "Assigned" && (
        <View className="bg-gray-100 py-2 px-4 rounded-lg mt-auto">
          <Text className="text-gray-700 text-center">
            Assigned to: {order.assignedTo}
          </Text>
        </View>
      )}
    </View>
  );
};
