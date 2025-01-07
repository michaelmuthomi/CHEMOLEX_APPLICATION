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
import {
  Box,
  Coins,
  Group,
  ImageIcon,
  ShieldCloseIcon,
  SquareStack,
} from "lucide-react-native";
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
import { formatDate } from "~/lib/format-date";

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
  onUpdateStock: (productId: number, newStock: number) => void;
};

export function OrderDetailsModal({
  sheetTrigger,
  visible,
  product,
  onUpdateStock,
}: {
  sheetTrigger: React.ReactNode;
  visible: boolean;
  product: any;
  onUpdateStock: (productId: number, newStock: number) => void;
}) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState(product);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
      setProductData(product);
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible, product]);

  const [newStock, setNewStock] = useState("");

  const handleUpdateStockPress = () => {
    setUpdating(true);
    const newStockNumber = parseInt(newStock);
    if (!isNaN(newStockNumber)) {
      onUpdateStock(product.product_id, newStockNumber);
      setNewStock("");
    }
    setUpdating(false);
  };

  return (
    <>
      {React.cloneElement(sheetTrigger as React.ReactElement, {
        onPress: () => bottomSheetModalRef.current?.present(),
      })}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backgroundStyle={{ backgroundColor: "#111" }}
        handleIndicatorStyle={{ backgroundColor: "white" }}
      >
        <BottomSheetView className="p-6 gap-6">
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <H4 className="text-xl">Order Details</H4>
            </View>
            <ScrollView>
              {isLoading ? (
                <View className="flex items-center justify-center h-48">
                  <H5 className="text-gray-500">Loading...</H5>
                </View>
              ) : (
                <>
                  <Image
                    source={{ uri: productData.image_url }}
                    className="w-full h-48 rounded-lg mb-4"
                  />
                  <DetailItem label="Name" value={productData.name} />
                  <DetailItem
                    label="Description"
                    value={productData.description}
                  />
                  <View className="flex-row w-full">
                    <View className="w-1/2">
                      <DetailItem
                        label="Price"
                        value={`${formatPrice(productData.price.toFixed(2))}`}
                      />
                    </View>
                    <DetailItem
                      label="Amount Paid"
                      value={productData.status || "N/A"}
                    />
                  </View>
                  <DetailItem
                    label="Payment Status"
                    value={productData.status || "N/A"}
                  />

                  <View className="border-t-[1px] border-zinc-900 py-4">
                    <View className="flex-row items-center rounded-md w-full gap-2">
                      <Button
                        onPress={handleUpdateStockPress}
                        className="rounded-full w-auto border-2 border-slate-500 bg-transparent"
                        size={"lg"}
                        variant="default"
                        disabled={updating}
                      >
                        <H4 className="text-lg text-slate-400">
                          {updating ? "Declining" : "Decline"}
                        </H4>
                      </Button>
                      <Button
                        onPress={handleUpdateStockPress}
                        className="rounded-full flex-1 bg-green-700"
                        size={"lg"}
                        variant="default"
                        disabled={updating}
                      >
                        <H4 className="text-lg">
                          {updating ? "Approving" : "Approve"}
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
