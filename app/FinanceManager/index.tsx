import { ArrowDown, ArrowUp, CreditCard } from "lucide-react-native";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { H1, H3, H5, H6, P } from "~/components/ui/typography";
import React, { useState, useEffect } from "react";
import { checkUser, fetchAllFinancialRecords, supabase } from "~/lib/supabase";
import { DispatchCard } from "~/components/DispatchCard";
import { DispatchDetailsModal } from "~/components/DispatchDetailsModal";
import {
  GalleryVertical,
  ListChecks,
  ListTodo,
  MessageCircle,
  Search,
  SearchIcon,
} from "lucide-react-native";
import { useEmail } from "../EmailContext";
import StatsCard from "~/components/StatsCard";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { DispatchDetails } from "~/components/sheets/dispatchDetails";
import { formatBalance } from "~/lib/formatBalance";

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
  status: string;
  delivery_address: string;
  tracking_number: string;
  created_at: string;
  driver_id: number;
  order: Order;
  order_details: {
    product: Product;
  };
};
type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: string;
  verified: boolean;
};

const FinancialStatusPage = () => {
  const DISPATCHES_PER_PAGE = 6;

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
  const emailContext: any = useEmail();
  const [currentPage, setCurrentPage] = useState(1);
  const [financeRecords, setFinanceRecords] = useState([]);

  const stats = [
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
      Description: "$1,234,567",
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
  ];

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
    async function fetchFinanceRecords() {
      const response = await fetchAllFinancialRecords();
      setFinanceRecords(response);
    }
    fetchFinanceRecords();

    const filtered = dispatches.filter((dispatch) => {
      return true;
    });
    setFilteredDispatches(filtered);
  }, [searchQuery, dispatches]);

  const fetchDispatches = async () => {
    setIsLoading(true);
    setError(null);
    const user = await checkUser(emailContext?.email);
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
      .eq("driver_id", user.user_id);

    if (error) throw error;
    setDispatches(data || []);
    console.log("Dispatch Data: ", JSON.stringify(data, null, 2)); // Use JSON.stringify to see the full structure
    setFilteredDispatches(data || []);
    try {
    } catch (err) {
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

  const paginatedDispatches = filteredDispatches.slice(
    (currentPage - 1) * DISPATCHES_PER_PAGE,
    currentPage * DISPATCHES_PER_PAGE
  );

  const totalPages = Math.ceil(filteredDispatches.length / DISPATCHES_PER_PAGE);

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
  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        <View className="bg-white p-4 gap-6">
          <H3 className="text-black">Financial Summary</H3>
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
        <ScrollView className="flex-1 p-4">
          <H3 className="text-xl mb-4">Assignments</H3>
          {paginatedDispatches.map((dispatch) => (
            <DispatchCard
              key={dispatch.order_id}
              dispatch={dispatch}
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
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const MetricCard = ({
  title,
  value,
  trend,
}: {
  title: string;
  value: string;
  trend: "up" | "down";
}) => (
  <View className="rounded-lg flex-1 ">
    <P className="text-sm text-gray-500">{title}</P>
    <H5 className="text-lg mt-1">{value}</H5>
    {trend === "up" ? (
      // <View className="bg-green-500 p-2 w-8 rounded-full">
      <ArrowUp size={14} color={"green"} />
    ) : (
      // </View>
      // <View className="bg-red-200 p-2 w-8 rounded-full">
      <ArrowDown size={14} color={"red"} />
      // </View>
    )}
  </View>
);

const TransactionItem = ({
  date,
  description,
  amount,
}: {
  date: string;
  description: string;
  amount: string;
}) => (
  <View className="flex-row justify-between py-2 border-b border-gray-200">
    <P className="text-sm text-gray-500 flex-1">{date}</P>
    <P className="text-sm flex-2">{description}</P>
    <P
      className={`text-sm flex-1 text-right ${
        parseFloat(amount) >= 0 ? "text-green-500" : "text-red-500"
      }`}
    >
      {amount}
    </P>
  </View>
);

const PendingTransactionItem = ({
  transaction,
  onVerify,
}: {
  transaction: Transaction;
  onVerify: () => void;
}) => (
  <TouchableOpacity className="bg-white rounded-lg shadow-sm p-4 mb-4">
    <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
      <View className="flex-1">
        <H6 className="text-sm text-gray-500">{transaction.date}</H6>
        <H5 className="text-sm mt-1 text-black">{transaction.description}</H5>
        <H5
          className={`text-sm mt-1 ${
            parseFloat(transaction.amount) >= 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {transaction.amount}
        </H5>
      </View>
      <TouchableOpacity
        className={`px-3 py-2 rounded-lg ${
          transaction.verified ? "bg-green-500" : "bg-blue-500"
        }`}
        onPress={onVerify}
        disabled={transaction.verified}
      >
        <H5 className="text-sm text-black">
          {transaction.verified ? "Verified" : "Verify"}
        </H5>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default FinancialStatusPage;
