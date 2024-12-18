import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, BedDoubleIcon, Check, CircleDollarSign, HandCoins, Truck } from 'lucide-react-native';
import { fetchOrders } from '~/lib/supabase';
import { useEffect } from 'react';
import { H3, H4, P } from '~/components/ui/typography';

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
    <SafeAreaView>
      <View className="flex flex-row items-center p-4 pt-14 bg-zinc-900">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <P className="ml-auto mr-auto">Dispatch Manager</P>
        <View style={styles.placeholder} />
      </View>

      <View className="p-4 divide-y-4 flex gap-4">
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          renderItem={({ item }) => (
            <View
              className="flex rounded-lg border-[1px] border-zinc-800"
              key={item.id}
            >
              <View className="p-2 flex-row items-center justify-between">
                <H3 className="text-xl">{item.users.full_name}</H3>
                <View className="flex-row items-center gap-2">
                  {item.payment_status === "completed" ? (
                    <>
                      <CircleDollarSign size={16} color="#00a800" />
                      <P className="text-[#00a800]">Successful</P>
                    </>
                  ) : (
                    <P className="text-red-700">Pending</P>
                  )}
                </View>
              </View>
              <View
                style={{
                  borderBottomColor: "#bac4c8",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  padding: 2,
                }}
              />
              <P className="p-2">{item.products.name}</P>
              {item.assignedTo && <P>Assigned to: {item.assignedTo}</P>}
              {item.payment_status === "completed" && (
                <View className="p-2">
                  <P>Assign to driver:</P>
                  {drivers.map((driver) => (
                    <TouchableOpacity
                      key={driver}
                      style={styles.driverButton}
                      onPress={() => assignDriver(item.id, driver)}
                    >
                      <Truck size={16} color="#fff" />
                      <P>{driver}</P>
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

