import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Clock,  User } from "lucide-react-native";
import { H3, H4, H5 } from "./ui/typography";
import { formatDate } from "~/lib/format-date";
import { formatTime } from "~/lib/format-time";
import { Button } from "./ui/button";
import { checkUser, supabase } from "~/lib/supabase";
import { useEmail } from "~/app/EmailContext";
import displayNotification from "~/lib/Notification";

type RepairItemProps = {
  repair: any;
  onViewDetails: (repairId: number) => void;
};

export const RepairItem: React.FC<RepairItemProps> = ({
  repair,
  onViewDetails,
}) => {
  const [supervisorId, setSupervisorId] = useState()
  const emailcontext = useEmail()


  async function updateSupervisorId() {
    setSupervisorId(await checkUser(emailcontext.email));
  }
  useEffect(() => {
    updateSupervisorId();
  })

  async function approveRepair(
    repair_id: number,
  ) {
    const { data, error } = await supabase
      .from("repairs")
      .update({ supervisor_id: supervisorId.user_id }) // Update the supervisor_id column
      .eq("id", repair_id) // Match the repair by its ID
      .single();

    if (error) {
      console.log(error.message)
      displayNotification(error.message, 'danger')
    } else {
      displayNotification('Repair approved successfully', 'success')
    }
  }
  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <View className="w-full relative overflow-clip">
        <View className="flex items-start absolute right-[-14px] top-[-14px]">
          <View
            className={`p-2 px-4 rounded-bl-lg rounded-tr-lg flex-row items-center w-auto ${
              repair.status === "pending" ? "bg-orange-300" : "bg-green-300"
            }`}
          >
            <Clock
              color={repair.status === "pending" ? "#9a3412" : "#166534"}
              size={14}
            />
            <H5
              className={`${
                repair.status === "pending"
                  ? "text-orange-900"
                  : "text-green-900"
              } ml-2 text-base capitalize`}
            >
              {repair.status}
            </H5>
          </View>
        </View>
        <H3 className="text-lg text-gray-600 mb-2">
          {repair.products?.name || "No product name"}
        </H3>
        <H4 className="text-gray-600 text-base w-3/4" numberOfLines={3}>
          {repair.products?.description || "No product description"}
        </H4>
        <View className="flex-row items-center mb-1 mt-2">
          <H4 className="text-gray-600 text-base w-3/4" numberOfLines={3}>
            {repair.users?.full_name
              ? `Technician: ${repair.users?.full_name}`
              : "No technician assigned"}
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
              {formatDate(repair.created_at)} &#8226;{" "}
              {formatTime(repair.created_at)}
            </H5>
          </Button>
          <Button
            onPress={() => approveRepair(repair.id, supervisorId)}
            className="rounded-full flex-1 bg-green-800"
            size={"lg"}
            variant="default"
          >
            <H5 className=" text-white">{"Approve"}</H5>
          </Button>
        </View>
      </View>
    </View>
  );
};
