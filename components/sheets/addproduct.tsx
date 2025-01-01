import { BottomSheetView } from "@gorhom/bottom-sheet";
import { H3, H5, P } from "../ui/typography";
import { useRef, useState, useEffect } from "react";
import { H4 } from "../ui/typography";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as React from "react";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import displayNotification from "~/lib/Notification";
import { Coins, SquareStack } from "lucide-react-native";
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
  user_id: Number,
  full_name: string,
}

export function AddProduct({
  sheetTrigger,
}: {
  sheetTrigger: React.ReactNode;
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
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  async function handleAddProduct() {
    setLoading(true)
    if (name && description && supplier && category && price && stockQuantity) {
      const response = await insertNewProductToDB(
        name,
        description,
        Number(price),
        Number(supplier),
        Number(stockQuantity),
        category
      );
      if (response.startsWith("Success")) {
        displayNotification("Products added Successfully", "success");
        bottomSheetModalRef.current?.dismiss();
        return;
      } else {
        displayNotification(response, "danger");
      }
      setLoading(false)
    } else {
      displayNotification("Please fill in all the fields", "danger");
    }
    console.log('name: ', name)
    console.log("description: ", description);
    console.log("stockQuantity: ", stockQuantity);
    console.log("price: ", price);
    console.log("category: ", category);
    console.log("supplier: ", supplier);
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
          <View className="gap-4">
            <View className="gap-2">
              <P className="text-white">Name</P>
              <Input
                placeholder="Product Name"
                onChangeText={setName}
                className="bg-transparent !h-14 text-white"
                autoComplete="name"
                textContentType="name"
                keyboardType="default"
              />
            </View>
            <View className="gap-2">
              <P className="text-white">Description</P>
              <Textarea
                placeholder="Description"
                className="bg-transparent"
                onChangeText={setDescription}
              />
            </View>
            <Select onValueChange={(option) => setSupplier(option.value)}>
              <P className="text-white pb-2">Supplier</P>
              <SelectTrigger className="bg-transparent">
                <SelectValue
                  className="text-foreground text-sm native:text-lg bg-transparent"
                  placeholder="Select a supplier"
                  style={{ fontFamily: "Inter_400Regular" }}
                />
              </SelectTrigger>
              <SelectContent insets={contentInsets} className="w-[250px]">
                <SelectGroup>
                  <SelectLabel className="uppercase border-b-[1px] border-b-white">
                    Select Supplier
                  </SelectLabel>
                  <ScrollView>
                    {suppliers.map((supplier) => (
                      <SelectItem
                        key={supplier.supplier_id}
                        label={supplier.users.full_name}
                        value={supplier.supplier_id}
                      >
                        {supplier.full_name}
                      </SelectItem>
                    ))}
                  </ScrollView>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              defaultValue={{ value: "Chillers", label: "Chillers" }}
              onValueChange={(option) => setCategory(option.value)}
            >
              <P className="text-white pb-2">Category</P>
              <SelectTrigger className="bg-transparent">
                <SelectValue
                  className="text-foreground text-sm native:text-lg bg-transparent"
                  placeholder="Select a category"
                  style={{ fontFamily: "Inter_400Regular" }}
                />
              </SelectTrigger>
              <SelectContent insets={contentInsets} className="w-[250px]">
                <SelectGroup>
                  <SelectLabel className="uppercase border-b-[1px] border-b-white">
                    Select Category
                  </SelectLabel>
                  <ScrollView>
                    <SelectItem label="Chillers" value="Chillers">
                      Chillers
                    </SelectItem>
                    <SelectItem
                      label="Air Handling Units"
                      value="Air Handling Units"
                    >
                      Air Handling Units
                    </SelectItem>
                    <SelectItem label="Fan Coil Units" value="Fan Coil Units">
                      Fan Coil Units
                    </SelectItem>
                    <SelectItem label="VRF Multi" value="VRF Multi">
                      VRF Multi
                    </SelectItem>
                    <SelectItem
                      label="Ducted Split Systems"
                      value="Ducted Split Systems"
                    >
                      Ducted Split Systems
                    </SelectItem>
                    <SelectItem label="Residential" value="Residential">
                      Residential
                    </SelectItem>
                    <SelectItem label="Accessories" value="Accessories">
                      Accessories
                    </SelectItem>
                  </ScrollView>
                </SelectGroup>
              </SelectContent>
            </Select>
            <View className="flex-row justify-between">
              <View className="gap-2 w-1/3">
                <P className="text-white">Price</P>
                <View className="flex-row items-center border-[1px]  px-2 border-zinc-800 rounded-md">
                  <Coins color={"white"} />
                  <Input
                    placeholder="001000"
                    onChangeText={setPrice}
                    className="bg-transparent !h-14 border-0 text-white"
                    autoComplete="off"
                    textContentType="none"
                    keyboardType="numeric"
                    maxLength={6}
                  />
                </View>
              </View>
              <View className="gap-2 w-2/3 pl-2">
                <P className="text-white">Quantity</P>
                <View className="flex-row items-center border-[1px] px-2 border-zinc-800 rounded-md">
                  <SquareStack color={"white"} />
                  <Input
                    placeholder="0100"
                    onChangeText={setStockQuantity}
                    className="bg-transparent !h-14 border-0 text-white"
                    textContentType="none"
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
              </View>
            </View>
            <Button
              onPress={handleAddProduct}
              className="w-full rounded-full"
              size={"lg"}
              variant="default"
              disabled={loading}
            >
              <H5 className=" text-black">
                {loading ? "Adding" : "Add New Product"}
              </H5>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
