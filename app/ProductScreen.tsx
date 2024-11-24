import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { ChevronLeft, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react-native';

export default function ProductScreen({ navigation }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.iconButton}>
            <ChevronLeft size={24} color="#000" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>High Tide Hydrating Cleanser</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <View style={styles.iconButton}>
            <ShoppingCart size={24} color="#000" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: '/placeholder.svg?height=600&width=600' }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.subtitle}>One step, multiple benefits</Text>
          
          <Text style={styles.title}>High Tide Hydrating Cleanser</Text>
          
          <Text style={styles.price}>$15.00</Text>

          <Text style={styles.description}>
            This 2-in-1 cleanser removes dirt and grime while hydrating skin at the same time. 
            With a pH around 5 (which matches skin's natural levels) it cleans without stripping skin. 
            Talk about a win-win!
          </Text>

          <TouchableOpacity 
            style={styles.expandableSection}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <View style={styles.expandableHeader}>
              <Text style={styles.expandableTitle}>Why you'll love it</Text>
              {isExpanded ? (
                <ChevronUp size={24} color="#000" />
              ) : (
                <ChevronDown size={24} color="#000" />
              )}
            </View>
            {isExpanded && (
              <View style={styles.expandableContent}>
                <Text style={styles.expandableText}>
                  • Gentle yet effective cleansing{'\n'}
                  • Hydrating formula{'\n'}
                  • pH balanced{'\n'}
                  • Suitable for all skin types{'\n'}
                  • Dermatologist tested
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.buyNowButton}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>

      
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
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    margin: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 24,
  },
  expandableSection: {
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    paddingTop: 16,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandableTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  expandableContent: {
    marginTop: 16,
  },
  expandableText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  brandFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    gap: 8,
  },
  brandLogo: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '500',
  },
  footerText: {
    color: '#666',
  },
  mobbinLogo: {
    width: 80,
    height: 20,
    resizeMode: 'contain',
  },
});

