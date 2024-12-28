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
import { H1, H2, H3, H4, H5, H6, P } from "~/components/ui/typography";
import { checkUser } from "~/lib/supabase";
import { useEmail } from '../EmailContext';


export default function TechnicianScreen({ navigation }) {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [newTool, setNewTool] = useState("");
  const [customer, setCustomerDetails] = useState([]);
  const emailContext = useEmail();

  useEffect(() => {
    async function fetchRepairs() {
      const response = await fetchAssignedRepairs(22);
      console.log(response);
      setRepairs(response);
    }
    async function fetchUserDetails() {
      const response = await checkUser(emailContext?.email);
      setCustomerDetails(response);
    }
    fetchUserDetails();
    fetchRepairs();
  }, []);

  return (
    <SafeAreaView>
      <View className="px-6 pt-14 pb-2 bg-[#111]">
        <H2 className="text-2xl border-b-0 leading-0">
          Hi there,{" "}
          {customer.username ? (
            customer.username
          ) : (
            <View className="animate-pulse w-20 h-4 rounded-sm bg-zinc-800" />
          )}{" "}
          👋
        </H2>
        <H5 className="text-zinc-400 text-sm border-b-0 capitalize">
          {customer.role ? (
            customer.role.replace("_", " ")
          ) : (
            <View className="animate-pulse w-36 h-4 rounded-sm bg-zinc-800" />
          )}
        </H5>
      </View>

      <View className="p-4 py-16 bg-[#07140D]">
        <H5 className="text-sm px-[4px]">Available Balance</H5>
        <H6 className="text-5xl uppercase px-0 leading-relaxed">
          Ksh 1,102,390
        </H6>
      </View>
      <View className="p-4 py-10">
        <H5 className="text-2xl">Manage Orders</H5>
        <View className='py-4 gap-2'>
          <H6 className='text-base'>#H263B</H6>
          <View className='flex-row justify-between w-full'>
            <H3 className='w-max text-xl'>Air Conditioning Unit</H3>
            <H4 className="text-orange-400">Pending</H4>
          </View>
          <View className='flex'>
            <View>
              <H6>Nairobi, Kenya</H6>
            </View>
            <View>
              <H6>Mon 12 - 12,00 PM</H6>
            </View>
          </View>
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

