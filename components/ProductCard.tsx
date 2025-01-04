import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Package, AlertTriangle } from "lucide-react-native";
import { H3, H5, P } from "./ui/typography";

type ProductCardProps = {
  product: Product;
  onViewDetails: (productId: number) => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
}) => {
  const isLowStock = product.stock_quantity < product.reorder_level;

  return (
    <TouchableOpacity
      className="bg-white shadow-sm mb-4 py-4 flex-row"
      onPress={() => onViewDetails(product.product_id)}
    >
      <Image
        source={{ uri: product.image_url }}
        className="w-20 h-20 rounded-lg mr-4"
      />
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-2">
          <H3 className="text-lg text-gray-800">{product.name}</H3>
          {isLowStock && (
            <View className="bg-red-100 px-2 py-1 rounded-full">
              <H5 className="text-xs text-red-600">Low Stock</H5>
            </View>
          )}
        </View>
        <H5 className="text-gray-600 mb-2">{product.category}</H5>
        <View className="flex-row w-full justify-between items-center mt-8">
          <View className="flex-row items-center mb-1 gap-2">
            <Package color={"#4b5563"} size={14} />
            <P className="text-sm text-gray-600">
              Stock: {product.stock_quantity}
            </P>
          </View>
          <View className="flex-row items-center gap-2">
            <AlertTriangle color={"#4b5563"} size={14} />
            <P className="text-sm text-gray-600">
              Reorder at: {product.reorder_level}
            </P>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
