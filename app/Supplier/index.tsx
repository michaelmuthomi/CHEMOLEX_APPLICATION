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
import { WorkflowStatistics } from "~/components/WorkflowStatistics";
import { RepairItem } from "~/components/RepairItem";
import { RepairDetailsModal } from "~/components/RepairDetailsModal";
import { H3 } from "~/components/ui/typography";

type Repair = {
  id: number;
  productName: string;
  customerName: string;
  technicianName: string;
  status: "Pending Approval" | "In Progress" | "Completed";
  estimatedCompletion: string;
  description: string;
  repairNotes: string;
  partsUsed: string[];
};

const SupplierPage: React.FC = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
  }, []);

  const fetchRepairs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from("repairs").select("*");

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

  const handleApproveRepair = async (repairId: number) => {
    try {
      const { error } = await supabase
        .from("repairs")
        .update({ status: "Completed" })
        .eq("id", repairId);

      if (error) throw error;

      Alert.alert(
        "Success",
        "Repair has been approved and marked as completed."
      );
      setIsModalVisible(false);
      fetchRepairs();
    } catch (err) {
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const pendingApprovalRepairs = repairs.filter(
    (r) => r.status === "Pending Approval"
  );
  const inProgressRepairs = repairs.filter((r) => r.status === "In Progress");
  const completedToday = repairs.filter(
    (r) =>
      r.status === "Completed" &&
      new Date(r.estimatedCompletion).toDateString() ===
        new Date().toDateString()
  ).length;

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
    <View className="flex-1">
      <ScrollView className="flex-1 p-4">
        <WorkflowStatistics
          totalRepairs={repairs.length}
          pendingApproval={pendingApprovalRepairs.length}
          inProgress={inProgressRepairs.length}
          completedToday={completedToday}
        />

        <H3 className="text-xl text-white mt-6 mb-4">Pending Approval</H3>
        {pendingApprovalRepairs.map((repair) => (
          <RepairItem
            key={repair.id}
            repair={repair}
            onViewDetails={handleViewDetails}
          />
        ))}

        <H3 className="text-xl text-white mt-6 mb-4">In Progress</H3>
        {inProgressRepairs.map((repair) => (
          <RepairItem
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
        onApprove={handleApproveRepair}
      />
    </View>
  );
};

export default SupplierPage;
