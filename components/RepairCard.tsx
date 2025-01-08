import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Box,
  Check,
  CheckCircle2,
  Clock,
  Clock1,
  Clock10,
  Smartphone,
} from "lucide-react-native";
import { H3, H4, H5, H6, P } from "./ui/typography";
import { formatDate } from "~/lib/format-date";
import { Button } from "./ui/button";
import { formatTime } from "~/lib/format-time";
import { RepairDetailsModal } from "./sheets/repairDetails";
import { supabase } from "~/lib/supabase";
import displayNotification from "~/lib/Notification";

export const RepairCard = ({
  repair,
  onViewDetails,
}: {
  repair: any;
  onViewDetails: any;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const markAsComplete = async (repairId: number) => {
    const { data, error } = await supabase
      .from("repairs")
      .update({ completion_status: "complete" })
      .eq("id", repairId);

    if (error) {
      console.error("Error marking as complete:", error);
      displayNotification('Error marking as complete', 'danger')
    }
    displayNotification('Repair marked as complete', 'success')
  };

  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <View className="w-full relative overflow-clip">
        <View className="flex items-start absolute right-[-14px] top-[-14px]">
          <View
            className={`p-2 px-4 rounded-bl-lg rounded-tr-lg flex-row items-center w-auto ${
              repair.status === "pending"
                ? "bg-orange-300"
                : repair.technician_status === "accepted" ||
                  repair.technician_status === "accepted" ||
                  repair.status === "assigned"
                ? "bg-purple-300"
                : "bg-green-300"
            }`}
          >
            <CheckCircle2
              color={
                repair.status === "pending"
                  ? "#9a3412"
                  : repair.technician_status === "accepted" ||
                    repair.technician_status === "accepted" ||
                    repair.status === "assigned"
                  ? "#581c87"
                  : "#166534"
              }
              size={14}
            />
            <H5
              className={`${
                repair.status === "pending"
                  ? "text-orange-900"
                  : repair.technician_status === "accepted" ||
                    repair.technician_status === "accepted" ||
                    repair.status === "assigned"
                  ? "text-purple-900"
                  : "text-green-900"
              } ml-2 text-base capitalize`}
            >
              {repair?.technician_status !== "pending"
                ? repair?.technician_status
                : repair.status}
            </H5>
          </View>
        </View>

        <View className="mb-6">
          <H3 className="text-lg text-gray-800 mb-2">{repair.services.name}</H3>
          <H4 className="text-gray-600 text-base w-3/4" numberOfLines={3}>
            {repair.services.description}
          </H4>
        </View>

        <View className="flex-row w-full gap-6 justify-between">
          <Button
            className="rounded-full border-black bg-transparent px-0"
            size={"lg"}
            variant="default"
            disabled
          >
            <H5 className="text-black text-left">
              {repair.technician_status === "accepted" ? (
                formatDate(repair.created_at)
              ) : (
                <>
                  {formatDate(repair.created_at)} &#8226;{" "}
                  {formatTime(repair.created_at)}
                </>
              )}
            </H5>
          </Button>
          {repair.technician_status === "accepted" ? (
            <Button
              onPress={() => markAsComplete(repair.id)}
              className="rounded-full flex-1 bg-green-800"
              size={"lg"}
              variant="default"
            >
              <H5 className=" text-white">{"Mark As Complete"}</H5>
            </Button>
          ) : (
            <RepairDetailsModal
              sheetTrigger={
                <Button
                  className="rounded-full flex-1 bg-green-800"
                  size={"lg"}
                  variant="default"
                >
                  <H5 className=" text-white">{"Details"}</H5>
                </Button>
              }
              product={repair.products}
              repair={repair}
              visible={modalVisible && selectedOrderId === repair.id}
              onAssign={() => console.log("Assigned")}
            />
          )}
        </View>
      </View>
    </View>
  );
};
