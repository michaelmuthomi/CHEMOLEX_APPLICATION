import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ArrowLeft,
  Tool,
  ShoppingCart,
  LocateIcon,
  Pin,
} from "lucide-react-native";
import { fetchAssignedRepairs, fetchCustomerOrders, fetchOrders } from "~/lib/supabase";
import { H1, H2, H3, H4, H5, H6, P } from "~/components/ui/typography";
import { checkUser } from "~/lib/supabase";
import { useEmail } from "../EmailContext";

export default function TechnicianScreen({ navigation }) {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [newTool, setNewTool] = useState("");
  const [customer, setCustomerDetails] = useState([]);
  const [orders, setOrders] = useState([])
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
    async function fetchAllOrders() {
      const response = await fetchOrders()
      setOrders(response)
    }
    fetchAllOrders()
    fetchUserDetails();
    fetchRepairs();
  }, []);

  return (
    <ScrollView>
      <View className="p-4 py-16 bg-[#07140D]">
        <H5 className="text-sm px-[4px]">Available Balance</H5>
        <H6 className="text-5xl uppercase px-0 leading-relaxed">Ksh 1.2M</H6>
      </View>
      <View className="p-4 py-10 bg-white h-full">
        <H5 className="text-2xl text-black">Approve Orders</H5>
        <ScrollView className="pt-10">
          {orders !== "" ? (
            orders.map((order) => (
              <View
                className="py-4 gap-24 pt-6 grid grid-cols-1 divide-y"
                key={order.order_id}
              >
                <View className="gap-6">
                  <View>
                    <H6 className="text-base text-black">#{order.order_id}</H6>
                    <View className="flex-row justify-between w-full items-top">
                      <H1 className="w-2/3 text-2xl text-black">
                        {order.products.name}
                      </H1>
                      <H5 className="text-orange-400 capitalize">
                        {order.payment_status}
                      </H5>
                    </View>
                    <View>
                      <H4 className="text-xl text-black w-max">
                        {order.total_price}
                        <H4 className="text-base text-black">KSH</H4>
                      </H4>
                    </View>
                  </View>
                  <View className="gap-2">
                    <View className="flex-row justify-between">
                      <View className="w-max flex-row items-center gap-[4px]">
                        <FontAwesome6 name="location-dot" size={14} />
                        <H5 className="text-black w-max text-base">
                          Nairobi, Kenya
                        </H5>
                      </View>
                      <View className="w-max flex-row items-center gap-[4px]">
                        <MaterialCommunityIcons
                          name="clock-time-five"
                          size={14}
                        />
                        <H5 className="text-black text-base">
                          Mon 12 - 12,00 PM
                        </H5>
                      </View>
                    </View>
                    <ScrollView horizontal>
                      <View className="flex-row gap-4 overflow-scroll">
                        <TouchableOpacity
                          className="px-10 rounded-full bg-[#000] !py-4 !border-none"
                          onPress={() => router.push("/SignupScreen")}
                        >
                          <P className="text-white text-center">
                            Approve for Dispatch
                          </P>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="px-16 rounded-full bg-[#c94040] !py-4 !border-none"
                          onPress={() => router.push("/LoginScreen")}
                        >
                          <P className="text-white text-center">Reject</P>
                        </TouchableOpacity>
                      </View>
                    </ScrollView>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="gap-4">
              <View className="w-full h-40 bg-zinc-300 animate-pulse rounded-lg" />
              <View className="w-full h-40 bg-zinc-300 animate-pulse rounded-lg" />
              <View className="w-full h-40 bg-zinc-300 animate-pulse rounded-lg" />
            </View>
          )}
        </ScrollView>
      </View>
    </ScrollView>
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

