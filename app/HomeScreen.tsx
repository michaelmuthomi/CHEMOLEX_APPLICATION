import React from 'react';
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
} from 'react-native';
import { ChevronRight, TrendingUp, Star, Package, Clock } from 'lucide-react-native';
import { H1, H2, H3, H4, H5, P } from '~/components/ui/typography';
import { Button } from '~/components/ui/button';
import { useEffect, useState } from 'react';
import { checkUser, fetchProductsFromDB } from "~/lib/supabase";
import { formatPrice } from "~/lib/format-price";
import {Ionicons} from "@expo/vector-icons";
import { useEmail } from './EmailContext';

const { width } = Dimensions.get('window');

const featuredCategories = [
  {
    id: 1,
    title: "Chillers",
    subtitle: "Industrial Cooling Solutions",
    image: "http://5.imimg.com/data5/SELLER/Default/2024/8/442306416/ZH/AP/PZ/1889348/air-cooled-chillers-1000x1000.png",
    backgroundColor: "#0F4C3A",
  },
  {
    id: 2,
    title: "Air Handling Units",
    subtitle: "Commercial HVAC Systems",
    image: "http://5.imimg.com/data5/SELLER/Default/2024/4/412323270/DE/RZ/DK/9199886/single-skin-air-handling-unit-1000x1000.png",
    backgroundColor: "#FF6347",
  },
];

const promotions = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Up to 20% off on Cooling Systems",
    image: "http://5.imimg.com/data5/SELLER/Default/2024/4/414735525/QN/IM/OK/202996372/misubishi-air-conditioner-500x500.jpg",
    backgroundColor: "#2C3E50",
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Latest Energy-Efficient Models",
    image: "http://5.imimg.com/data5/SELLER/Default/2024/4/411112381/TA/TR/IA/202996372/residential-rooftop-packaged-unit-1000x1000.jpg",
    backgroundColor: "#8E44AD",
  },
];

export default function HomeScreen({ navigation }) {
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
    <View className="mt-6">
      <View className="flex-row items-center justify-between px-6 mb-4">
        <H3 className="text-xl">Categories</H3>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => navigation.navigate("SearchScreen")}
        >
          <H3 className="text-sm text-[#555]">See All</H3>
          <Ionicons name="arrow-forward-sharp" size={15} color="#555" />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-6"
      >
        {featuredCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            className="mr-4 rounded-xl overflow-hidden"
            style={{ width: width * 0.7, height: 160 }}
            onPress={() => navigation.navigate("SearchScreen", { category })}
          >
            <ImageBackground
              source={{ uri: category.image }}
              className="w-full h-full justify-end p-4"
              imageStyle={{ opacity: 0.7 }}
              style={{ backgroundColor: category.backgroundColor }}
            >
              <H3 className="text-white">{category.title}</H3>
              <P className="text-white opacity-80">{category.subtitle}</P>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPromotions = () => (
    <View className="mt-8">
      <H3 className="px-6 mb-4 uppercase text-lg">Special Offers</H3>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-6"
      >
        {promotions.map((promo) => (
          <TouchableOpacity
            key={promo.id}
            className="mr-4 rounded-xl overflow-hidden"
            style={{ width: width * 0.8, height: 120 }}
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <ImageBackground
              source={{ uri: promo.image }}
              className="w-full h-full justify-center p-4"
              imageStyle={{ opacity: 0.7 }}
              style={{ backgroundColor: promo.backgroundColor }}
            >
              <H3 className="text-white">{promo.title}</H3>
              <P className="text-white opacity-80">{promo.description}</P>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderQuickLinks = () => (
    <View className="flex-row justify-between px-6 py-6">
      <TouchableOpacity
        className="items-center opacity-80"
        onPress={() =>
          navigation.navigate("SearchScreen", { sort: "trending" })
        }
      >
        <View className="bg-zinc-800 p-3 rounded-full mb-2">
          <TrendingUp size={24} color="#fff" />
        </View>
        <P>Trending</P>
      </TouchableOpacity>
      <TouchableOpacity
        className="items-center opacity-80"
        onPress={() => navigation.navigate("SearchScreen", { filter: "new" })}
      >
        <View className="bg-zinc-800 p-3 rounded-full mb-2">
          <Star size={24} color="#fff" />
        </View>
        <P>New</P>
      </TouchableOpacity>
      <TouchableOpacity
        className="items-center opacity-80"
        onPress={() =>
          navigation.navigate("SearchScreen", { filter: "popular" })
        }
      >
        <View className="bg-zinc-800 p-3 rounded-full mb-2">
          <Package size={24} color="#fff" />
        </View>
        <P>Popular</P>
      </TouchableOpacity>
      <TouchableOpacity
        className="items-center opacity-80"
        onPress={() =>
          navigation.navigate("SearchScreen", { filter: "recent" })
        }
      >
        <View className="bg-zinc-800 p-3 rounded-full mb-2">
          <Clock size={24} color="#fff" />
        </View>
        <P>Recent</P>
      </TouchableOpacity>
    </View>
  );

  const renderProducts = () => (
    <View className="mt-10 bg-[#111] py-4">
      <View className="flex-row items-center justify-between mb-4 px-4">
        <H3 className="text-2xl">Popular</H3>
        <TouchableOpacity
          className="flex-row items-centeri"
          onPress={() => navigation.navigate("SearchScreen")}
        >
          <H3 className="text-sm text-[#555] px-2">See All</H3>
          <Ionicons name="arrow-forward-sharp" size={15} color="#555" />
        </TouchableOpacity>
      </View>
      <View className="flex-row flex-wrap">
        {products.slice(0, 4).map((product) => (
          <TouchableOpacity
            key={product.product_id}
            className="w-1/2 bg-[#111] rounded-lg shadow p-2"
            onPress={() => navigation.navigate("ProductScreen", { product })}
          >
            <Image
              source={{ uri: product.image_url }}
              className="w-full h-32 rounded-lg mb-2"
              resizeMode="cover"
            />
            <P numberOfLines={2} className="mb-1 text-base">
              {product.name}
            </P>
            <P className="text-sm">{formatPrice(product.price)}</P>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  const renderAllProducts = () => {
    return (
      <View className="mt-14">
        <View className="flex-row items-center justify-between mb-4 px-6">
          <H3 className="text-2xl w-max">Recommended</H3>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => navigation.navigate("SearchScreen")}
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
              onPress={() => navigation.navigate("ProductScreen", { product })}
            >
              <Image
                source={{ uri: product.image_url }}
                className="w-full h-48 rounded-t-lg"
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
          onPress={() => navigation.navigate("SearchScreen")}
        >
          <H3 className="text-sm text-[#555]">View More Products</H3>
          <Ionicons name="arrow-forward-sharp" size={15} color="#555" className='ml-auto' />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View className="pt-16">
          <View className='px-6'>
            <H2 className="text-2xl border-b-0 leading-0">
              Hi there, {customer.username} 👋
            </H2>
              <H2 className='text-zinc-400 text-sm border-b-0'>Welcome to Refnet</H2>
            </View>
          <Image
            source={require("~/assets/images/Background.png")}
            className="w-full h-48 rounded-t-lg"
            resizeMode="cover"
          />
          {renderQuickLinks()}
          {renderFeaturedCategories()}
          {renderPromotions()}
          {renderProducts()}
          {renderAllProducts()}
          <View className="h-20" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
