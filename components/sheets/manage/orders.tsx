import { BottomSheetView } from "@gorhom/bottom-sheet";
import { H3, H5, P } from "~/components/ui/typography";
import { useEffect, useRef, useState } from "react";
import { H4 } from "~/components/ui/typography";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as React from "react";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import displayNotification from "~/lib/Notification";
import { formatPrice } from "~/lib/format-price";
import { formatDate } from "~/lib/format-date";
import { checkUser, fetchCustomerOrders } from "~/lib/supabase";
import { useEmail } from "~/app/EmailContext";

interface OrderItem {
  name: string;
  image_url: string;
  unit_price: number;
  quantity: number;
}

interface Order {
  order_id: string;
  created_at: string;
  payment_status: string;
  unit_price: number;
  products: OrderItem;
  tracking_number?: string;
  quantity: number;
}

interface customer {
  full_name: string;
  email: string;
  phone: string;
  address: string;
}

export function ManageOrders({
  sheetTrigger,
}: {
  sheetTrigger: React.ReactNode;
}) {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const inputRef = useRef<Textarea>(null);
  const [loading, setLoading] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customer, setCustomerDetails] = useState<customer>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const emailContext = useEmail();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchUserDetails() {
      if (emailContext?.email) {
        const response = await checkUser(emailContext?.email);
        setCustomerDetails(response);
      }
    }
    fetchUserDetails();
  }, [emailContext]);

  useEffect(() => {
    async function fetchOrders() {
      if (customer.user_id) {
        const response = await fetchCustomerOrders(customer.user_id);
        console.log("Orders Fetched", response);
        setOrders(response);
      }
    }
    fetchOrders();
  }, [customer]);

  const handleInitiateReturn = (orderId: string) => {
    // TODO: Implement return initiation logic
    displayNotification("Return request initiated", "success");
    setSelectedOrder(null);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "text-yellow-500";
      case "shipped":
        return "text-blue-500";
      case "delivered":
        return "text-green-500";
      case "returned":
        return "text-red-500";
      default:
        return "text-zinc-500";
    }
  };

  return (
    <>
      {React.cloneElement(sheetTrigger as React.ReactElement, {
        onPress: handlePresentModalPress,
      })}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: "#0e0e0e" }}
        handleIndicatorStyle={{ backgroundColor: "white" }}
      >
        <BottomSheetView className="p-6 gap-6">
          {/* Title and Subtitle */}
          <View className="items-center mb-8">
            <H3 className="text-2xl mb-2 text-center">
              Hey, We're here to help!
            </H3>
            <P className="text-gray-500 text-center">
              Please fill in the form and we will get {"\n"} back to you as soon
              as possible.
            </P>
          </View>
          <ScrollView className="flex-1">
            {selectedOrder ? (
              <View className="space-y-4">
                <View className="flex-row justify-between items-center">
                  <View>
                    <H4 className="text-white">Order #{selectedOrder.id}</H4>
                    <P className="text-zinc-500">
                      {formatDate(selectedOrder.date)}
                    </P>
                  </View>
                  <View>
                    <P
                      className={`uppercase ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </P>
                  </View>
                </View>

                {selectedOrder.trackingNumber && (
                  <View className="p-4 rounded-xl">
                    <P className="text-zinc-500">Tracking Number</P>
                    <P className="text-white">{selectedOrder.trackingNumber}</P>
                  </View>
                )}

                <View className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <View
                      key={item.id}
                      className="flex-row bg-zinc-950 p-4 rounded-xl"
                    >
                      <Image
                        source={{ uri: item.image }}
                        className="w-20 h-20 rounded-lg"
                      />
                      <View className="flex-1 ml-4">
                        <H4 className="text-white">{item.name}</H4>
                        <P className="text-zinc-500">
                          Quantity: {item.quantity}
                        </P>
                        <P className="text-white">${item.price.toFixed(2)}</P>
                      </View>
                    </View>
                  ))}
                </View>

                <View className="bg-zinc-950 p-4 rounded-xl">
                  <View className="flex-row justify-between">
                    <P className="text-zinc-500">Total</P>
                    <P className="text-white">
                      ${selectedOrder.total.toFixed(2)}
                    </P>
                  </View>
                </View>

                {selectedOrder.status === "delivered" && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onPress={() => handleInitiateReturn(selectedOrder.id)}
                  >
                    <P className="uppercase">Initiate Return</P>
                  </Button>
                )}
              </View>
            ) : (
              <View className="p-4 space-y-4">
                {orders.map((order) => (
                  <TouchableOpacity
                    key={order.order_id}
                    className="bg-zinc-950 p-4 rounded-xl"
                    onPress={() => setSelectedOrder(order)}
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <H4 className="text-white">Order #{order.order_id}</H4>
                        <P className="text-zinc-500">
                          {formatDate(order.created_at)}
                        </P>
                      </View>
                      <View>
                        <P
                          className={`uppercase ${getStatusColor(
                            order.payment_status
                          )}`}
                        >
                          {order.payment_status}
                        </P>
                      </View>
                    </View>
                    <View className="mt-4 flex-row items-center">
                      <Image
                        source={{
                          uri:
                            order.products?.image_url ||
                            "https://placeholder.com/150",
                        }}
                        className="w-16 h-16 rounded-lg mr-4"
                      />
                      <View>
                        <P className="text-white">{order.products?.name}</P>
                        <P className="text-zinc-500">
                          Quantity: {order.quantity}
                        </P>
                        <P className="text-white">
                          {formatPrice(order.unit_price)}
                        </P>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
