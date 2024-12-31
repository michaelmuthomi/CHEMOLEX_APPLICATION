import { BottomSheetView } from "@gorhom/bottom-sheet";
import { H3, H5, P } from "../ui/typography";
import { useRef, useState } from "react";
import { H4 } from "../ui/typography";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as React from "react";
import { useCallback } from "react";
import { ActivityIndicator, Linking, ScrollView, View } from "react-native";
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
import { fetchSuppliers } from "~/lib/supabase";

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
  //   const inputRef = useRef<Textarea>(null);
  const [loading, setLoading] = React.useState(false);
  const [suppliers, setSuppliers] = useState([]);

  async function handleAddProduct() {
    if (email && message) {
      displayNotification("We will get back to you soon", "success");
      bottomSheetModalRef.current?.dismiss();
      return;
    }
    displayNotification("Please fill in all the fields", "danger");
  }

  React.useEffect(() => {
    async function fetchAllSuppliers() {
      const response = await fetchSuppliers();
      if (response?.startsWith("error")) {
        console.error("Error submitting feedback:", response);
        displayNotification(response, "danger");
        return;
      } else {
        setSuppliers(response)
        console.log("Suppliers fetched: ", response)
        displayNotification("Thanks for the feedback", "success");
        bottomSheetModalRef.current?.dismiss();
        return;
      }
    }
    fetchAllSuppliers()
  });

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
                aria-labelledby="inputLabel"
                aria-errormessage="inputError"
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
            <Select defaultValue={{ value: "apple", label: "Apple" }}>
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
                      <SelectItem label="Apple" value="apple">
                        {supplier.full_name}
                      </SelectItem>
                    ))}
                  </ScrollView>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select defaultValue={{ value: "apple", label: "Apple" }}>
              <P className="text-white pb-2">Category</P>
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
                    <SelectItem
                      label="Residential"
                      value="Residential"
                    >
                      Residential
                    </SelectItem>
                    <SelectItem
                      label="Accessories"
                      value="Accessories"
                    >
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
                    aria-labelledby="inputLabel"
                    aria-errormessage="inputError"
                    className="bg-transparent !h-14 border-0 text-white"
                    autoComplete="name"
                    textContentType="name"
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
                    aria-labelledby="inputLabel"
                    aria-errormessage="inputError"
                    className="bg-transparent !h-14 border-0 text-white"
                    textContentType="name"
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
                {loading ? "Submitting" : "Submit Query"}
              </H5>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
