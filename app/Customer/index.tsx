import React from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Touchable,
} from "react-native";
import {
  ChevronRight,
  TrendingUp,
  Star,
  Package,
  Clock,
  GalleryVertical,
  ListTodo,
  CloudSnow,
  Wind,
  Fan,
} from "lucide-react-native";
import { H1, H2, H3, H4, H5, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { checkUser, fetchProductsFromDB } from "~/lib/supabase";
import { formatPrice } from "~/lib/format-price";
import { Ionicons } from "@expo/vector-icons";
import { useEmail } from "~/app/EmailContext";
import { Link, useNavigation } from "expo-router";
import StatsCard from "~/components/StatsCard";

const { width } = Dimensions.get("window");

const stats = [
  {
    iconBgColor: "bg-blue-600",
    Icon: <CloudSnow color="white" size={19} />,
    Title: "Chillers",
    Description: "Industrial Cooling Solutions",
  },
  {
    iconBgColor: "bg-orange-600",
    Icon: <Wind color="white" size={19} />,
    Title: "Air Handling Units",
    Description: "Commercial HVAC Systems",
  },
  {
    iconBgColor: "bg-purple-600",
    Icon: <Fan color="white" size={19} />,
    Title: "Fan coil units",
    Description: "Providing efficient temperature control",
  },
];

const promotions = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Up to 20% off on Cooling Systems",
    image:
      "http://5.imimg.com/data5/SELLER/Default/2024/4/414735525/QN/IM/OK/202996372/misubishi-air-conditioner-500x500.jpg",
    backgroundColor: "#2C3E50",
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Latest Energy-Efficient Models",
    image:
      "http://5.imimg.com/data5/SELLER/Default/2024/4/411112381/TA/TR/IA/202996372/residential-rooftop-packaged-unit-1000x1000.jpg",
    backgroundColor: "#8E44AD",
  },
];

export default function Tab() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomerDetails] = useState([]);
  const emailContext = useEmail();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsFromDB();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    async function fetchUserDetails() {
      const response = await checkUser(emailContext?.email);
      setCustomerDetails(response);
    }
    fetchUserDetails();
    loadProducts();
  }, []);

  const renderFeaturedCategories = () => (
    <View className="bg-white p-4 gap-6">
      <View className="flex-row justify-between items-center w-full">
        <H3 className="text-black flex-1">Categories</H3>
        <Link href="/Customer/search" className="">
          <H4 className="text-blue-600 text-sm">View More &rarr;</H4>
        </Link>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-4">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              iconBgColor={stat.iconBgColor}
              Icon={stat.Icon}
              Title={stat.Title}
              Description={stat.Description}
              onStatPress={() => navigation.navigate("search")}
              statChartStyles={{ width: 150 }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderProducts = () => (
    <View className="mt-10 bg-[#111] py-4 px-2">
      <View className="flex-row justify-between items-center w-full">
        <H3 className="flex-1 text-xl">Featured Products</H3>
        <Link href="/Customer/search" className="">
          <H4 className="text-white text-sm">View More &rarr;</H4>
        </Link>
      </View>
      <ScrollView horizontal>
        <View className="flex-row">
          {products.slice(0, 4).map((product) => (
            <TouchableOpacity
              key={product.product_id}
              className="w-[250px] bg-[#111] rounded-md shadow p-2"
              onPress={() => navigation.navigate("product", { product })}
            >
              <Image
                source={{ uri: product.image_url }}
                className="w-full h-40 rounded-lg mb-2"
                resizeMode="cover"
              />
              <H3 numberOfLines={1} className="text-2xl">
                {product.name}
              </H3>
              <H4 className="text-sm">{formatPrice(product.price)}</H4>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
  const renderAllProducts = () => {
    return (
      <View className="mt-14">
        <View className="flex-row items-center justify-between mb-4 px-2">
          <H3 className="flex-1 text-xl">Recommendations</H3>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => navigation.navigate("search")}
          >
            <H3 className="text-sm text-[#555]">See All</H3>
            <Ionicons name="arrow-forward-sharp" size={15} color="#555" />
          </TouchableOpacity>
        </View>
        <View className="flex-row flex-wrap space-x-2">
          {products.slice(0, 6).map((product) => (
            <TouchableOpacity
              key={product.product_id}
              className="rounded-lg shadow w-1/2 p-2"
              onPress={() => navigation.navigate("product", { product })}
            >
              <Image
                source={{ uri: product.image_url }}
                className="w-full h-32 rounded-lg mb-2"
                resizeMode="cover"
              />
              <View className="">
                <H4 numberOfLines={2} className="mb-1">
                  {product.name}
                </H4>
                <P className="text-sm ">{formatPrice(product.price)}</P>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          className="flex-row items-center p-4 mt-6 bg-white"
          onPress={() => navigation.navigate("search")}
        >
          <H3 className="text-sm text-[#555]">View More Products</H3>
          <Ionicons
            name="arrow-forward-sharp"
            size={15}
            color="#555"
            className="ml-auto"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View className="pt-16">
          <View className="px-6">
            <H2 className="text-2xl border-b-0 leading-0">
              Hi there, {customer.username} 👋
            </H2>
            <H2 className="text-zinc-400 text-sm border-b-0">
              Welcome to Refnet
            </H2>
          </View>
          {/* <Image
            source={require("~/assets/images/Background.png")}
            className="w-full h-48 rounded-t-lg"
            resizeMode="cover"
          /> */}
          {renderFeaturedCategories()}
          {/* {renderPromotions()} */}
          {renderProducts()}
          {renderAllProducts()}
          <View className="h-20" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
