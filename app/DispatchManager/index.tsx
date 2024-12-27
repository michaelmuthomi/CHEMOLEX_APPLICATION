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
} from "lucide-react-native";
import { fetchOrders, fetchDrivers, checkUser } from "~/lib/supabase";
import { useEffect } from "react";
import { H1, H2, H3, H4, H5, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { useEmail } from "~/app/EmailContext";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

const drivers = ["Driver A", "Driver B", "Driver C"];

export default function Tab({
  navigation,
}: {
  navigation: any;
}) {
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

  const cardContents = [
    {
      id: 1,
      title: "Total Orders",
      content: orders.length,
    },
    {
      id: 2,
      title: "Available Drivers",
      content: availableDrivers.length,
    },
    {
      id: 3,
      title: "Dispatched Drivers",
      content: availableDrivers.length,
    },
  ];

  return (
    <SafeAreaView>
      <View className="px-6 pt-14 pb-2 bg-[#111]">
        <H2 className="text-2xl border-b-0 leading-0">
          Hi there,{" "}
          {customer === "" ? (
            <View className="animate-pulse w-10 h-10 bg-slate-900" />
          ) : (
            customer.username
          )}{" "}
          👋
        </H2>
        <H5 className="text-zinc-400 text-sm border-b-0 capitalize">
          {customer.role ? (
      customer.role.replace("_", " ")
    ) : (
      <View className="animate-pulse w-36 h-4 rounded-sm bg-zinc-800" />
    )}
        </H5>
      </View>

      <ScrollView className="p-4 divide-y-4 flex gap-4">
        <H1 className="text-2xl">Overview</H1>
        <ScrollView horizontal={true}>
          <View className="flex-row py-4 gap-2">
            {cardContents.map((card) => (
              <Card key={card.id} className="col-span-1 ">
                <CardHeader className="pb-2">
                  <P className="text-sm">
                    {card.title ? (
                      card.title
                    ) : (
                      <View className="animate-pulse w-full h-20" />
                    )}
                  </P>
                </CardHeader>
                <CardContent>
                  <H1 className="text-4xl">{card.content}</H1>
                </CardContent>
              </Card>
            ))}
          </View>
        </ScrollView>
        {/* <H1 className='text-xl'>Hi there, {customer.username} 👋</H1> */}
        <ScrollView horizontal={true}>
          <View className="flex-row py-4 gap-2">
            {["all-orders", "dispatched", "pending", "assigned"].map((sort) => (
              <Button
                key={sort}
                onPress={() => setSortBy(sort)}
                className={`${sortBy === sort ? "bg-white" : " bg-zinc-900"}`}
              >
                <P
                  className={`capitalize ${
                    sortBy === sort ? "bg-white text-black" : " bg-zinc-900"
                  }`}
                >
                  {sort.replace("-", " ")}
                </P>
              </Button>
            ))}
          </View>
        </ScrollView>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          renderItem={({ item }) => (
            <View
              className="flex rounded-lg border-[1px] border-zinc-800"
              key={item.id}
            >
              <Image
                source={{
                  uri: item.products.image_url,
                }}
                className="w-full h-24 rounded-t-lg"
              />
              <View className="p-2">
                <H3 className="text-xl">{item.products.name}</H3>
                <P className="capitalize">{item.payment_status}</P>
              </View>
              <View
                style={{
                  borderBottomColor: "#bac4c8",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  padding: 2,
                }}
              />
              {item.assignedTo && <P>Assigned to: {item.assignedTo}</P>}
              {item.payment_status === "completed" && (
                <View className="p-2">
                  <H4 className="text-base">Assign to Driver</H4>
                  <ScrollView horizontal={true}>
                    <View className="flex-row py-4 gap-2">
                      {availableDrivers.map((driver) => (
                        <Button
                          key={driver.id}
                          variant={"outline"}
                          className="flex-row"
                          onPress={() => assignDriver(item.id, driver)}
                        >
                          <Truck size={16} color="#fff" />
                          <P>{driver.full_name}</P>
                        </Button>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    color: "#4A5568",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 4,
  },
  assignedTo: {
    fontSize: 14,
    color: "#48BB78",
    fontWeight: "500",
  },
  assignSection: {
    marginTop: 12,
  },
  assignTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  driverButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4299E1",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  driverButtonText: {
    color: "#fff",
    marginLeft: 8,
  },
});
