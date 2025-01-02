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
      const response = await checkUser (emailContext?.email);
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
        .select("*")
        .eq("technician_id", technicianId); // Use technicianId to fetch repairs

      if (error) throw error;
      setRepairs(data || []);
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

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-blue-800 p-6">
        <Text className="text-3xl font-bold text-white mb-4">
          Technician Dashboard
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Your Assigned Repairs
        </Text>
        {repairs.map((repair) => (
          <RepairCard
            key={repair.id}
            repair={repair}
            onViewDetails={handleViewDetails}
          />
        ))}
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