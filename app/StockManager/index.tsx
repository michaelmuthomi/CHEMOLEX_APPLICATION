import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Input } from "~/components/ui/input";
import { H5, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";

type Product = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
};

const InventoryManagerPage = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Widget A", sku: "WA001", quantity: 100, price: 9.99 },
    { id: 2, name: "Gadget B", sku: "GB002", quantity: 75, price: 24.99 },
    { id: 3, name: "Doohickey C", sku: "DC003", quantity: 50, price: 14.99 },
    { id: 4, name: "Thingamajig D", sku: "TD004", quantity: 25, price: 39.99 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const updateQuantity = (id: number, newQuantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView className="flex-1 ">
      <View className="bg-white mb-4 p-4 shadow">
        <Input
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
          placeholder="Search products..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {filteredProducts.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onUpdateQuantity={updateQuantity}
          />
        ))}
      </View>

      <Button
        variant="outline"
        size={"lg"}
        className="rounded-full bg-white !py-4 !border-none"
        // onPress={() => setIsEditing(true)}
      >
        <H5 className="text-black leading-none">Edit details</H5>
      </Button>
    </ScrollView>
  );
};

const ProductItem = ({
  product,
  onUpdateQuantity,
}: {
  product: Product;
  onUpdateQuantity: (id: number, newQuantity: number) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newQuantity, setNewQuantity] = useState(product.quantity.toString());

  const handleUpdate = () => {
    const updatedQuantity = parseInt(newQuantity);
    if (isNaN(updatedQuantity) || updatedQuantity < 0) {
      Alert.alert("Invalid Input", "Please enter a valid number for quantity.");
      return;
    }
    onUpdateQuantity(product.id, updatedQuantity);
    setIsEditing(false);
  };

  return (
    <View className="border-b py-4">
      <H5 className="text-lg text-gray-800">{product.name}</H5>
      <P className="text-sm text-gray-600">SKU: {product.sku}</P>
      <P className="text-sm text-gray-600">
        Price: ${product.price.toFixed(2)}
      </P>
      <View className="flex-row items-center mt-2">
        <P className="text-sm text-gray-600 mr-2">Quantity:</P>
        {isEditing ? (
          <View className="flex-row">
            <Input
              className="border border-gray-300 rounded px-2 py-1 w-20 mr-2"
              value={newQuantity}
              onChangeText={setNewQuantity}
              keyboardType="numeric"
            />
            <TouchableOpacity
              className="bg-blue-500 rounded px-2 py-1 mr-2"
              onPress={handleUpdate}
            >
              <P className="text-white">Update</P>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-500 rounded px-2 py-1"
              onPress={() => setIsEditing(false)}
            >
              <P className="text-white">Cancel</P>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row">
            <P className="text-sm text-gray-800 mr-2">
              {product.quantity}
            </P>
            <TouchableOpacity
              className="bg-yellow-500 rounded px-2 py-1"
              onPress={() => setIsEditing(true)}
            >
              <P className="text-white">Edit</P>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default InventoryManagerPage;
