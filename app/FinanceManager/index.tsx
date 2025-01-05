import { ArrowDown, ArrowUp } from "lucide-react-native";
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import StatsCard from "~/components/StatsCard";
import { H1, H3, H5, H6, P } from "~/components/ui/typography";

type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: string;
  verified: boolean;
};

const FinancialStatusPage = () => {
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>(
    [
      {
        id: 1,
        date: "2023-06-16",
        description: "Client Invoice #1001",
        amount: "$10,000",
        verified: false,
      },
      {
        id: 2,
        date: "2023-06-17",
        description: "Supplier Payment #2001",
        amount: "-$5,000",
        verified: false,
      },
      {
        id: 3,
        date: "2023-06-18",
        description: "Client Invoice #1002",
        amount: "$7,500",
        verified: false,
      },
    ]
  );

  const verifyTransaction = (id: number) => {
    setPendingTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, verified: true } : transaction
      )
    );
  };

  const stats = [
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

        <View className="py-6 px-4">
          <View className="flex-row justify-between items-center">
            <H3 className="text-black">Recent Transactions</H3>
          </View>
          <View className="flex-1 p-4">
            <View className="gap-4">
              {pendingTransactions.map((transaction) => (
                <PendingTransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onVerify={() => verifyTransaction(transaction.id)}
                />
              ))}
            </View>
          </View>
        </View>

        <View className="bg-white mb-4 p-4 shadow">
          <H3 className="text-xl mb-3 text-black">Financial Trends</H3>
          <View className="h-48 bg-gray-100 rounded-lg items-center justify-center">
            <P className="text-gray-500">Chart Placeholder</P>
          </View>
        </View>
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
