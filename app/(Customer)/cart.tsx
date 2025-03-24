import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Minus, Plus, MoreHorizontal, Trash, ArrowLeft } from "lucide-react-native";
import { useCart } from "~/lib/cart-context";
import { formatPrice } from "~/lib/format-price";
import { H1, H3, H4, H5, H6, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { useNavigation } from "expo-router";

export default function Page() {
  const navigation = useNavigation();
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();
    
  return (
    <SafeAreaView className="flex-1">
      <Button
        onPress={() => navigation.goBack()}
        className="w-1/3 mt-14 mb-4 mx-4 bg-zinc-900 rounded-full z-10 flex-row gap-2"
      >
        <ArrowLeft size={20} color={"#fff"} />
        <P className="text-white">Back</P>
      </Button>
      <ScrollView className="">
        {items.map((item) => (
          <View className="bg-white mb-4 py-4 px-4 flex-row relative rounded-lg">
            <View className="w-full relative overflow-clip">
              <View className={`rounded-md h-48`}>
                <Image
                  source={{
                    uri: item.image_url.replace(/^http:\/\//i, "https://"),
                  }}
                  className="w-full h-full object-cover bg-neutral-400 rounded-md"
                  style={{ objectFit: "cover" }}
                />
              </View>
              <View>
                <H4 className="text-lg text-gray-800">{item.name}</H4>
              </View>
              <View className="flex-row items-center gap-4 mt-4 w-full">
                <H4 className="text-xl text-gray-400 text-right">
                  Total: {formatPrice(item.price * item.quantity)}
                </H4>
                <Button
                  variant="outline"
                  size="sm"
                  className="border rounded-md bg-transparent ml-auto"
                  onPress={() =>
                    updateQuantity(item.product_id, item.quantity - 1)
                  }
                >
                  <Minus size={20} color="#000" />
                </Button>
                <P className="text-black text-3xl">{item.quantity}</P>
                <Button
                  variant="outline"
                  size="sm"
                  className="border rounded-md bg-transparent"
                  onPress={() =>
                    updateQuantity(item.product_id, item.quantity + 1)
                  }
                >
                  <Plus size={20} color="#000" />
                </Button>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {items.length > 0 ? (
        <View>
          <View className="flex-row items-center justify-between gap-4 p-4 w-full">
            <Button
              className="w-auto p-0 rounded-full bg-transparent"
              size={"lg"}
              variant="default"
              disabled
            >
              <H5 className=" text-zinc-500">
                Total: {formatPrice(getCartTotal())}
              </H5>
            </Button>
            <Button
              className="rounded-full flex-1 bg-green-900"
              size={"lg"}
              variant="default"
              onPress={() => navigation.navigate("checkout")}
            >
              <H5 className="leading-0 text-white">{"Checkout"} &rarr;</H5>
            </Button>
          </View>
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
