import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { checkUser , supabase } from "~/lib/supabase";
import { RepairCard } from "~/components/RepairCard";
import { RepairDetailsModal } from "~/components/RepairManagerModal";
import { useEmail } from "../EmailContext";
import { H2, H3, H4, H5, P } from "~/components/ui/typography";
import { GalleryVertical, ListChecks, ListTodo, MessageCircle } from "lucide-react-native";
import StatsCard from "~/components/StatsCard";

type RepairStatus = "Assigned" | "In Progress" | "Completed";

type Repair = {
  id: number;
  deviceName: string;
  deviceType: string;
  issueDescription: string;
  status: RepairStatus;
  dueDate: string;
  requiredProducts: { name: string; quantity: number }[];
  repairNotes: string;
};

const TechnicianPage: React.FC = () => {
  const emailContext = useEmail();
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [technicianId, setTechnicianId] = useState<string | null>(null);

  useEffect(() => {
    fetchRepairs();
    const subscription = supabase
      .channel("repairs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "repairs" },
        handleRepairChange
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [technicianId]); // Add technicianId as a dependency

  useEffect(() => {
    async function fetchUserDetails() {
      if (!emailContext || !emailContext.email) {
        console.error("Email context is not available");
        return;
      }

      const response = await checkUser (emailContext.email);
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

  const fetchRepairs = async () => {
    if (!technicianId) return; // Don't fetch repairs if technicianId is not set

    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("repairs")
        .select("*, services:service_id(name, description), products:product_id(name)")
        .eq("technician_id", technicianId); // Use technicianId to fetch repairs

      if (error) throw error;
      setRepairs(data || []);
      console.log("repairs", repairs)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepairChange = (payload: any) => {
    fetchRepairs();
  };

  const handleViewDetails = (repairId: number) => {
    const repair = repairs.find((r) => r.id === repairId);
    if (repair) {
      setSelectedRepair(repair);
      setIsModalVisible(true);
    }
  };

  const handleUpdateStatus = async (
    repairId: number,
    newStatus: RepairStatus
  ) => {
    try {
      const { error } = await supabase
        .from("repairs")
        .update({ status: newStatus })
        .eq("id", repairId);

      if (error) throw error;

      Alert.alert("Success", `Repair status updated to ${newStatus}`);
      setIsModalVisible(false);
      fetchRepairs();
    } catch (err) {
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "An unknown error occurred"
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
          onPress={fetchRepairs}
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const stats = [
    {
      iconBgColor: 'bg-blue-600',
      Icon: <GalleryVertical color="white" size={19} />,
      Title: 'Assignement',
      Description: '10 components'
    },
    {
      iconBgColor: 'bg-orange-600',
      Icon: <ListTodo color="white" size={19} />,
      Title: 'Pending',
      Description: '10 components'
    },
    {
      iconBgColor: 'bg-red-600',
      Icon: <ListChecks color="white" size={19} />,
      Title: 'Complete',
      Description: '10 components'
    },
    {
      iconBgColor: 'bg-purple-600',
      Icon: <MessageCircle color="white" size={19} />,
      Title: 'Redo',
      Description: '10 components'
    },
  ]

  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        <View className="bg-white p-4 gap-6">
          <H3 className="text-black">Statistics</H3>
          <View className="flex-row flex-wrap gap-y-6 justify-between">
            {stats.map(stat => (
              <StatsCard iconBgColor={stat.iconBgColor} Icon={stat.Icon} Title={stat.Title} Description={stat.Description} />
            ))}
          </View>
        </View>
        <View className="p-4">
          <H2 className="text-xl mb-4">Assigned Repairs</H2>
          {repairs.map((repair) => (
            <RepairCard
              key={repair.id}
              repair={repair}
              onViewDetails={handleViewDetails}
            />
          ))}
        </View>
      </ScrollView>

      <RepairDetailsModal
        visible={isModalVisible}
        repair={selectedRepair}
        onClose={() => setIsModalVisible(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </View>
  );
};

export default TechnicianPage;