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
import displayNotification from "~/lib/Notification";
import { P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";

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

const PRODUCTS_PER_PAGE = 6;

const SupplierPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
    }
  };

  const handleUpdateStock = async (productId: number, newStock: number) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("product_id", productId);

      if (error) throw error;

      setSelectedProduct(null);
      fetchProducts();
      displayNotification("Stock updated successfully", "success");
    } catch (err) {
      console.error("Error updating stock:", err);
      displayNotification(
        "Failed to update stock. Please try again.",
        "danger"
      );
    }
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const calculateStats = (products: Product[]) => {
    return [
      {
        iconBgColor: "bg-blue-600",
        Icon: <GalleryVertical color="white" size={19} />,
        Title: "Total Products",
        Description: `${products.length} items`,
      },
      {
        iconBgColor: "bg-orange-600",
        Icon: <ListTodo color="white" size={19} />,
        Title: "Low Stock",
        Description: `${
          products.filter((p) => p.stock_quantity <= 10).length
        } items`,
      },
      {
        iconBgColor: "bg-red-600",
        Icon: <ListChecks color="white" size={19} />,
        Title: "Out of Stock",
        Description: `${
          products.filter((p) => p.stock_quantity === 0).length
        } items`,
      },
      {
        iconBgColor: "bg-purple-600",
        Icon: <MessageCircle color="white" size={19} />,
        Title: "Categories",
        Description: `${new Set(products.map((p) => p.category)).size} total`,
      },
    ];
  };

  const stats = calculateStats(products);

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
          {paginatedProducts.map((product) => (
            <React.Fragment key={product.product_id}>
              <ProductDetailsModal
                sheetTrigger={
                  <ProductCard
                    product={product}
                    onViewDetails={handleViewDetails}
                  />
                }
                visible={selectedProduct?.product_id === product.product_id}
                product={product}
                onClose={() => setSelectedProduct(null)}
                onUpdateStock={handleUpdateStock}
              />
            </React.Fragment>
          ))}
        </View>
        <View className="flex-row items-center justify-between my-4 px-2">
          <Button
            className="bg-[#111] rounded-full px-4 py-2 disabled:bg-zinc-900"
            onPress={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <P className="text-white">&larr; Previous</P>
          </Button>

          <P className="text-white mx-4">
            Page {currentPage} of {totalPages}
          </P>

          <Button
            className="bg-[#111] rounded-full px-4 py-2 disabled:bg-zinc-900"
            onPress={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <P className="text-white">Next &rarr;</P>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default SupplierPage;
