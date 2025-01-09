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
import { H1, H2, H3, H4, H5, H6, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import {
  checkUser,
  fetchProductsFromDB,
  fetchServicesFromDB,
} from "~/lib/supabase";
import { formatPrice } from "~/lib/format-price";
import { Ionicons } from "@expo/vector-icons";
import { useEmail } from "~/app/EmailContext";
import { Link, useNavigation } from "expo-router";
import StatsCard from "~/components/StatsCard";
import { NavigationProp } from "@react-navigation/native";
import { formatBalance } from "~/lib/formatBalance";
import { LinearGradient } from "expo-linear-gradient";
import {ServiceModal} from "~/components/sheets/ServiceModal"; // Import the ServiceModal

const { width } = Dimensions.get("window");

type RootStackParamList = {
  search: undefined;
  product: { product: string };
};
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

function CustomerHome() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [isModalVisible, setModalVisible] = useState(false);


  const [products, setProducts] = useState<
    Array<{
      product_id: string;
      name: string;
      price: number;
      image_url: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomerDetails] = useState([]);
  const emailContext = useEmail();
  const [services, setServices] = useState<
    Array<{ id: string; name: string; description: string }>
  >([
    { id: "1", name: "Service A", description: "Description for Service A" },
    { id: "2", name: "Service B", description: "Description for Service B" },
  ]);

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

    const loadServices = async () => {
      try {
        const serviceData = await fetchServicesFromDB();
        setServices(serviceData);
      } catch (error) {
        console.error("Error loading services:", error);
      }
    };

    async function fetchUserDetails() {
      const response = await checkUser(emailContext?.email);
      setCustomerDetails(response);
    }

    fetchUserDetails();
    loadProducts();
    loadServices();
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
    <View className="mt-10 px-2 gap-4">
      <View className="flex-row items-center justify-between">
        <H3 className="flex-1 text-xl">Featured Products</H3>
        <Link href="/Customer/search" className="">
          <H4 className="text-white text-sm">View More &rarr;</H4>
        </Link>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {products.slice(0, 4).map((product) => (
            <TouchableOpacity
              key={product.product_id}
              className="w-[250px] h-48 rounded-md shadow relative"
              onPress={() =>
                navigation.navigate("product", {
                  product: JSON.stringify(product),
                })
              }
            >
              <Image
                source={{ uri: product.image_url }}
                className="w-full h-full rounded-sm mb-2"
                resizeMode="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0, 0, 0, 0.9)"]}
                className="absolute bottom-0 left-0 h-36 w-full"
              />
              <View className="absolute bottom-0 flex-row items-end justify-between w-full px-2 pb-2">
                <H6 numberOfLines={1} className="text-base w-3/4">
                  {product.name}
                </H6>

                <H5
                  numberOfLines={1}
                  className="text-base flex-row gap-2 h-max"
                >
                  {formatBalance(product.price)}
                </H5>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
  const renderAllProducts = () => {
    return (
      <View className="mt-14 bg-white">
        <View className="flex-row items-center justify-between px-2 py-6">
          <H3 className="flex-1 text-xl text-black">Recommendations</H3>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => navigation.navigate("search")}
          >
            <H3 className="text-sm text-[#555]">See All</H3>
            <Ionicons name="arrow-forward-sharp" size={15} color="#555" />
          </TouchableOpacity>
        </View>
        <View className="space-x-2">
          {products.slice(0, 6).map((product) => (
            <TouchableOpacity
              key={product.product_id}
              className="bg-white shadow-sm mb-4 py-10 px-2 flex-row relative border-b-2 border-zinc-500"
              onPress={() =>
                navigation.navigate("product", {
                  product: JSON.stringify(product),
                })
              }
            >
              <View className="w-full relative overflow-clip">
                <View className="flex items-start absolute right-[-14px] top-[-14px]">
                  <TouchableOpacity
                    className={`p-2 px-4 rounded-bl-lg rounded-tr-lg flex-row items-center w-auto ${
                      product.stock_quantity <= 10
                        ? "bg-orange-300"
                        : "bg-green-300"
                    }`}
                  >
                    <ListTodo
                      color={`${
                        product.stock_quantity <= 10 ? "#9a3412" : "#166534"
                      }`}
                      size={19}
                    />
                    <H5
                      className={`${
                        product.stock_quantity <= 10
                          ? "text-orange-900"
                          : "text-green-900"
                      } ml-2 text-base`}
                    >
                      InStock {product.stock_quantity}
                    </H5>
                  </TouchableOpacity>
                </View>
                <View className="flex-row justify-between items-center mb-2">
                  <H3 className="text-lg text-gray-800">{product.name}</H3>
                </View>
                <H4
                  className="text-gray-600 text-base mb-2 w-3/4"
                  numberOfLines={3}
                >
                  {product.description}
                </H4>
                <View className="flex-row items-center justify-between w-full">
                  <H4 className="text-blue-600 w-1/2 text-base">
                    {product.stock_quantity <= 10
                      ? "ReStock Now"
                      : "Manage Stock"}
                  </H4>
                  <H4 className="text-blue-600 text-right text-lg">&rarr;</H4>
                </View>
                <View
                  className={`rounded-md overflow-0 mt-6 pt-6 pl-6 h-48 ${
                    product.stock_quantity <= 10
                      ? "bg-orange-300"
                      : "bg-purple-300"
                  }`}
                >
                  <Image
                    source={{ uri: product.image_url }}
                    className="w-full rounded-tl-md h-full object-cover mix-blend-multiply bg-neutral-400"
                  />
                </View>
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

  const renderServiceBooking = () => (
    <View className="mt-10 px-2 gap-4 p-4 rounded-md shadow">
      <H3 className="text-xl">Book a Service</H3>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-4">
          {services.map((service) => (
            <ServiceModal
              sheetTrigger={
                <TouchableOpacity
                  key={service.service_id}
                  className="h-40 rounded-md shadow p-2 w-[200px]"
                >
                  <H4 className="text-lg">{service.name}</H4>
                  <P className="text-sm">{service.description}</P>
                </TouchableOpacity>
              }
              serviceId={service.service_id}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );

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
          {renderServiceBooking()}
          <View className="h-20" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CustomerHome;
