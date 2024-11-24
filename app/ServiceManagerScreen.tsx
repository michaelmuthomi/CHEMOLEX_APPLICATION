import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, User } from 'lucide-react-native';

const initialOrders = [
  { id: '1', customer: 'John Doe', service: 'Repair', status: 'Pending' },
  { id: '2', customer: 'Jane Smith', service: 'Installation', status: 'In Progress' },
  { id: '3', customer: 'Bob Johnson', service: 'Maintenance', status: 'Completed' },
];

const technicians = ['Tech A', 'Tech B', 'Tech C'];

export default function ServiceManagerScreen({ navigation }) {
  const [orders, setOrders] = useState(initialOrders);

  const assignTechnician = (orderId, technician) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, assignedTo: technician, status: 'Assigned' } : order
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Manager</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <View>
                <Text style={styles.customerName}>{item.customer}</Text>
                <Text style={styles.serviceType}>{item.service}</Text>
                <Text style={styles.status}>Status: {item.status}</Text>
                {item.assignedTo && <Text style={styles.assignedTo}>Assigned to: {item.assignedTo}</Text>}
              </View>
              {!item.assignedTo && (
                <View style={styles.assignSection}>
                  <Text style={styles.assignTitle}>Assign to:</Text>
                  {technicians.map((tech) => (
                    <TouchableOpacity
                      key={tech}
                      style={styles.techButton}
                      onPress={() => assignTechnician(item.id, tech)}
                    >
                      <User size={16} color="#fff" />
                      <Text style={styles.techButtonText}>{tech}</Text>
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
  serviceType: {
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
  techButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4299E1',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  techButtonText: {
    color: '#fff',
    marginLeft: 8,
  },
});

