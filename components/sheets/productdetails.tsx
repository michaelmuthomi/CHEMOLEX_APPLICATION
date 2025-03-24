import { BottomSheetView } from "@gorhom/bottom-sheet";
import { H3, H5, P } from "../ui/typography";
import { useRef, useState, useEffect } from "react";
import { H4 } from "../ui/typography";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as React from "react";
import { useCallback } from "react";
import { ScrollView, View, Image, TouchableOpacity } from "react-native";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import displayNotification from "~/lib/Notification";
import { ArrowLeft, ArrowRight, Box, Coins, Group, ImageIcon, ShieldCloseIcon, SquareStack } from "lucide-react-native";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchSuppliers, insertNewProductToDB, supabase } from "~/lib/supabase";
import { Value } from "@rn-primitives/select";
import { formatPrice } from "~/lib/format-price";

interface Supplier {
  user_id: Number;
  full_name: string;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View className="mb-4">
    <H5 className="text-sm text-gray-600 mb-1">{label}</H5>
    <H5 className="text-base text-black">{value}</H5>
  </View>
);

type ProductDetailsModalProps = {
  visible: boolean;
  product: any;
  onClose: () => void;
  onUpdateStock: (productId: number, newStock: number) => void;
};

export function ProductDetailsModal({
  sheetTrigger,
  visible,
  product,
  onClose,
  onUpdateStock,
}: {
  sheetTrigger: React.ReactNode;
  visible: boolean;
  product: any;
  onClose: () => void;
  onUpdateStock: (productId: number, newStock: number) => void;
}) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState(product);
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
      setProductData(product);
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible, product]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        // Modal is closed
        onClose();
      }
    },
    [onClose]
  );

  const [newStock, setNewStock] = useState("0");

  const handleUpdateStockPress = () => {
    setUpdating(true)
    const newStockNumber = parseInt(newStock);
    if (!isNaN(newStockNumber)) {
      onUpdateStock(product.product_id, newStockNumber);
      setNewStock("");
    }
    setUpdating(false)
  };

  return (
    <>
      {React.cloneElement(sheetTrigger as React.ReactElement, {
        onPress: () => bottomSheetModalRef.current?.present(),
      })}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: "#111" }}
        handleIndicatorStyle={{ backgroundColor: "white" }}
      >
        <BottomSheetView className="p-6 gap-6">
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <H4 className="text-xl">Product Details</H4>
              <TouchableOpacity onPress={onClose}>
                <ShieldCloseIcon className="w-6 h-6 text-gray-500" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {isLoading ? (
                <View className="flex items-center justify-center h-48">
                  <H5 className="text-gray-500">Loading...</H5>
                </View>
              ) : (
                <>
                  <Image
                    source={{
                      uri: productData.image_url.replace(
                        /^http:\/\//i,
                        "https://"
                      ),
                    }}
                    className="w-full h-48 rounded-lg mb-4"
                  />
                  <DetailItem label="Name" value={productData.name} />
                  <DetailItem label="Category" value={productData.category} />
                  <DetailItem
                    label="Description"
                    value={productData.description}
                  />
                  <DetailItem
                    label="Price"
                    value={`${formatPrice(productData.price.toFixed(2))}`}
                  />
                  <View className="flex-row items-center justify-between w-full">
                    <View className="w-1/3">
                      <DetailItem
                        label="Current Stock"
                        value={`${
                          productData.stock_quantity &&
                          productData.stock_quantity.toString()
                        } Products`}
                      />
                    </View>
                    <View>
                      <ArrowRight size={18} color={"#4b5563"} />
                      <P className="text-sm text-gray-500">TO</P>
                    </View>
                    <View className="w-auto">
                      <DetailItem
                        label="Updated Stock Value"
                        value={`${newStock} Products`}
                      />
                    </View>
                  </View>

                  <View className="border-t-[1px] border-zinc-900">
                    <H4 className="text-base mt-4 mb-2 text-gray-500">
                      Update Stock
                    </H4>
                    <View className="flex-row items-center rounded-md w-full gap-2">
                      <SquareStack size={16} color={"#aaaaaa"} />
                      <Input
                        className="border-0 flex-1 bg-transparent"
                        placeholder="Enter new quantity"
                        keyboardType="numeric"
                        onChangeText={setNewStock}
                      />
                      <Button
                        onPress={handleUpdateStockPress}
                        className="rounded-full w-auto"
                        size={"lg"}
                        variant="default"
                        disabled={updating}
                      >
                        <H4 className="text-lg text-black">
                          {updating ? "Updating" : "Update Stock ->"}
                        </H4>
                      </Button>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
