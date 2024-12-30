import { BottomSheetView } from "@gorhom/bottom-sheet";
import { H3, H5, P } from "../ui/typography";
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as React from "react";
import { useCallback, useState } from "react";
import { ActivityIndicator, View, Image } from "react-native";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import displayNotification from "~/lib/Notification";

export function AddToCartModal({ sheetTrigger, product }) {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // state
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleAddToCart = async () => {
    if (quantity > 0 && quantity <= product.stock_quantity) {
      setLoading(true);
      // Simulate adding to cart
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network request
      displayNotification(
        `Added ${quantity} ${product.name}(s) to your cart`,
        "success"
      );
      bottomSheetModalRef.current?.dismiss();
      setLoading(false);
    } else {
      displayNotification("Please enter a valid quantity", "danger");
    }
  };

  return (
    <>
      {React.cloneElement(sheetTrigger as React.ReactElement, {
        onPress: handlePresentModalPress,
      })}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: "#0e0e0e" }}
        handleIndicatorStyle={{ backgroundColor: "white" }}
      >
        <BottomSheetView className="p-6 gap-6">
          {/* Title and Product Image */}
          <View className="items-center mb-4">
            <H3 className="text-2xl mb-2 text-center">{product.name}</H3>
            <Image
              source={{ uri: product.image_url }}
              className="w-full h-48 object-cover mb-4"
            />
          </View>

          {/* Product Details */}
          <View className="gap-4">
            <P className="text-gray-500">Description: {product.description}</P>
            <P className="text-gray-500">Supplier: {product.supplier}</P>
            <P className="text-gray-500">Category: {product.category}</P>
            <P className="text-lg font-semibold">
              Price: ${product.price.toFixed(2)}
            </P>
            <P className="text-gray-500">
              Stock: {product.stock_quantity} available
            </P>

            {/* Quantity Input */}
            <View className="gap-1">
              <P className="">Quantity</P>
              <Input
                placeholder="Enter quantity"
                onChangeText={(text) => setQuantity(Number(text))}
                keyboardType="numeric"
                className="bg-transparent !h-14"
                style={{ fontFamily: "Inter_500Medium" }}
                value={quantity.toString()}
              />
            </View>

            {/* Add to Cart Button */}
            <Button
              onPress={handleAddToCart}
              className="w-full rounded-full"
              size={"lg"}
              variant="default"
              disabled={loading}
            >
              <H5 className="text-black">
                {loading ? <ActivityIndicator color="#fff" /> : "Add to Cart"}
              </H5>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
