import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { X } from "lucide-react-native";

type ProductDetailsModalProps = {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onUpdateStock: (productId: number, newStock: number) => void;
};

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  visible,
  product,
  onClose,
  onUpdateStock,
}) => {
  const [newStock, setNewStock] = useState("");

  if (!product) return null;

  const handleUpdateStock = () => {
    const updatedStock = parseInt(newStock);
    if (!isNaN(updatedStock) && updatedStock >= 0) {
      onUpdateStock(product.product_id, updatedStock);
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
            <Text className="text-2xl font-bold">Product Details</Text>
            <TouchableOpacity onPress={onClose}>
              <X className="w-6 h-6 text-gray-500" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <Image
              source={{
                uri: product.image_url.replace(/^http:\/\//i, "https://"),
              }}
              className="w-full h-48 rounded-lg mb-4"
            />
            <DetailItem label="Name" value={product.name} />
            <DetailItem label="Category" value={product.category} />
            <DetailItem label="Description" value={product.description} />
            <DetailItem label="Price" value={`$${product.price.toFixed(2)}`} />
            {/* <DetailItem
              label="Current Stock"
              value={
                product.stock_quantity && product.stock_quantity.toString()
              }
            />
            <DetailItem
              label="Reorder Level"
              value={product.reorder_level && product.reorder_level.toString()}
            /> */}

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
