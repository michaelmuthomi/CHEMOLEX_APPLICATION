import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react-native';
import { useEffect } from 'react';
import { fetchSubmittedRepairs } from '~/lib/supabase';

const initialRepairs = [
  { id: '1', device: 'Laptop', technician: 'Tech A', status: 'Pending Approval' },
  { id: '2', device: 'Smartphone', technician: 'Tech B', status: 'Pending Approval' },
  { id: '3', device: 'Tablet', technician: 'Tech C', status: 'Approved' },
];

export default function SupervisorScreen({ navigation }) {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [newTool, setNewTool] = useState('');

  useEffect(()=> {
    async function fetchRepairs(){
      const response = await fetchSubmittedRepairs(12)
      console.log(response)
      setRepairs(response)
    }
    fetchRepairs()
  }, [])

  const rejectRepair = (id) => {
    setRepairs(repairs.map(repair => 
      repair.id === id ? { ...repair, status: 'Rejected' } : repair
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Supervisor Dashboard</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <FlatList
          data={repairs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.repairItem}>
              <View>
                <Text style={styles.deviceName}>{item.services.name}</Text>
                <Text style={styles.technicianName}>Technician: {item.users.full_name}</Text>
                <Text style={styles.status}>Status: {item.status}</Text>
              </View>
              {item.status === 'pending' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => approveRepair(item.id)}
                  >
                    <CheckCircle size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => rejectRepair(item.id)}
                  >
                    <XCircle size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </TouchableOpacity>
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
  repairItem: {
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
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  technicianName: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    padding: 8,
    flex: 1,
    justifyContent: 'center',
  },
  approveButton: {
    backgroundColor: '#48BB78',
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: '#F56565',
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
});

