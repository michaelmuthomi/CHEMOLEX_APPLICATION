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
import { Box, Coins, Group, ImageIcon, ShieldCloseIcon, SquareStack } from "lucide-react-native";
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
    <H5 className="text-base text-white">{value}</H5>
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

  // Add useEffect to handle visibility changes
  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        // Modal is closed
        onClose();
      }
    },
    [onClose]
  );

  const [newStock, setNewStock] = useState("");

  const handleUpdateStockPress = () => {
    const newStockNumber = parseInt(newStock);
    if (!isNaN(newStockNumber)) {
      onUpdateStock(product.product_id, newStockNumber);
      setNewStock("");
    }
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
        snapPoints={["75%"]}
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
              <Image
                source={{ uri: product.image_url }}
                className="w-full h-48 rounded-lg mb-4"
              />
              <DetailItem label="Name" value={product.name} />
              <DetailItem label="Category" value={product.category} />
              <DetailItem label="Description" value={product.description} />
              <DetailItem
                label="Price"
                value={`$${product.price.toFixed(2)}`}
              />
              <DetailItem
                label="Current Stock"
                value={
                  product.stock_quantity && product.stock_quantity.toString()
                }
              />
              <DetailItem
                label="Reorder Level"
                value={
                  product.reorder_level && product.reorder_level.toString()
                }
              />

              <View className="border-t-[1px] border-zinc-900">
                <H5 className="text-lg mt-4 mb-2">Update Stock</H5>
                <View className="flex-row items-center rounded-md w-full gap-2">
                  <SquareStack size={16} color={"#aaaaaa"} />
                  <Input
                    className="border-0 flex-1 bg-transparent"
                    placeholder="Enter new quantity"
                    keyboardType="numeric"
                    value={newStock}
                    onChangeText={setNewStock}
                  />
                  <Button
                    onPress={handleUpdateStockPress}
                    className="flex-1 rounded-full"
                    size={"lg"}
                    variant="default"
                  >
                    <H5 className="text-black">
                      {"Update"}
                    </H5>
                  </Button>
                </View>
              </View>
            </ScrollView>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
