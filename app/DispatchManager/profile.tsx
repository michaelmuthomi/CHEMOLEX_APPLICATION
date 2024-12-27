import { User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { H1, H3, P } from "~/components/ui/typography";
import { useEmail } from "../EmailContext";
import { checkUser } from "~/lib/supabase";

export default function Tab() {
  const [customer, setCustomerDetails] = useState([]);
  const emailContext = useEmail();
  useEffect(() => {
    async function fetchUserDetails() {
      const response = await checkUser(emailContext?.email);
      setCustomerDetails(response);
    }
    fetchUserDetails();
  }, [emailContext]);
  return (
    <View className=" bg-[#060606] flex-1 pt-20 px-6 gap-10">
      <View className="flex justify-center">
        <H1
          className="capitalize color-white"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          My Account
        </H1>
      </View>
      <View className=" py-8">
        <View className="relative">
          <TouchableOpacity className="p-2 w-4 rounded-full shadow-sm border border-zinc-200">
            <User size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <H3 className="mt-4 text-white">
          {customer === "" ? (
            <View className="animate-pulse w-10 h-10 bg-slate-900" />
          ) : (
            customer.full_name
          )}
        </H3>
        <P className="text-zinc-500">{customer.email}</P>
      </View>
    </View>
  );
}
