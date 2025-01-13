import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Package, AlertTriangle, ListTodo } from "lucide-react-native";
import { H3, H4, H5, P } from "./ui/typography";

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
      className="bg-white shadow-sm mb-4 py-4 px-2 flex-row relative"
      onPress={() => onViewDetails(product.product_id)}
    >
      <View className="w-full relative overflow-clip">
        <View className="flex items-start absolute right-[-14px] top-[-14px]">
          <TouchableOpacity
            className={`p-2 px-4 rounded-bl-lg rounded-tr-lg flex-row items-center w-auto ${
              product.stock_quantity <= 10 ? "bg-orange-300" : "bg-green-300"
            }`}
          >
            <ListTodo
              color={`${product.stock_quantity <= 10 ? "#9a3412" : "#166534"}`}
              size={19}
            />
            <H5
              className={`${
                product.stock_quantity <= 10
                  ? "text-orange-900"
                  : "text-green-900"
              } ml-2 text-base`}
            >
              InStock {product.stock_quantity}
            </H5>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between items-center mb-2">
          <H3 className="text-lg text-gray-800">{product.name}</H3>
        </View>
        <H4 className="text-gray-600 text-base mb-2 w-3/4" numberOfLines={3}>
          {product.description}
        </H4>
        <View className="flex-row items-center justify-between w-full">
          <H4 className="text-blue-600 w-1/2 text-base">
            {product.stock_quantity <= 10 ? "ReStock Now" : "Manage Stock"}
          </H4>
          <H4 className="text-blue-600 text-right text-lg">&rarr;</H4>
        </View>
        <View
          className={`rounded-md overflow-0 mt-6 pt-6 pl-6 h-48 ${
            product.stock_quantity <= 10 ? "bg-orange-300" : "bg-purple-300"
          }`}
        >
          <Image
            source={{
              uri: product.image_url.replace(/^http:\/\//i, "https://"),
            }}
            className="w-full rounded-tl-md h-full object-cover mix-blend-multiply bg-neutral-400"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
