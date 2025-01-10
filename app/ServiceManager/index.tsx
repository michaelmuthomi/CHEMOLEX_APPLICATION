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
import { ArrowDownNarrowWide, Filter, GalleryVerticalEnd } from "lucide-react-native";
import { H1, H3, H4, P } from "~/components/ui/typography";
import {
  GalleryVertical,
  ListChecks,
  ListTodo,
  MessageCircle,
} from "lucide-react-native";
import StatsCard from "~/components/StatsCard";
import { AssignTechnicianModal } from "~/components/sheets/assignTechnician";

type Order = {
  id: number;
  service: string;
  date: string;
  time: string;
  customerName: string;
  status: "pending" | "assigned" | "completed";
  assignedTo?: string;
  products: any;
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
    "All" | "pending" | "assigned"
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
        .select(
          "*, services(*), users:customer_id(full_name), products:product_id(*), technicians:technician_id(full_name)"
        )
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
      const { data, error } = await supabase.from("technicians").select("*, users:user_id(username)");

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
        .from("repairs")
        .update({ status: "assigned", assignedTo: technician.name })
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

  const calculateStats = (orders: Order[]) => {
    return [
      {
        iconBgColor: "bg-blue-600",
        Icon: <GalleryVertical color="white" size={19} />,
        Title: "Total Orders",
        Description: `${orders.length} orders`,
      },
      {
        iconBgColor: "bg-orange-600",
        Icon: <ListTodo color="white" size={19} />,
        Title: "Pending",
        Description: `${
          orders.filter((o) => o.status === "pending").length
        } orders`,
      },
      {
        iconBgColor: "bg-green-600",
        Icon: <ListChecks color="white" size={19} />,
        Title: "Assigned",
        Description: `${
          orders.filter((o) => o.status === "assigned").length
        } orders`,
      },
      {
        iconBgColor: "bg-purple-600",
        Icon: <MessageCircle color="white" size={19} />,
        Title: "Completed",
        Description: `${
          orders.filter((o) => o.status === "completed").length
        } orders`,
      },
    ];
  };

  const stats = calculateStats(orders);

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
    <View className="flex-1">
      <ScrollView className="flex-1">
        <View className="bg-white p-4 gap-6">
          <H3 className="text-black">Statistics</H3>
          <View className="flex-row flex-wrap gap-y-6 justify-between">
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                iconBgColor={stat.iconBgColor}
                Icon={stat.Icon}
                Title={stat.Title}
                Description={stat.Description}
              />
            ))}
          </View>
        </View>

        <View className="py-6 px-4">
          <View className="flex-row justify-between items-center">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row gap-2"
            >
              {(["All", "pending", "assigned"] as const).map(
                (status, index) => (
                  <TouchableOpacity
                    key={status}
                    className={`px-3 pb-2 border-b-2 flex-row items-center ${
                      filterStatus === status
                        ? "border-white"
                        : "border-zinc-900"
                    }`}
                    onPress={() => setFilterStatus(status)}
                  >
                    {status === "All" ? (
                      <GalleryVerticalEnd
                        size={16}
                        color={filterStatus === status ? "#fff" : "#3f3f46"}
                      />
                    ) : status === "pending" ? (
                      <ListTodo
                        size={16}
                        color={filterStatus === status ? "#fff" : "#3f3f46"}
                      />
                    ) : (
                      <ListChecks
                        size={16}
                        color={filterStatus === status ? "#fff" : "#3f3f46"}
                      />
                    )}
                    <H4
                      className={`capitalize text-lg px-2 ${
                        filterStatus === status ? "text-white" : "text-zinc-700"
                      }`}
                    >
                      {status === "All" ? "All Requests" : status}
                    </H4>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>
          </View>
        </View>

        <View className="flex-1 p-4">
          <View className="gap-4">
            {isLoading ? (
              skeletons.map((skeleton, index) => (
                <View
                  className="w-full h-32 bg-zinc-900 animate-pulse rounded-lg"
                  key={index}
                />
              ))
            ) : filteredOrders.length === 0 ? (
              <View className="p-4">
                <H1 className="text-white !text-[40px]">
                  No results {"\n"}Found
                </H1>
              </View>
            ) : (
              filteredOrders.map((order, index) => (
                <AssignTechnicianModal
                  key={index}
                  sheetTrigger={
                    <OrderItem order={order} onAssign={handleAssign} />
                  }
                  visible={modalVisible && selectedOrderId === order.id}
                  product={order.products}
                  repair={order}
                  technicians={technicians}
                  onAssign={(technicianId) => assignTechnician(technicianId)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ServiceManagerPage;
