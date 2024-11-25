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
} from 'react-native';
import { ChevronRight, TrendingUp, Star, Package, Clock } from 'lucide-react-native';
import { H1, H2, H3, H4, P } from '~/components/ui/typography';
import { Button } from '~/components/ui/button';
import { useEffect, useState } from 'react';
import { fetchProductsFromDB } from '~/lib/supabase';
import { formatPrice } from "~/lib/format-price";

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
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsFromDB();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const renderFeaturedCategories = () => (
    <View className="mt-6">
      <View className="flex-row items-center justify-between px-6 mb-4">
        <H3>Featured Categories</H3>
        <TouchableOpacity 
          className="flex-row items-center" 
          onPress={() => navigation.navigate('SearchScreen')}
        >
          <P className="mr-1">View All</P>
          <ChevronRight size={20} color="#fff" />
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
            onPress={() => navigation.navigate('SearchScreen', { category })}
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
      <H3 className="px-6 mb-4">Special Offers</H3>
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
            onPress={() => navigation.navigate('SearchScreen')}
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
        onPress={() => navigation.navigate('SearchScreen', { sort: 'trending' })}
      >
        <View className="bg-zinc-800 p-3 rounded-full mb-2">
          <TrendingUp size={24} color="#fff" />
        </View>
        <P>Trending</P>
      </TouchableOpacity>
      <TouchableOpacity 
        className="items-center opacity-80"
        onPress={() => navigation.navigate('SearchScreen', { filter: 'new' })}
      >
        <View className="bg-zinc-800 p-3 rounded-full mb-2">
          <Star size={24} color="#fff" />
        </View>
        <P>New</P>
      </TouchableOpacity>
      <TouchableOpacity 
        className="items-center opacity-80"
        onPress={() => navigation.navigate('SearchScreen', { filter: 'popular' })}
      >
        <View className="bg-zinc-800 p-3 rounded-full mb-2">
          <Package size={24} color="#fff" />
        </View>
        <P>Popular</P>
      </TouchableOpacity>
      <TouchableOpacity 
        className="items-center opacity-80"
        onPress={() => navigation.navigate('SearchScreen', { filter: 'recent' })}
      >
        <View className="bg-zinc-800 p-3 rounded-full mb-2">
          <Clock size={24} color="#fff" />
        </View>
        <P>Recent</P>
      </TouchableOpacity>
    </View>
  );

  const renderProducts = () => (
    <View className="px-6 mt-4">
      <View className="flex-row items-center justify-between mb-4">
        <H3>Popular Products</H3>
        <TouchableOpacity 
          className="flex-row items-center" 
          onPress={() => navigation.navigate('Search')}
        >
          <P className="mr-1">View All</P>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View className="flex-row flex-wrap gap-4">
        {products.slice(0, 4).map((product) => (
          <TouchableOpacity
            key={product.product_id}
            className="w-[48%] bg-[#111] rounded-lg shadow p-2"
            onPress={() => navigation.navigate('ProductScreen', { product })}
          >
            <Image
              source={{ uri: product.image_url }}
              className="w-full h-32 rounded-lg mb-2"
              resizeMode="contain"
            />
            <H4 numberOfLines={2} className="mb-1">{product.name}</H4>
            <P className="text-sm">{formatPrice(product.price)}</P>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View className="pt-4">
          <H2 className="px-6 text-2xl">Welcome to RefNet</H2>
          <P className="px-6 mt-1 opacity-60">Discover Professional HVAC Solutions</P>
          {renderQuickLinks()}
          {renderFeaturedCategories()}
          {renderPromotions()}
          {renderProducts()}
          <View className="h-20" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
