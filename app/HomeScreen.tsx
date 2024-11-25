import React from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { ChevronLeft, Menu } from 'lucide-react-native';
import { H1, H2, H3, H4, P } from '~/components/ui/typography';
import { Button } from '~/components/ui/button';
import { useEffect, useState } from 'react';
import { fetchProductsFromDB } from '~/lib/supabase';
import {formatPrice} from "~/lib/format-price";
const categories = [
  { id: 1, title: 'Makeup', image: '/placeholder.svg?height=200&width=200' },
  { id: 2, title: 'Skin Care', image: '/placeholder.svg?height=200&width=200' },
  { id: 3, title: 'Nail Care', image: '/placeholder.svg?height=200&width=200' },
  { id: 4, title: 'Hair Care', image: '/placeholder.svg?height=200&width=200' },
];

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetchProductsFromDB().then(setProducts);
  }, []);
  return (
    <SafeAreaView className='flex-1'>
      <ScrollView className='pt-14'>
        <H3 className="px-6">Discover</H3>

        <View style={styles.productsGrid}>
          {products.map((product) => (
            <TouchableOpacity
              key={product.product_id}
              style={styles.productCard}
              onPress={() => navigation.navigate('ProductScreen', { product })}
            >
              <Image
                source={{ uri: product.image_url }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <H3 className="text-lg leading-5" numberOfLines={2}>
                  {product.name}
                </H3>
                <P className="text-sm">{formatPrice(product.price)}</P>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '600',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 16,
  },
  categoriesScroll: {
    paddingLeft: 16,
  },
  categoryCard: {
    width: 150,
    height: 150,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryTitle: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  filterSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  filterButton: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonP: {
    fontSize: 16,
  },
  chipButton: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipButtonP: {
    fontSize: 16,
  },
  productCount: {
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  productCard: {
    width: '50%',
    padding: 8,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    paddingRight: 24,
  },
  productTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  wishlistButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  wishlistIcon: {
    fontSize: 20,
  },
});
