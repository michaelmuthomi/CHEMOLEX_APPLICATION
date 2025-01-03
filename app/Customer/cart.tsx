import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Minus, Plus, MoreHorizontal } from "lucide-react-native";
import { useCart } from "~/lib/cart-context";
import { formatPrice } from "~/lib/format-price";
import { H1, H3, H4, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { useNavigation } from "expo-router";

export default function Tab() {
  const navigation = useNavigation()
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();

  return (
    <SafeAreaView className="flex-1 pt-14 p-4">
      <ScrollView>
        <H1>Cart</H1>

        {items.map((item) => (
          <View key={item.product_id}>
            <View className="flex-row items-center gap-4 py-4">
              <View className="flex-1 h-28">
                <H4 style={styles.productName}>{item.name}</H4>
                <P style={styles.price}>{formatPrice(item.price)}</P>

                <View className="flex-row items-center gap-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() =>
                      updateQuantity(item.product_id, item.quantity - 1)
                    }
                  >
                    <Minus size={20} color="#fff" />
                  </Button>
                  <P style={styles.quantityText}>{item.quantity}</P>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() =>
                      updateQuantity(item.product_id, item.quantity + 1)
                    }
                  >
                    <Plus size={20} color="#fff" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => removeFromCart(item.product_id)}
                  >
                    <MoreHorizontal size={20} color="#fff" />
                  </Button>
                </View>
              </View>
              <Image
                source={{ uri: item.image_url }}
                style={styles.productImage}
              />
            </View>
          </View>
        ))}

        {items.length > 0 ? (
          <Button
            variant="outline"
            className="p-4 rounded-full flex-row justify-between items-center"
            onPress={() => navigation.navigate("checkout")}
          >
            <P className="text-white">Continue to checkout</P>
            <P className="text-white">{formatPrice(getCartTotal())}</P>
          </Button>
        ) : (
          <View className="gap-6">
            <Image
              source={require("~/assets/images/EmptyCart.png")}
              className="w-full h-full rounded-t-lg scale-90"
              resizeMode="contain"
            />
            <H3 className="text-center">Your Basket is empty :(</H3>
            <H4 className="text-center text-zinc-400 leading-relaxed">
              Looks like you haven't added anything {"\n"} to your cart yet
            </H4>
            <TouchableOpacity
              onPress={() => navigation.navigate("index")}
            >
              <H4 className="text-orange-400 text-base text-center">
                Start Shopping
              </H4>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    padding: 16,
  },
  productCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  productDetails: {
    flexDirection: "row",
    gap: 16,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 25,
    padding: 4,
    alignSelf: "flex-start",
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    paddingHorizontal: 16,
    fontSize: 16,
  },
  moreButton: {
    marginLeft: 8,
    padding: 8,
  },
  checkoutButton: {
    backgroundColor: "#6366f1",
    margin: 16,
    padding: 16,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  checkoutButtonPrice: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyCart: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontSize: 16,
    color: "#666",
  },
});
