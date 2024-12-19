import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { ArrowLeft, Tool, ShoppingCart } from 'lucide-react-native';
import { fetchAssignedRepairs } from '~/lib/supabase';
import { P } from '~/components/ui/typography';

const initialRepairs =  [{"created_at": "2024-11-24T14:19:18+00:00", "id": 1, "service_id": 3, "services": {"description": "Professional installation of domestic and commercial air conditioning systems, including LG, Samsung, and Carrier models.", "name": "Air Conditioner Installation", "price": 200, "service_type": "installation"}, "status": "pending", "technician_id": 22}, {"created_at": "2024-11-24T14:20:39+00:00", "id": 2, "service_id": 4, "services": {"description": "Regular servicing and maintenance of air conditioning units to ensure optimal performance and longevity.", "name": "Air Conditioner Maintenance", "price": 100, "service_type": "maintenance"}, "status": "complete", "technician_id": 22}]

export default function TechnicianScreen({ navigation }) {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [newTool, setNewTool] = useState('');

  useEffect(()=> {
    async function fetchRepairs(){
      const response = await fetchAssignedRepairs(22)
      console.log(response)
      setRepairs(response)
    }
    fetchRepairs()
  }, [])

  return (
    <SafeAreaView>
      <View className="flex flex-row items-center p-4 pt-14 bg-zinc-900">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <P className="ml-auto mr-auto">Technician Dashboard</P>
        <View style={styles.placeholder} />
      </View>

      <View className='p-4'>
        <P>Assigned Repairs</P>
        {repairs &&
          repairs.map((repair) => (
            <View style={styles.repairItem} key={repair.service_id}>
              <View>
                <Text style={styles.deviceName}>{repair.services.name}</Text>
                <Text style={styles.issueText}>{repair.services.price}</Text>
                <Text style={styles.status}>Status: {repair.status}</Text>
              </View>
              {repair.status !== "complete" && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() =>
                    updateRepairStatus(repair.service_id, "Completed")
                  }
                >
                  <Text style={styles.completeButtonText}>
                    Mark as Completed
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

        {/* <View style={styles.orderSection}>
          <Text style={styles.sectionTitle}>Order Repair Tools</Text>
          <View style={styles.orderInputContainer}>
            <TextInput
              style={styles.orderInput}
              value={newTool}
              onChangeText={setNewTool}
              placeholder="Enter tool name"
            />
            <TouchableOpacity style={styles.orderButton} onPress={orderTool}>
              <ShoppingCart size={20} color="#fff" />
              <Text style={styles.orderButtonText}>Order</Text>
            </TouchableOpacity>
          </View>
        </View> */}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#2D3748',
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
  issueText: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
  },
  completeButton: {
    backgroundColor: '#48BB78',
    borderRadius: 4,
    padding: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  orderSection: {
    marginTop: 24,
  },
  orderInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4299E1',
    borderRadius: 8,
    padding: 12,
  },
  orderButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});

