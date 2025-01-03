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
import { H1, H3, H4, P } from "~/components/ui/typography";
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
    setQuantity((prev) => Math.max(1, prev + change));
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

        <View className="p-4 gap-6">
          <View>
            <P style={styles.subtitle} className="uppercase text-gray-500">
              {product.category || "Beauty Product"}
            </P>

            <H3 style={styles.title}>{product.name}</H3>

            <View className="flex-row justify-between items-center">
              <P>{formatPrice(product.price)}</P>
              <P>{product.stock_quantity || "Not available"} in stock</P>
            </View>
          </View>
          <View className="gap-2">
            <P>{product.description || "No description available"}</P>
          </View>
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-between p-4 border-t-[1px] border-gray-900">
        <View className="flex-row w-1/4 items-center">
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(-1)}
          >
            <Minus size={20} color="#fff" />
          </TouchableOpacity>
          <P style={styles.quantityText}>{quantity}</P>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(1)}
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Button
          onPress={handleAddToCart}
          variant="outline"
          className="w-3/4 rounded-full"
        >
          <P className="text-white">
            Add to Cart - {formatPrice(product.price * quantity)}
          </P>
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
