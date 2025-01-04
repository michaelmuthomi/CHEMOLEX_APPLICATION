import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Package, AlertTriangle } from 'lucide-react-native';

type MaterialCardProps = {
  material: Material;
  onViewDetails: (materialId: number) => void;
};

export const MaterialCard: React.FC<MaterialCardProps> = ({ material, onViewDetails }) => {
  const isLowStock = material.currentStock < material.minimumStock;

  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-sm p-4 mb-4"
      onPress={() => onViewDetails(material.id)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-800">{material.name}</Text>
        {isLowStock && (
          <View className="bg-red-100 px-2 py-1 rounded-full">
            <Text className="text-xs text-red-600 font-semibold">Low Stock</Text>
          </View>
        )}
      </View>
      <Text className="text-gray-600 mb-2">{material.category}</Text>
      <View className="flex-row items-center mb-1">
        <Package className="w-4 h-4 text-gray-400 mr-2" />
        <Text className="text-sm text-gray-600">Current Stock: {material.currentStock}</Text>
      </View>
      <View className="flex-row items-center">
        <AlertTriangle className="w-4 h-4 text-gray-400 mr-2" />
        <Text className="text-sm text-gray-600">Required: {material.requiredQuantity}</Text>
      </View>
    </TouchableOpacity>
  );
};

