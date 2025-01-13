import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {
  ChevronLeft,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react-native";
import { useCart } from "~/lib/cart-context";
import { formatPrice } from "~/lib/format-price";
import { H1, H2, H3, H4, H5, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Page() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const product = params.product ? JSON.parse(params.product) : null;

  if (!product) {
    return (
      <H1 className="flex-1 justify-center items-center">Product not found</H1>
    );
  }
  console.log("Product via Path: ", product);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) =>
      Math.min(Math.max(1, prev + change), product.stock_quantity)
    );
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigation.navigate("cart");
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="relative">
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.7)", "transparent"]}
          className="absolute top-0 left-0 h-36 w-full"
        />
        <View className="w-full">
          <Button
            onPress={() => navigation.goBack()}
            className="w-20 absolute top-4 left-4 mt-6 ml-2 bg-white rounded-full z-10"
          >
            <ArrowLeft size={20} color={"#000"} />
          </Button>
          <Image
            source={{
              uri: product.image_url.replace(/^http:\/\//i, "https://"),
            }}
            className="w-full h-80 bg-white z-0"
            resizeMode="contain"
            style={{ zIndex: -1 }}
          />
        </View>

        <View className="p-4 gap-10">
          <View>
            <DetailItem label={product.category} value={product.name} />
            <DetailItem label={"Product Details"} value={product.description} />
            <View className="flex-row w-full mt-4">
              <View className="w-1/2 flex-row">
                <DetailItem
                  label={"Price"}
                  value={formatPrice(product.price)}
                />
              </View>
              <DetailItem
                label={"InStock"}
                value={`${product.stock_quantity} Products`}
              />
            </View>
            <View className="mb-4">
              <H5 className="text-sm text-gray-600">{"Quantity"}</H5>
              <View className="flex-row w-auto items-center gap-4 mt-2">
                <TouchableOpacity
                  className="bg-zinc-900 p-2 rounded-full"
                  onPress={() => handleQuantityChange(-1)}
                >
                  <Minus size={18} color="#fff" />
                </TouchableOpacity>
                <P className="color-white text-2xl">{quantity}</P>
                <TouchableOpacity
                  className="bg-zinc-900 p-2 rounded-full"
                  onPress={() => handleQuantityChange(1)}
                >
                  <Plus size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="flex-row items-center justify-between gap-4 p-4 w-full">
        <Button
          className="w-auto p-0 rounded-full bg-transparent"
          size={"lg"}
          variant="default"
          disabled
        >
          <H5 className=" text-zinc-500">
            Total: {formatPrice(product.price * quantity)}
          </H5>
        </Button>
        <Button
          onPress={handleAddToCart}
          className="flex-1 rounded-full"
          size={"lg"}
          variant="default"
        >
          <H5 className=" text-black">{"Add to Cart"}</H5>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const DetailItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View className="mb-4">
    <H5 className="text-sm text-gray-600">{label}</H5>
    <P className="text-lg text-white">{value}</P>
  </View>
);
