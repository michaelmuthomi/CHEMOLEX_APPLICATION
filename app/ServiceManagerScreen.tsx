import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { ArrowLeft, User } from 'lucide-react-native';
import { useEffect } from 'react';
import { fetchServiceRequests } from '~/lib/supabase';
import { H1, H2, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Badge } from '~/components/ui/badge';

const initialOrders = [
  { id: '1', customer: 'John Doe', service: 'Repair', status: 'Pending' },
  { id: '2', customer: 'Jane Smith', service: 'Installation', status: 'In Progress' },
  { id: '3', customer: 'Bob Johnson', service: 'Maintenance', status: 'Completed' },
];

const technicians = ['Tech A', 'Tech B', 'Tech C'];

export default function ServiceManagerScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  

  useEffect(() => {
    async function fetchRepairs() {
      const response = await fetchServiceRequests();
      console.log("Supervisors Fetched", response);
      setOrders(response);
    }
    fetchRepairs();
  }, []);

  return (
    <SafeAreaView>
      <View className="flex flex-row items-center p-4 pt-14 bg-zinc-900">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <P className="ml-auto mr-auto">Service Manager</P>
        <View style={styles.placeholder} />
      </View>

      <View>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <View
              style={{
                borderBottomColor: "#bac4c8",
                borderBottomWidth: StyleSheet.hairlineWidth,
                padding: 2,
              }}
            />
          )}
          className="divide-x-2"
          renderItem={({ item }) => (
            <View className="p-4 gap-4">
              <View className='gap-4'>
                <View>
                  <H1 className="capitalize text-xl border-b-0">
                    {item.services.name}
                  </H1>
                  <P className="line-clamp-1">{item.services.description}</P>
                </View>
                {item.status === "pending" ? (
                  <Badge variant={"destructive"} className="w-1/4">
                    <P>Pending</P>
                  </Badge>
                ) : (
                  <Badge variant={"outline"} className="w-1/4">
                    <P>Assigned</P>
                  </Badge>
                )}
              </View>
              {item.assignedTo && <P>Assigned to: {item.assignedTo}</P>}
              {/* <View
                style={{
                  borderBottomColor: "#bac4c8",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  padding: 2,
                }}
              /> */}
              {!item.assignedTo && (
                <View style={styles.assignSection}>
                  <P>Assign to:</P>
                  <ScrollView horizontal={true}>
                    <View className="flex-row py-4 gap-2">
                      {technicians.map((tech) => (
                        <Button
                          key={tech}
                          variant={"outline"}
                          className="flex-row"
                          onPress={() => assignTechnician(item.id, tech)}
                        >
                          <User size={16} color="#fff" />
                          <P>{tech}</P>
                        </Button>
                      ))}
                    </View>
                  </ScrollView>
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

