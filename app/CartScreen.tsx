import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Minus, Plus, MoreHorizontal } from 'lucide-react-native';

export default function CartScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Bag</Text>
        
        {/* Almina Product */}
        <View style={styles.productCard}>
          <View style={styles.brandHeader}>
            <Text style={styles.brandName}>Almina Concept</Text>
            <Image 
              source={{ uri: '/placeholder.svg' }}
              style={styles.brandLogo}
            />
          </View>
          
          <View style={styles.productDetails}>
            <Image
              source={{ uri: '/placeholder.svg' }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>Mohair Cardigan</Text>
              <Text style={styles.productVariant}>S / Off White</Text>
              <Text style={styles.price}>$148.00</Text>
              
              <View style={styles.quantitySelector}>
                <TouchableOpacity style={styles.quantityButton}>
                  <Minus size={20} color="#000" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>1</Text>
                <TouchableOpacity style={styles.quantityButton}>
                  <Plus size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreHorizontal size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Kith Product */}
        <View style={styles.productCard}>
          <View style={styles.brandHeader}>
            <Text style={styles.brandName}>Kith</Text>
            <Image 
              source={{ uri: '/placeholder.svg' }}
              style={styles.brandLogo}
            />
          </View>
          
          <View style={styles.productDetails}>
            <Image
              source={{ uri: '/placeholder.svg' }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>Kith for MEDICOM TOY BE@RBRICK 100% &</Text>
              <Text style={styles.price}>$210.00</Text>
              
              <View style={styles.quantitySelector}>
                <TouchableOpacity style={styles.quantityButton}>
                  <Minus size={20} color="#000" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>2</Text>
                <TouchableOpacity style={styles.quantityButton}>
                  <Plus size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreHorizontal size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.checkoutButton}
        onPress={() => navigation.navigate('CheckoutScreen')}>
          <Text style={styles.checkoutButtonText}>Continue to checkout</Text>
          <Text style={styles.checkoutButtonPrice}>$148.00</Text>
        </TouchableOpacity>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 16,
  },
  productCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  brandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '600',
  },
  brandLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  productDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    marginBottom: 4,
  },
  productVariant: {
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 25,
    padding: 4,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    paddingHorizontal: 16,
    fontSize: 16,
  },
  moreButton: {
    marginLeft: 8,
    padding: 8,
  },
  checkoutButton: {
    backgroundColor: '#6366f1',
    margin: 16,
    padding: 16,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  checkoutButtonPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
  footerText: {
    color: '#666',
    marginHorizontal: 8,
  },
  footerLogo: {
    width: 80,
    height: 20,
    resizeMode: 'contain',
  },
});

