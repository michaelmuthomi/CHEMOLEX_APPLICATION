import React from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { ChevronLeft, Menu } from "lucide-react-native";
import { H1, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { fetchProductInCategory } from "~/lib/supabase";
import { formatPrice } from "~/lib/format-price";
const categories = [
  { id: 1, title: "Makeup", image: "/placeholder.svg?height=200&width=200" },
  { id: 2, title: "Skin Care", image: "/placeholder.svg?height=200&width=200" },
  { id: 3, title: "Nail Care", image: "/placeholder.svg?height=200&width=200" },
  { id: 4, title: "Hair Care", image: "/placeholder.svg?height=200&width=200" },
];

export default function HomeScreen({ route }) {
  const [products, setProducts] = useState([]);
    const { id } = route.params;
    
  useEffect(() => {
    fetchProductInCategory(id).then(setProducts);
  }, []);
  return (
    <SafeAreaView>
      <ScrollView className="pt-14">
        <H1 className="px-6">All Products</H1>

        <View style={styles.productsGrid}>
          {products.map((product) => (
            <View
              key={product.product_id}
              style={styles.productCard}
            >
              <Image
                source={{ uri: product.image_url }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <P style={styles.productTitle} numberOfLines={2}>
                  {product.name}
                </P>
                <P style={styles.productPrice}>{formatPrice(product.price)}</P>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
