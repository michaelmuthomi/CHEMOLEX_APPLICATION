import React from "react";
import { View, Text, ScrollView } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { H3 } from "~/components/ui/typography";

const InsightsPage = () => {
  // Placeholder data for charts
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      },
    ],
  };

  const expenseData = [
    {
      name: "Salaries",
      population: 50,
      color: "#FF6384",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Marketing",
      population: 20,
      color: "#36A2EB",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Operations",
      population: 15,
      color: "#FFCE56",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Other",
      population: 15,
      color: "#4BC0C0",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-zinc-950">
      <View className="bg-white mb-4 p-4 shadow">
        <H3 className="text-xl mb-3 text-gray-800">Revenue Trend</H3>
        <LineChart
          data={revenueData}
          width={320}
          height={220}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 2,
              padding: 4,
            },
            propsForLabels: {
              fontFamily: "Inter_600SemiBold",
              fontSize: 12,
              fill: "white",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 4,
          }}
        />
      </View>

      <View className="bg-white mb-4 p-4 shadow">
        <H3 className="text-xl mb-3 text-gray-800">Expense Breakdown</H3>
        <PieChart
          data={expenseData}
          width={300}
          height={220}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForHorizontalLabels: {
              fontFamily: "Inter_400Regular", // Set font family to Inter
              fontSize: 14, // Set desired font size
              fill: "white", // Set text color
            },
            propsForLabels: {
              fontFamily: "Inter_400Regular", // Apply Inter font to labels of the chart
              fontSize: 14, // Set desired font size
              fill: "white", // Set text color
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>

      <View className="bg-white mb-4 p-4 shadow">
        <H3 className="text-xl mb-3 text-gray-800">
          Key Performance Indicators
        </H3>
        <KPIItem title="Gross Profit Margin" value="32%" trend="up" />
        <KPIItem title="Net Profit Margin" value="18%" trend="up" />
        <KPIItem title="Operating Expense Ratio" value="25%" trend="down" />
        <KPIItem title="Current Ratio" value="1.5" trend="neutral" />
      </View>
    </ScrollView>
  );
};

const KPIItem = ({
  title,
  value,
  trend,
}: {
  title: string;
  value: string;
  trend: "up" | "down" | "neutral";
}) => (
  <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
    <H3 className="text-sm text-gray-800">{title}</H3>
    <View className="flex-row items-center">
      <Text className="text-sm text-gray-800 mr-2">{value}</Text>
      <Text
        className={`text-sm ${
          trend === "up"
            ? "text-green-500"
            : trend === "down"
            ? "text-red-500"
            : "text-gray-500"
        }`}
      >
        {trend === "up" ? "▲" : trend === "down" ? "▼" : "■"}
      </Text>
    </View>
  </View>
);

export default InsightsPage;
