import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import {
  ChevronLeft,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
} from "lucide-react-native";
import { useCart } from "~/lib/cart-context";
import { formatPrice } from "~/lib/format-price";
import { H1, H2, H3, H4, H5, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";

export default function Tab() {
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
      <ScrollView style={styles.content}>
        <View className="w-full bg-[#121212]">
          <Image
            source={{ uri: product.image_url }}
            className="w-full h-80 mix-blend-multiply bg-white"
            resizeMode="contain"
          />
        </View>

        <View className="p-4 gap-10">
          <View>
            <P
              style={styles.subtitle}
              className="uppercase text-sm text-gray-500"
            >
              {product.category || "Beauty Product"}
            </P>

            <H2 className="border-b-0">{product.name}</H2>

            <View className="flex-row justify-between items-center">
              <H3 className="text-xl text-neutral-200">
                {formatPrice(product.price)}
              </H3>
              <P className="text-neutral-500">
                {product.stock_quantity || "Not available"} in stock
              </P>
            </View>
          </View>
          <View className="gap-2">
            <P className="uppercase text-sm text-gray-500">Product Details</P>
            <H4 className="text-neutral-200 text-lg leading-relaxed">
              {product.description || "No description available"}
            </H4>
          </View>
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-between p-4 border-t-[1px] border-zinc-800 w-full">
        <View className="flex-row w-auto items-center gap-4">
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(-1)}
          >
            <Minus size={20} color="#fff" />
          </TouchableOpacity>
          <P className="color-white text-2xl">{quantity}</P>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(1)}
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Button
          onPress={handleAddToCart}
          className="flex-1 rounded-full"
          size={"lg"}
          variant="default"
        >
          <H5 className=" text-black">
            {"Add to Cart"} {formatPrice(product.price * quantity)}
          </H5>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    margin: 16,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productInfo: {
    padding: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    marginBottom: 24,
  },
  expandableSection: {
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    paddingTop: 16,
  },
  expandableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expandableTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  expandableContent: {
    marginTop: 16,
  },
  expandableText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 12,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  brandFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    gap: 8,
  },
  brandLogo: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  brandName: {
    fontSize: 16,
    fontWeight: "500",
  },
  footerText: {
    color: "#666",
  },
  mobbinLogo: {
    width: 80,
    height: 20,
    resizeMode: "contain",
  },
});
