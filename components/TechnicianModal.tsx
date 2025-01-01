import React from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";

type TechnicianModalProps = {
  visible: boolean;
  technicians: Technician[];
  onAssign: (technicianId: number) => void;
  onClose: () => void;
};

export const TechnicianModal: React.FC<TechnicianModalProps> = ({
  visible,
  technicians,
  onAssign,
  onClose,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white rounded-t-3xl p-6 h-3/4">
          <Text className="text-2xl font-bold mb-4">Select Technician</Text>
          <FlatList
            data={technicians}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="py-3 border-b border-gray-200"
                onPress={() => onAssign(item.id)}
              >
                <Text className="text-lg">{item.name}</Text>
                <Text className="text-sm text-gray-600">
                  Speciality: {item.speciality}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            className="mt-4 bg-gray-200 py-2 px-4 rounded-lg"
            onPress={onClose}
          >
            <Text className="text-center font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
