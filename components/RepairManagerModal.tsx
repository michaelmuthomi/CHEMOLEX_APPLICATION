import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { X } from "lucide-react-native";

type RepairDetailsModalProps = {
  visible: boolean;
  repair: Repair | null;
  onClose: () => void;
  onUpdateStatus: (repairId: number, newStatus: RepairStatus) => void;
};

export const RepairDetailsModal: React.FC<RepairDetailsModalProps> = ({
  visible,
  repair,
  onClose,
  onUpdateStatus,
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
        <View className="bg-white rounded-t-3xl p-6 h-5/6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold">Repair Details</Text>
            <TouchableOpacity onPress={onClose}>
              <X className="w-6 h-6 text-gray-500" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <DetailItem label="Repair ID" value={`#${repair.id}`} />
            <DetailItem label="Status" value={repair.status} />
            <DetailItem label="Device" value={repair.deviceName} />
            <DetailItem label="Device Type" value={repair.deviceType} />
            <DetailItem label="Issue" value={repair.issueDescription} />
            <DetailItem label="Due Date" value={repair.dueDate} />
            <Text className="text-lg font-bold mt-4 mb-2">
              Required Products
            </Text>
            {repair.requiredProducts.map((product, index) => (
              <View key={index} className="mb-2">
                <Text className="text-base text-gray-800">{product.name}</Text>
                <Text className="text-sm text-gray-600">
                  Quantity: {product.quantity}
                </Text>
              </View>
            ))}
            <Text className="text-lg font-bold mt-4 mb-2">Repair Notes</Text>
            <Text className="text-base text-gray-800">
              {repair.repairNotes || "No notes yet."}
            </Text>
          </ScrollView>
          <View className="flex-row justify-between mt-4">
            {repair.status !== "In Progress" && (
              <TouchableOpacity
                className="bg-blue-500 py-2 px-4 rounded-lg flex-1 mr-2"
                onPress={() => onUpdateStatus(repair.id, "In Progress")}
              >
                <Text className="text-white text-center font-semibold">
                  Start Repair
                </Text>
              </TouchableOpacity>
            )}
            {repair.status !== "Completed" && (
              <TouchableOpacity
                className="bg-green-500 py-2 px-4 rounded-lg flex-1 ml-2"
                onPress={() => onUpdateStatus(repair.id, "Completed")}
              >
                <Text className="text-white text-center font-semibold">
                  Mark as Completed
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
