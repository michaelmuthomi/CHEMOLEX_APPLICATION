import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import {
  ArrowLeft,
  BedDoubleIcon,
  Check,
  CircleDollarSign,
  HandCoins,
  Truck,
  Clock,
  GalleryVerticalEnd,
  ListTodo,
  ListChecks,
} from "lucide-react-native";
import { fetchOrders, fetchDrivers, checkUser } from "~/lib/supabase";
import { useEffect } from "react";
import { H1, H2, H3, H4, H5, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { useEmail } from "~/app/EmailContext";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import StatsCard from "~/components/StatsCard";
import { formatDate } from "~/lib/format-date";
import { formatTime } from "~/lib/format-time";

const drivers = ["Driver A", "Driver B", "Driver C"];

export default function Tab({ navigation }: { navigation: any }) {
  const emailContext = useEmail();
  const [orders, setOrders] = useState([]);
  const [sortBy, setSortBy] = useState("all-orders");
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [customer, setCustomerDetails] = useState([]);

  useEffect(() => {
    async function fetchCustomerOrders() {
      const response = await fetchOrders();
      // console.log("Orders Fetched", response);
      setOrders(response);
    }
    async function fetchAvailableDrivers() {
      const response = await fetchDrivers();
      console.log("Available Drivers", response);
      setAvailableDrivers(response);
    }
    async function fetchUserDetails() {
      const response = await checkUser(emailContext?.email);
      setCustomerDetails(response);
    }
    fetchUserDetails();
    fetchCustomerOrders();
    fetchAvailableDrivers();
  }, []);

  const stats = [
    {
      iconBgColor: "bg-blue-600",
      Icon: <Truck color="white" size={19} />,
      Title: "Total Orders",
      Description: `${orders.length} orders`,
    },
    {
      iconBgColor: "bg-orange-600",
      Icon: <HandCoins color="white" size={19} />,
      Title: "Available Drivers",
      Description: `${availableDrivers.length} drivers`,
    },
    {
      iconBgColor: "bg-green-600",
      Icon: <CircleDollarSign color="white" size={19} />,
      Title: "Dispatched Drivers",
      Description: `${availableDrivers.length} drivers`,
    },
  ];

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
              {["all-orders", "dispatched", "pending", "assigned"].map(
                (sort) => (
                  <TouchableOpacity
                    key={sort}
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
                    ) : sort === "dispatched" ? (
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
                )
              )}
            </ScrollView>
          </View>
        </View>

        <View className="flex-1 p-4">
          <View className="gap-4">
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
              renderItem={({ item }) => (
                <View className="bg-white rounded-lg shadow-sm p-4">
                  <View className="w-full relative overflow-clip">
                    {/* Status Badge */}
                    <View className="flex items-start absolute right-[-14px] top-[-14px]">
                      <View
                        className={`p-2 px-4 rounded-bl-lg rounded-tr-lg flex-row items-center w-auto ${
                          item.dispatch_status === "pending"
                            ? "bg-orange-300"
                            : "bg-green-300"
                        }`}
                      >
                        <Clock
                          color={
                            item.dispatch_status === "pending"
                              ? "#9a3412"
                              : "#166534"
                          }
                          size={14}
                        />
                        <H5
                          className={`${
                            item.dispatch_status === "pending"
                              ? "text-orange-900"
                              : "text-green-900"
                          } ml-2 text-base capitalize`}
                        >
                          {item.dispatch_status}
                        </H5>
                      </View>
                    </View>

                    {/* Order Details */}
                    <View className="mb-6">
                      <H3 className="text-lg text-gray-800 mb-2">
                        {item.products.name}
                      </H3>
                      <H4
                        className="text-gray-600 text-base w-3/4"
                        numberOfLines={3}
                      >
                        {item.products.description}
                      </H4>
                    </View>

                    {/* Action Buttons */}
                    {item.dispatch_status === "dispatched" ? (
                      <View className="bg-gray-100 py-2 px-4 rounded-lg mt-4">
                        <Text className="text-gray-700">
                          Assigned to: {item.assignedTo}
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row w-full gap-6 justify-between">
                        <Button
                          className="rounded-full border-black bg-transparent px-0"
                          size={"lg"}
                          variant="default"
                          disabled
                        >
                          <H5 className="text-black text-left">
                            {formatDate(item.created_at)} &#8226;
                            {formatTime(item.created_at)}
                          </H5>
                        </Button>
                        <Button
                          // onPress={() => onAssign(order.id)}
                          className="rounded-full flex-1 bg-green-800"
                          size={"lg"}
                          variant="default"
                        >
                          <H5 className=" text-white">{"Assign"}</H5>
                        </Button>
                      </View>
                    )}
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}