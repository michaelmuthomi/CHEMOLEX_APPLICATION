import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Plus, Minus } from 'lucide-react-native';

const initialProducts = [
  { id: '1', name: 'Product A', stock: 100 },
  { id: '2', name: 'Product B', stock: 75 },
  { id: '3', name: 'Product C', stock: 50 },
];

export default function StockManagementScreen({ navigation }) {
  const [products, setProducts] = useState(initialProducts);
  const [newProduct, setNewProduct] = useState('');

  const updateStock = (id, increment) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, stock: product.stock + increment } : product
    ));
  };

  const addProduct = () => {
    if (newProduct) {
      setProducts([...products, { id: Date.now().toString(), name: newProduct, stock: 0 }]);
      setNewProduct('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stock Management</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.stockControl}>
                <TouchableOpacity onPress={() => updateStock(item.id, -1)} style={styles.stockButton}>
                  <Minus size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.stockCount}>{item.stock}</Text>
                <TouchableOpacity onPress={() => updateStock(item.id, 1)} style={styles.stockButton}>
                  <Plus size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <View style={styles.addProductSection}>
          <TextInput
            style={styles.input}
            value={newProduct}
            onChangeText={setNewProduct}
            placeholder="Enter new product name"
          />
          <TouchableOpacity onPress={addProduct} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
  },
  stockControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockButton: {
    backgroundColor: '#4299E1',
    borderRadius: 4,
    padding: 4,
  },
  stockCount: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  addProductSection: {
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#48BB78',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

