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

export function AssignTechnicianModal({
  sheetTrigger,
  visible,
  product,
  technicians,
  onAssign,
}: {
  sheetTrigger: React.ReactNode;
  visible: boolean;
  product: any;
  technicians: any;
  onAssign: (technicianId: number) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState(product);

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
      }
    },
    []
  );

  const [newStock, setNewStock] = useState("");

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");

  const presentModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleAssign = () => {
    if (selectedTechnician) {
      onAssign(parseInt(selectedTechnician));
      bottomSheetModalRef.current?.dismiss();
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
              <TouchableOpacity >
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
                    source={{ uri: productData.image_url }}
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
                  <View className="flex-row w-full">
                    <View className="w-1/2">
                      <DetailItem
                        label="Current Stock"
                        value={
                          productData.stock_quantity &&
                          productData.stock_quantity.toString()
                        }
                      />
                    </View>
                    <DetailItem
                      label="Reorder Level"
                      value={
                        productData.reorder_level &&
                        productData.reorder_level.toString()
                      }
                    />
                  </View>

                  {/* <View className="border-t-[1px] border-zinc-900">
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
                        className="rounded-full w-auto"
                        size={"lg"}
                        variant="default"
                      >
                        <H4 className="text-lg text-black">{"Update"}</H4>
                      </Button>
                    </View>
                  </View> */}
                  <Select
                    value={selectedTechnician}
                    onValueChange={setSelectedTechnician}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a technician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Technicians</SelectLabel>
                        {technicians.map((tech) => (
                          <SelectItem
                            key={tech.id}
                            label={`${tech.name} (${tech.speciality})`}
                            value={tech.id.toString()}
                          />
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </>
              )}
            </ScrollView>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
