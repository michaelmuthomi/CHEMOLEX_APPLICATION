import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Box, Clock, Clock1, Clock10, Smartphone } from "lucide-react-native";
import { H3, H4, H5, H6, P } from "./ui/typography";
import { formatDate } from "~/lib/format-date";
import { Button } from "./ui/button";
import { formatTime } from "~/lib/format-time";
import { TransactionDetailsModal } from "./sheets/transactionDetails";

export const FinanceCard = ({
  transaction,
  onViewDetails,
}: {
  transaction: any;
  onViewDetails: any;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  return (
    <TouchableOpacity className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <View className="w-full relative overflow-clip">
        <View className="flex items-start absolute right-[-14px] top-[-14px]">
          <View
            className={`p-2 px-4 rounded-bl-lg rounded-tr-lg flex-row items-center w-auto ${
              transaction.status === "pending" ? "bg-orange-300" : "bg-green-300"
            }`}
          >
            <Clock
              color={transaction.status === "pending" ? "#9a3412" : "#166534"}
              size={14}
            />
            <H5
              className={`${
                transaction.status === "pending"
                  ? "text-orange-900"
                  : "text-green-900"
              } ml-2 text-base capitalize`}
            >
              {transaction.status}
            </H5>
          </View>
        </View>

        <View className="mb-6">
          <H3 className="text-lg text-gray-800 mb-2">{transaction.services.name}</H3>
          <H4 className="text-gray-600 text-base w-3/4" numberOfLines={3}>
            {transaction.services.description}
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
              {formatDate(transaction.created_at)} &#8226;{" "}
              {formatTime(transaction.created_at)}
            </H5>
          </Button>
          <TransactionDetailsModal
            sheetTrigger={
              <Button
                // onPress={() => onAssign(order.id)}
                className="rounded-full flex-1 bg-green-800"
                size={"lg"}
                variant="default"
              >
                <H5 className=" text-white">{"Details"}</H5>
              </Button>
            }
            product={transaction.products}
            transaction={transaction}
            visible={modalVisible && selectedOrderId === transaction.id}
            onAssign={() => console.log("Assigned")}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
