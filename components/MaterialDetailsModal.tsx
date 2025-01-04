import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { X } from "lucide-react-native";

type MaterialDetailsModalProps = {
  visible: boolean;
  material: Material | null;
  onClose: () => void;
  onUpdateStock: (materialId: number, newStock: number) => void;
};

export const MaterialDetailsModal: React.FC<MaterialDetailsModalProps> = ({
  visible,
  material,
  onClose,
  onUpdateStock,
}) => {
  const [newStock, setNewStock] = React.useState("");

  if (!material) return null;

  const handleUpdateStock = () => {
    const updatedStock = parseInt(newStock);
    if (!isNaN(updatedStock) && updatedStock >= 0) {
      onUpdateStock(material.id, updatedStock);
      setNewStock("");
    }
  };

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
            <Text className="text-2xl font-bold">Material Details</Text>
            <TouchableOpacity onPress={onClose}>
              <X className="w-6 h-6 text-gray-500" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <DetailItem label="Name" value={material.name} />
            <DetailItem label="Category" value={material.category} />
            <DetailItem
              label="Current Stock"
              value={material.currentStock.toString()}
            />
            <DetailItem
              label="Minimum Stock"
              value={material.minimumStock.toString()}
            />
            <DetailItem
              label="Required Quantity"
              value={material.requiredQuantity.toString()}
            />
            <DetailItem label="Unit" value={material.unit} />
            <DetailItem label="Description" value={material.description} />

            <Text className="text-lg font-bold mt-4 mb-2">Update Stock</Text>
            <View className="flex-row items-center">
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 flex-1 mr-2"
                placeholder="Enter new stock quantity"
                keyboardType="numeric"
                value={newStock}
                onChangeText={setNewStock}
              />
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onPress={handleUpdateStock}
              >
                <Text className="text-white font-semibold">Update</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
