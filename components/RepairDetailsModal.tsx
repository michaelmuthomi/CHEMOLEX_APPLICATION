import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { X } from "lucide-react-native";

type RepairDetailsModalProps = {
  visible: boolean;
  repair: Repair | null;
  onClose: () => void;
  onApprove: (repairId: number) => void;
};

export const RepairDetailsModal: React.FC<RepairDetailsModalProps> = ({
  visible,
  repair,
  onClose,
  onApprove,
}) => {
  if (!repair) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white rounded-t-3xl p-6 h-3/4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold">Repair Details</Text>
            <TouchableOpacity onPress={onClose}>
              <X className="w-6 h-6 text-gray-500" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <DetailItem label="Repair ID" value={`#${repair.id}`} />
            <DetailItem label="Status" value={repair.status} />
            <DetailItem label="Product" value={repair.productName} />
            <DetailItem label="Customer" value={repair.customerName} />
            <DetailItem label="Technician" value={repair.technicianName} />
            <DetailItem
              label="Estimated Completion"
              value={repair.estimatedCompletion}
            />
            <DetailItem label="Description" value={repair.description} />
            <DetailItem label="Repair Notes" value={repair.repairNotes} />
            <DetailItem
              label="Parts Used"
              value={repair.partsUsed.join(", ")}
            />
          </ScrollView>
          {repair.status === "Pending Approval" && (
            <TouchableOpacity
              className="bg-green-500 py-3 px-4 rounded-lg mt-4"
              onPress={() => onApprove(repair.id)}
            >
              <Text className="text-white text-center font-semibold">
                Approve Repair
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View className="mb-4">
    <Text className="text-sm text-gray-600 mb-1">{label}</Text>
    <Text className="text-base text-gray-800">{value}</Text>
  </View>
);
