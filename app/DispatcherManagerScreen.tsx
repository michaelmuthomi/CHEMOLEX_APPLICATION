import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Truck } from 'lucide-react-native';
import { fetchOrders } from '~/lib/supabase';
import { useEffect } from 'react';

const drivers = ['Driver A', 'Driver B', 'Driver C'];

export default function DispatcherManagerScreen({ navigation }) {
  const [orders, setOrders] = useState([]);

 useEffect(() => {
   async function fetchCustomerOrders() {
     const response = await fetchOrders();
     console.log("Orders Fetched", response);
     setOrders(response);
   }
   fetchCustomerOrders();
 }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dispatcher Manager</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <View>
                <Text style={styles.customerName}>{item.users.full_name}</Text>
                <Text style={styles.productName}>{item.products.name}</Text>
                <Text style={styles.status}>
                  Payment Status: {item.payment_status}
                </Text>
                {item.assignedTo && (
                  <Text style={styles.assignedTo}>
                    Assigned to: {item.assignedTo}
                  </Text>
                )}
              </View>
              {item.payment_status === "completed" && (
                <View style={styles.assignSection}>
                  <Text style={styles.assignTitle}>Assign to driver:</Text>
                  {drivers.map((driver) => (
                    <TouchableOpacity
                      key={driver}
                      style={styles.driverButton}
                      onPress={() => assignDriver(item.id, driver)}
                    >
                      <Truck size={16} color="#fff" />
                      <Text style={styles.driverButtonText}>{driver}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        />
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
  orderItem: {
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
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  assignedTo: {
    fontSize: 14,
    color: '#48BB78',
    fontWeight: '500',
  },
  assignSection: {
    marginTop: 12,
  },
  assignTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  driverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4299E1',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  driverButtonText: {
    color: '#fff',
    marginLeft: 8,
  },
});

