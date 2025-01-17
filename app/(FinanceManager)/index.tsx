import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { checkUser, fetchAllFinancialRecords, supabase } from "~/lib/supabase";
import { RepairCard } from "~/components/RepairCard";
import { useEmail } from "../EmailContext";
import { H2, H3, H4, H5, P } from "~/components/ui/typography";
import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  GalleryVertical,
  GalleryVerticalEnd,
  ListChecks,
  ListTodo,
  MessageCircle,
} from "lucide-react-native";
import StatsCard from "~/components/StatsCard";
import { formatBalance } from "~/lib/formatBalance";
import { OrderCard } from "~/components/OrderCard";
import { Button } from "~/components/ui/button";

const ORDERS_PER_PAGE = 6;

export default function Page() {
  type OrderStatus = "pending" | "approved";
  type Order = {
    id: number;
    deviceName: string;
    deviceType: string;
    issueDescription: string;
    status: string;
    dueDate: string;
    requiredProducts: { name: string; quantity: number }[];
    orderNotes: string;
  };
  const emailContext = useEmail();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [technicianId, setTechnicianId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("all-orders");
  const [financeRecords, setFinanceRecords] = useState([]);
  const [stats, setStats] = useState([
    {
      iconBgColor: "bg-purple-600",
      Icon: <CreditCard color="white" size={19} />,
      Title: "Acc. Balance",
      Description: `KSh ${
        formatBalance(financeRecords[financeRecords.length - 1]?.balance) || 0
      }`,
    },
    {
      iconBgColor: "bg-green-600",
      Icon: <ArrowUp color="white" size={19} />,
      Title: "Revenue",
      Description: "Ksh 0",
    },
    {
      iconBgColor: "bg-red-600",
      Icon: <ArrowDown color="white" size={19} />,
      Title: "Expenses",
      Description: "$876,543",
    },
    {
      iconBgColor: "bg-blue-600",
      Icon: <ArrowUp color="white" size={19} />,
      Title: "Profit",
      Description: "$358,024",
    },
  ]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  

  useEffect(() => {
    fetchAllOrders();
    const subscription = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        handleRepairChange
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [technicianId]); // Add technicianId as a dependency

  useEffect(() => {
    async function fetchFinanceRecords() {
      const response = await fetchAllFinancialRecords();
      setFinanceRecords(response);

      // Calculate total amount, revenue from incoming payments, and expenses
      const totalAmount = response.reduce(
        (total, record) => total + record.amount,
        0
      );
      const revenue = response.reduce((total, record) => {
        return record.payment_type === "incoming"
          ? total + record.amount
          : total;
      }, 0);

      // Calculate expenses
      const expenses = response.reduce((total, record) => {
        return record.payment_type === "outgoing"
          ? total + record.amount
          : total;
      }, 0);

      // Calculate profit
      const profit = revenue - expenses;

      // Calculate revenue and expenses percentage
      const revenuePercentage =
        totalAmount > 0 ? (revenue / totalAmount) * 100 : 0;
      const expensesPercentage =
        totalAmount > 0 ? (expenses / totalAmount) * 100 : 0;

      // Update the revenue and profit in stats
      console.log("Calc revenue percentage:", revenuePercentage);
      console.log("Calc profit:", profit);
      setStats((prevStats) => {
        const updatedStats = [...prevStats];
        updatedStats[1].Description = `${revenuePercentage.toFixed(2)}%`; // Update revenue description to show percentage
        updatedStats[2].Description = `${expensesPercentage.toFixed(
          1
        )}% per year`; // Update expenses description to show percentage
        updatedStats[3].Description = `KSh ${formatBalance(profit)}`; // Update profit description

        // Update account balance in stats
        const latestBalance = response[response.length - 1]?.balance || 0; // Get the latest balance
        updatedStats[0].Description = `KSh ${formatBalance(latestBalance)}`; // Update account balance description

        return updatedStats;
      });
    }
    fetchFinanceRecords();
    async function fetchUserDetails() {
      if (!emailContext || !emailContext.email) {
        console.error("Email context is not available");
        return;
      }

      const response = await checkUser(emailContext.email);
      if (!response || !response.user_id) {
        console.error("User  details could not be fetched");
        return;
      }

      console.log("Username", response.full_name);
      const userId = response.user_id;

      setTechnicianId(userId);
    }
    fetchUserDetails();
  }, [emailContext]);

  const fetchAllOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, products:product_id(*), users:user_id(*)");

      if (error) throw error;
      setOrders(data || []);

      // Update stats based on fetched orders
      const assignmentCount = data.filter(
        (r) => r.status === "assigned"
      ).length;
      const pendingCount = data.filter((r) => r.status === "pending").length;
      const approvedCount = data.filter((r) => r.status === "approved").length;
      const redoCount = data.filter((r) => r.status === "redo").length;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepairChange = (payload: any) => {
    fetchAllOrders();
  };

  const handleViewDetails = (orderId: number) => {
    const order = orders.find((r) => r.id === orderId);
    if (order) {
      console.log("Selected order", order);
      setSelectedOrder(order);
      setIsModalVisible(true);
    }
  };

  const handleUpdateStatus = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      Alert.alert("Success", `Order status updated to ${newStatus}`);
      setIsModalVisible(false);
      fetchAllOrders();
    } catch (err) {
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const getSortedOrders = () => {
    switch (sortBy) {
      case "pending":
        return orders.filter((order) => order.finance_approval === "pending");
      case "approved":
        return orders.filter((order) => order.finance_approval === "approved");
      default:
        return orders;
    }
  };

  const sortedOrders = getSortedOrders();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllOrders();
    setRefreshing(false);
  };

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,  
    currentPage * ORDERS_PER_PAGE
  );

  const totalPages = Math.ceil(sortedOrders.length / ORDERS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500 text-lg">{error}</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={fetchAllOrders}
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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

        <View className="flex-row p-2 pt-4 justify-between items-center">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-2"
          >
            {["all-orders", "pending", "approved"].map((sort, index) => (
              <TouchableOpacity
                key={index}
                className={`px-3 pb-2 border-b-2 flex-row items-center ${
                  sortBy === sort ? "border-white" : "border-zinc-900"
                }`}
                onPress={() => setSortBy(sort)}
              >
                {sort === "all-orders" ? (
                  <GalleryVerticalEnd
                    size={16}
                    color={sortBy === sort ? "#fff" : "#3f3f46"}
                  />
                ) : sort === "pending" ? (
                  <ListTodo
                    size={16}
                    color={sortBy === sort ? "#fff" : "#3f3f46"}
                  />
                ) : (
                  <ListChecks
                    size={16}
                    color={sortBy === sort ? "#fff" : "#3f3f46"}
                  />
                )}
                <H4
                  className={`capitalize text-lg px-2 ${
                    sortBy === sort ? "text-white" : "text-zinc-700"
                  }`}
                >
                  {sort.replace("-", " ")}
                </H4>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="p-4">
          {paginatedOrders.map((selectedOrder, index) => (
            <OrderCard
              key={index}
              order={selectedOrder}
              onViewDetails={handleViewDetails}
            />
          ))}
          <View className="flex-row items-center justify-between my-4">
            <Button
              className="bg-[#111] rounded-full px-4 py-2 disabled:bg-zinc-900"
              onPress={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <P className="text-white">&larr; Previous</P>
            </Button>

            <P className="text-white mx-4">
              Page {currentPage} of {totalPages}
            </P>

            <Button
              className="bg-[#111] rounded-full px-4 py-2 disabled:bg-zinc-900"
              onPress={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <P className="text-white">Next &rarr;</P>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
