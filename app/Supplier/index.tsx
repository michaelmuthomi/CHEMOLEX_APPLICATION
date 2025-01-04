import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { supabase } from "~/lib/supabase";
import { ProductCard } from "~/components/ProductCard";
import { ProductDetailsModal } from "~/components/sheets/productdetails";
import {
  GalleryVertical,
  ListChecks,
  ListTodo,
  MessageCircle,
  Search,
} from "lucide-react-native";
import { H3 } from "~/components/ui/typography";
import StatsCard from "~/components/StatsCard";
import { Input } from "~/components/ui/input";

type Product = {
  product_id: number;
  name: string;
  description: string;
  supplier_id: number;
  category: string;
  price: number;
  stock_quantity: number;
  reorder_level: number;
  created_at: string;
  image_url: string;
};

const SupplierPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
    const subscription = supabase
      .channel("products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        handleProductChange
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductChange = (payload: any) => {
    fetchProducts();
  };

  const handleViewDetails = (productId: number) => {
    const product = products.find((p) => p.product_id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsModalVisible(true);
    }
  };

  const handleUpdateStock = async (productId: number, newStock: number) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("product_id", productId);

      if (error) throw error;

      setIsModalVisible(false);
      fetchProducts();
      Alert.alert("Success", "Stock updated successfully");
    } catch (err) {
      console.error("Error updating stock:", err);
      Alert.alert("Error", "Failed to update stock. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500 text-lg">{error}</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={fetchProducts}
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const stats = [
    {
      iconBgColor: "bg-blue-600",
      Icon: <GalleryVertical color="white" size={19} />,
      Title: "Assignement",
      Description: "10 components",
    },
    {
      iconBgColor: "bg-orange-600",
      Icon: <ListTodo color="white" size={19} />,
      Title: "Pending",
      Description: "10 components",
    },
    {
      iconBgColor: "bg-red-600",
      Icon: <ListChecks color="white" size={19} />,
      Title: "Complete",
      Description: "10 components",
    },
    {
      iconBgColor: "bg-purple-600",
      Icon: <MessageCircle color="white" size={19} />,
      Title: "Redo",
      Description: "10 components",
    },
  ];

  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        <View className="bg-white p-4 gap-6">
          <H3 className="text-black">Statistics</H3>
          <View className="flex-row flex-wrap gap-y-6 justify-between">
            {stats.map((stat) => (
              <StatsCard
                iconBgColor={stat.iconBgColor}
                Icon={stat.Icon}
                Title={stat.Title}
                Description={stat.Description}
              />
            ))}
          </View>
        </View>
        <View className="flex-row items-center rounded-lg p-4">
          <Search color={"white"} size={14} />
          <Input
            className="flex-1 text-base border-0"
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View className="flex-1 py-4">
          {filteredProducts.map((product) => (
            <ProductDetailsModal
              sheetTrigger={
                <ProductCard
                  key={product.product_id}
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              }
              visible={isModalVisible}
              product={selectedProduct}
              onClose={() => setIsModalVisible(false)}
              onUpdateStock={handleUpdateStock}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SupplierPage;
