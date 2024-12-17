import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Search, ChevronRight, Star, Filter } from 'lucide-react-native';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { P, H3, H4, H2 } from "~/components/ui/typography";
import { fetchProductInCategory } from "~/lib/supabase";
import { formatPrice } from "~/lib/format-price";
import { useNavigation } from "@react-navigation/native";

const categories = [
  {
    id: 1,
    title: "Chillers",
    image: "http://5.imimg.com/data5/SELLER/Default/2024/8/442306416/ZH/AP/PZ/1889348/air-cooled-chillers-1000x1000.png",
    backgroundColor: "#0F4C3A",
  },
  {
    id: 2,
    title: "Air Handling Units",
    image: "http://5.imimg.com/data5/SELLER/Default/2024/4/412323270/DE/RZ/DK/9199886/single-skin-air-handling-unit-1000x1000.png",
    backgroundColor: "#FF6347",
  },
  {
    id: 3,
    title: "Fan coil units",
    image: "http://5.imimg.com/data5/SELLER/Default/2023/1/CY/AP/RC/43000247/fan-coil-unit-500x500.png",
    backgroundColor: "#8B8B00",
  },
  {
    id: 4,
    title: "Vrf Multi",
    image: "http://5.imimg.com/data5/SELLER/Default/2024/4/414735525/QN/IM/OK/202996372/misubishi-air-conditioner-500x500.jpg",
    backgroundColor: "#8B4513",
  },
  {
    id: 5,
    title: "Ducted Split system",
    image: "http://5.imimg.com/data5/SELLER/Default/2023/9/347250443/OM/QN/BY/9267344/ductable-split-units-1000x1000.jpeg",
    backgroundColor: "#8B4513",
  },
  {
    id: 6,
    title: "Residential",
    image: "http://5.imimg.com/data5/SELLER/Default/2024/4/411112381/TA/TR/IA/202996372/residential-rooftop-packaged-unit-1000x1000.jpg",
    backgroundColor: "#8B4513",
  },
  {
    id: 7,
    title: "Accessories",
    image: "http://5.imimg.com/data5/SELLER/Default/2024/3/402772737/YI/CJ/KF/13324667/1-1000x1000.jpg",
    backgroundColor: "#8B4513",
  },
];

export default function SearchScreen({ route }) {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params]);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryProducts(selectedCategory.title);
    }
  }, [selectedCategory]);

  const fetchCategoryProducts = async (categoryName) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProductInCategory(categoryName);
      if (result.error) {
        setError(result.error.message);
      } else {
        setProducts(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortProducts = (products) => {
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'popularity':
      default:
        return [...products];
    }
  };

  const sortedAndFilteredProducts = sortProducts(filteredProducts);

  const renderCategoryView = () => (
    <View className='gap-4'>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          className='h-40 rounded-md flex-row justify-between px-4'
          style={{ backgroundColor: category.backgroundColor }}
          onPress={() => handleCategoryPress(category)}
        >
          <H4 className="text-xl mt-4 text-white">{category.title}</H4>
          <Image
            source={{ uri: category.image }}
            style={styles.categoryImage}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderProductsView = () => (
    <View className="flex-1">
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          onPress={() => setSelectedCategory(null)}
          className="flex-row items-center px-0"
        >
          <ChevronRight
            size={24}
            color="#fff"
            style={{ transform: [{ rotate: "180deg" }] }}
          />
          <P>Back to Categories</P>
        </TouchableOpacity>
        <H3 className="text-base">{selectedCategory.title}</H3>
      </View>

      <View className="flex-row gap-2 mb-4">
        {["popularity", "price-low", "price-high"].map((sort) => (
          <Button
            key={sort}
            onPress={() => setSortBy(sort)}
            className={`${
              sortBy === sort ? "bg-zinc-700 text-white" : " bg-zinc-900 text-black"
            }`}
          >
            <P className="capitalize">{sort.replace("-", " ")}</P>
          </Button>
        ))}
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <P className="text-red-500">{error}</P>
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-4">
          {sortedAndFilteredProducts.map((product) => (
            <TouchableOpacity
              key={product.product_id}
              className="w-full bg-[#111] rounded-lg shadow p-2"
              onPress={() => navigation.navigate("ProductScreen", { product })}
            >
              <View className="mt-2">
                <H4 numberOfLines={2}>{product.name}</H4>
                <P className="mt-1 text-sm">{formatPrice(product.price)}</P>
              </View>
              <Image
                source={{ uri: product.image_url }}
                className="w-3/4 h-20 ml-auto rounded-tl-md"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className='flex-1 px-4'>
      <View className="flex-row items-center justify-between gap-4 mt-10">
        <Input
          placeholder="Search for product"
          placeholderTextColor="#666"
          className="w-full"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView className="pt-4">
        {selectedCategory ? renderProductsView() : renderCategoryView()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
});
