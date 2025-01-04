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
import { fetchSuppliers, insertNewProductToDB } from "~/lib/supabase";
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
    <H5 className="text-base text-gray-800">{value}</H5>
  </View>
);

type ProductDetailsModalProps = {
  visible: boolean;
  product: Product | null;
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
  visible: any;
  product: any;
  onClose: any;
  onUpdateStock: any;
}) {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [supplier, setSupplier] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  async function handleAddProduct() {
    setLoading(true);
    if (
      name &&
      description &&
      supplier &&
      category &&
      price &&
      stockQuantity &&
      imageUrl
    ) {
      const response = await insertNewProductToDB(
        name,
        description,
        Number(price),
        Number(supplier),
        Number(stockQuantity),
        category,
        imageUrl
      );
      if (response.startsWith("Success")) {
        displayNotification("Products added Successfully", "success");
        bottomSheetModalRef.current?.dismiss();
        setLoading(false);
        return;
      } else {
        displayNotification(response, "danger");
        setLoading(false);
      }
      setLoading(false);
    } else {
      displayNotification("Please fill in all the fields", "danger");
    }
    setLoading(false);
  }

  useEffect(() => {
    async function fetchAllSuppliers() {
      const response = await fetchSuppliers();
      setSuppliers(response);
      console.log("Suppliers fetched: ", response);
    }
    fetchAllSuppliers();
  }, []); // Run only once when the component mounts

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <>
      {React.cloneElement(sheetTrigger as React.ReactElement, {
        onPress: handlePresentModalPress,
      })}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: "#111" }}
        handleIndicatorStyle={{ backgroundColor: "white" }}
      >
        <BottomSheetView className="p-6 gap-6">
          {/* Title and Subtitle */}
          <View className="items-center mb-8">
            <H3 className="text-2xl mb-2 text-center">Add new product</H3>
            <P className="text-gray-500 text-center">
              Please fill in the form to add a new product
            </P>
          </View>
          <View className="flex-1 justify-end bg-black bg-opacity-50">
            <View className="bg-white rounded-t-3xl p-6 h-5/6">
              <View className="flex-row justify-between items-center mb-4">
                <H4 className="text-2xl font-bold">Product Details</H4>
                <TouchableOpacity>
                  <ShieldCloseIcon className="w-6 h-6 text-gray-500" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {/* <Image
                  source={{ uri: product.image_url }}
                  className="w-full h-48 rounded-lg mb-4"
                /> */}
                <DetailItem label="Name" value={product.name} />
                <DetailItem label="Category" value={product.category} />
                <DetailItem label="Description" value={product.description} />
                <DetailItem
                  label="Price"
                  value={`$${product.price.toFixed(2)}`}
                />
                <DetailItem
                  label="Current Stock"
                  value={product.stock_quantity.toString()}
                />
                <DetailItem
                  label="Reorder Level"
                  value={product.reorder_level.toString()}
                />

                <H5 className="text-lg font-bold mt-4 mb-2">Update Stock</H5>
                <View className="flex-row items-center">
                  <Input
                    className="border border-gray-300 rounded-lg px-3 py-2 flex-1 mr-2"
                    placeholder="Enter new stock quantity"
                    keyboardType="numeric"
                    value={newStock}
                    onChangeText={setNewStock}
                  />
                  <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded-lg"
                    onPress={handleUpdateStock}
                  >
                    <H5 className="text-white font-semibold">Update</H5>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
          ;
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
