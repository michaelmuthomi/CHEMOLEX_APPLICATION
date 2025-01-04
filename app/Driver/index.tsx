import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { checkUser, supabase } from "~/lib/supabase";
import { DispatchCard } from "~/components/DispatchCard";
import { DispatchDetailsModal } from "~/components/DispatchDetailsModal";
import { GalleryVertical, ListChecks, ListTodo, MessageCircle, Search, SearchIcon } from "lucide-react-native";
import { useEmail } from "../EmailContext";
import { H3 } from "~/components/ui/typography";
import StatsCard from "~/components/StatsCard";
import { Input } from "~/components/ui/input";

type DispatchStatus = "Pending" | "In Transit" | "Delivered";

type Order = {
  order_id: number;
  product_id: number;
  // ... other order fields
};

type Product = {
  product_id: number;
  name: string;
  description: string;
  // ... other product fields
};

type Dispatch = {
  order_id: number;
  user_id: number;
  dispatch_date: string;
  status: DispatchStatus;
  delivery_address: string;
  tracking_number: string;
  created_at: string;
  driver_id: number;
  order: Order;
  order_details: {
    product: Product;
  };
};

const DriversPage: React.FC = () => {
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [filteredDispatches, setFilteredDispatches] = useState<Dispatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDispatch, setSelectedDispatch] = useState<Dispatch | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customer, setCustomerDetails] = useState([]);
  const emailContext = useEmail();

  useEffect(() => {
    fetchDispatches();
    const subscription = supabase
      .channel("dispatches")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dispatches" },
        handleDispatchChange
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    async function fetchUserDetails() {
      const response = await checkUser(emailContext?.email);
      setCustomerDetails(response);
    }
    fetchUserDetails();
    const filtered = dispatches.filter((dispatch) => {
      return true;
    });
    setFilteredDispatches(filtered);
  }, [searchQuery, dispatches]);

  const fetchDispatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("dispatches")
        .select(
          `
      *,
      order:orders (
        *,
        product:products(*)
      )
    `
        )
        .eq("driver_id", customer.user_id);

      if (error) throw error;
      setDispatches(data || []);
      console.log("Dispatch Data: ", JSON.stringify(data, null, 2)); // Use JSON.stringify to see the full structure
      setFilteredDispatches(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDispatchChange = (payload: any) => {
    fetchDispatches();
  };

  const handleViewDetails = (orderId: number) => {
    const dispatch = dispatches.find((d) => d.order_id === orderId);
    if (dispatch) {
      setSelectedDispatch(dispatch);
      setIsModalVisible(true);
    }
  };

  const handleUpdateStatus = async (
    orderId: number,
    newStatus: DispatchStatus
  ) => {
    try {
      const { error } = await supabase
        .from("dispatches")
        .update({ status: newStatus })
        .eq("order_id", orderId);

      if (error) throw error;

      setIsModalVisible(false);
      fetchDispatches();
      Alert.alert("Success", `Dispatch status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating dispatch status:", err);
      Alert.alert(
        "Error",
        "Failed to update dispatch status. Please try again."
      );
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
          onPress={fetchDispatches}
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const stats = [
    {
      iconBgColor: "bg-blue-600",
      Icon: <GalleryVertical color="white" size={19} />,
      Title: "Assignement",
      Description: "10 components",
    },
    {
      iconBgColor: "bg-orange-600",
      Icon: <ListTodo color="white" size={19} />,
      Title: "Pending",
      Description: "10 components",
    },
    {
      iconBgColor: "bg-red-600",
      Icon: <ListChecks color="white" size={19} />,
      Title: "Complete",
      Description: "10 components",
    },
    {
      iconBgColor: "bg-purple-600",
      Icon: <MessageCircle color="white" size={19} />,
      Title: "Redo",
      Description: "10 components",
    },
  ];
  return (
    <View className="flex-1">
      <View className="bg-white p-4 gap-6">
        <H3 className="text-black">Statistics</H3>
        <View className="flex-row flex-wrap gap-y-6 justify-between">
          {stats.map((stat) => (
            <StatsCard
              iconBgColor={stat.iconBgColor}
              Icon={stat.Icon}
              Title={stat.Title}
              Description={stat.Description}
            />
          ))}
        </View>
      </View>
      <View className="p-6">
        <View className="flex-row items-center rounded-lg py-2">
          <SearchIcon color={'white'} size={18} />
          <Input
            className="flex-1 text-base border-0"
            placeholder="Search for assignments"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <H3 className="text-xl mb-4">
          Assignments
        </H3>
        {filteredDispatches.map((dispatch) => (
          <DispatchCard
            key={dispatch.order_id}
            dispatch={dispatch}
            onViewDetails={handleViewDetails}
          />
        ))}
      </ScrollView>

      <DispatchDetailsModal
        visible={isModalVisible}
        dispatch={selectedDispatch}
        onClose={() => setIsModalVisible(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </View>
  );
};

export default DriversPage;
