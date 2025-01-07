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
import { Minus, Plus, MoreHorizontal, Trash } from "lucide-react-native";
import { useCart } from "~/lib/cart-context";
import { formatPrice } from "~/lib/format-price";
import { H1, H3, H4, H5, H6, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { useNavigation } from "expo-router";

export default function Tab() {
  const navigation = useNavigation()
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="pt-4 p-4">
        {items.map((item) => (
          <View key={item.product_id}>
            <View className="flex-row items-center gap-4 py-4">
              <View className="flex-1 flex-row gap-2 h-28">
                <Image
                  source={{ uri: item.image_url }}
                  className="w-10 h-10 mt-[10px] rounded-full"
                />
                <View className="flex-1">
                  <H3>{item.name}</H3>
                  <H6>{formatPrice(item.price)}</H6>

                  <View className="flex-row items-center gap-4 mt-auto w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-0"
                      onPress={() =>
                        updateQuantity(item.product_id, item.quantity - 1)
                      }
                    >
                      <Minus size={20} color="#fff" />
                    </Button>
                    <P className="color-white text-3xl">{item.quantity}</P>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-0"
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
                      className="ml-auto border-0"
                    >
                      <Trash size={20} color="#fff" />
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {items.length > 0 ? (
        <View>
          <View className="w-full gap-6 p-6">
            <View className="gap-4">
              <View className="flex-row justify-between">
                <P>Subtotal</P>
                <P>{formatPrice(getCartTotal())}</P>
              </View>
              <View className="flex-row justify-between">
                <P>Shipping</P>
                <P>Free</P>
              </View>
            </View>
            <View className="flex-row justify-between border-t-[1px] border-zinc-800 pt-4">
              <H4>Total</H4>
              <H4>{formatPrice(getCartTotal())}</H4>
            </View>
          </View>
          <Button
            className="rounded-full mx-4 mb-4"
            size={"lg"}
            variant="default"
            onPress={() => navigation.navigate("checkout")}
          >
            <H5 className=" text-black">{"Proceed to checkout"} &rarr;</H5>
          </Button>
        </View>
      ) : (
        <View className="gap-6 align-top">
          <Image
            source={require("~/assets/images/EmptyCart.png")}
            className="w-full h-1/2 rounded-t-lg scale-90"
            resizeMode="contain"
          />
          <H3 className="text-center">Your Basket is empty :(</H3>
          <H4 className="text-center text-zinc-400 leading-relaxed">
            Looks like you haven't added anything {"\n"} to your cart yet
          </H4>
          <TouchableOpacity onPress={() => navigation.navigate("index")}>
            <H4 className="text-orange-400 text-base text-center">
              Start Shopping
            </H4>
          </TouchableOpacity>
        </View>
      )}
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
