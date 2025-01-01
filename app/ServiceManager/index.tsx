import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabase } from "~/lib/supabase";
import { OrderItem } from "~/components/OrderItem";
import { TechnicianModal } from "~/components/TechnicianModal";
import { Filter } from "lucide-react-native";
import { H1, H3, P } from "~/components/ui/typography";

type Order = {
  id: number;
  service: string;
  date: string;
  time: string;
  customerName: string;
  status: "Pending" | "Assigned" | "Completed";
  assignedTo?: string;
};

type Technician = {
  id: number;
  name: string;
  speciality: string;
};

const ServiceManagerPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Pending" | "Assigned"
  >("All");
  const skeletons = [0, 1, 2, 3, 4, 5, 6];

  useEffect(() => {
    fetchOrders();
    fetchTechnicians();
    const subscription = supabase
      .channel("repairs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        handleOrderChange
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("repairs")
        .select("*, services(*), users:customer_id(full_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const { data, error } = await supabase.from("technicians").select("*");

      if (error) throw error;
      setTechnicians(data || []);
    } catch (err) {
      console.error("Error fetching technicians:", err);
    }
  };

  const handleOrderChange = (payload: any) => {
    fetchOrders();
  };

  const handleAssign = (orderId: number) => {
    setSelectedOrderId(orderId);
    setModalVisible(true);
  };

  const assignTechnician = async (technicianId: number) => {
    if (!selectedOrderId) return;

    try {
      const technician = technicians.find((t) => t.id === technicianId);
      if (!technician) throw new Error("Technician not found");

      const { error } = await supabase
        .from("orders")
        .update({ status: "Assigned", assignedTo: technician.name })
        .eq("id", selectedOrderId);

      if (error) throw error;

      setModalVisible(false);
      setSelectedOrderId(null);
      Alert.alert("Success", "Technician assigned successfully");
    } catch (err) {
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "All") return true;
    return order.status === filterStatus;
  });

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500 text-lg">{error}</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={fetchOrders}
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 ">
      <View className="bg-blue-800 p-6">
        <View className="flex-row justify-between items-center">
          {/* <H3 className="text-white text-lg">Filter by Status:</H3> */}
          <View className="flex-row">
            {(["All", "pending", "assigned"] as const).map((status) => (
              <TouchableOpacity
                key={status}
                className={`px-3 py-1 rounded-md ${
                  filterStatus === status ? "bg-white" : "bg-blue-700"
                }`}
                onPress={() => setFilterStatus(status)}
              >
                <P
                  className={`capitalize ${
                    filterStatus === status ? "text-blue-800" : "text-white"
                  }`}
                >
                  {status}
                </P>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="gap-4">
          {isLoading ? (
            skeletons.map((skeleton) => (
              <View
                className="w-full h-32 bg-zinc-900 animate-pulse"
                key={skeleton}
              />
            ))
          ) : filteredOrders.length === 0 ? ( 
            <View>
              <H1 className="text-white !text-[40px]">No results {'\n'}Found</H1>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <OrderItem key={order.id} order={order} onAssign={handleAssign} />
            ))
          )}
        </View>
      </ScrollView>

      <TechnicianModal
        visible={modalVisible}
        technicians={technicians}
        onAssign={assignTechnician}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default ServiceManagerPage;
