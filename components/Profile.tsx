import { User } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { H1, H2, H3, H5, P } from "~/components/ui/typography";
import { useEmail } from "~/app/EmailContext";
import { checkUser } from "~/lib/supabase";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import displayNotification from "~/lib/Notification";

export default function ProfileScreen() {
  const navigation = useNavigation()
  const [customer, setCustomerDetails] = useState([]);
  const emailContext = useEmail();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchUserDetails() {
      const response = await checkUser(emailContext?.email);
      setCustomerDetails(response);
    }
    fetchUserDetails();
  }, [emailContext]);

  const handleSavecustomer = () => {
    // TODO: Implement API call to save user info
    displayNotification("Profile updated successfully", 'success');
    setIsEditing(false);
  };
  return (
    <ScrollView className="bg-[#060606] flex-1 gap-10">
      <View className="py-8 px-6 bg-[#090909]">
        <View className="relative">
          <TouchableOpacity className="p-2 w-12 rounded-full shadow-sm border border-zinc-200 items-center">
            <User size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View>
          <H3 className="mt-4 text-white">
            {customer === "" ? (
              <View className="w-24 h-6 rounded-sm animate-pulse bg-zinc-800"></View>
            ) : (
              customer.full_name
            )}
          </H3>
          <P className="text-zinc-500">
            {customer === "" ? (
              <View className="w-52 h-6 rounded-sm animate-pulse bg-zinc-800"></View>
            ) : (
              customer.email
            )}
          </P>
        </View>
      </View>
      <View className="py-2">
        <ScrollView className="gap-6 px-6 py-4 bg-[#090909]">
          <View className="gap-4">
            <View className="flex-row">
              <View className="gap-2 w-1/2 pr-2">
                <H5>First Name</H5>
                <Input
                  placeholder="First Name"
                  value={
                    customer.full_name ? customer.full_name.split(" ")[0] : ""
                  }
                  onChangeText={(text) => {
                    const lastName = customer.full_name
                      .split(" ")
                      .slice(1)
                      .join(" ");
                    setCustomerDetails({
                      ...customer,
                      full_name: text + (lastName ? " " + lastName : ""),
                    });
                  }}
                  editable={isEditing}
                  className={
                    !isEditing
                      ? "bg-zinc-950 text-white"
                      : "!border-none !bg-transparent"
                  }
                />
              </View>

              <View className="gap-2 w-1/2">
                <H5>Last Name</H5>
                <Input
                  placeholder="Last Name"
                  value={
                    customer.full_name
                      ? customer.full_name.split(" ").slice(1).join(" ")
                      : ""
                  }
                  onChangeText={(text) => {
                    const firstName = customer.full_name.split(" ")[0];
                    setCustomerDetails({
                      ...customer,
                      full_name: firstName + (text ? " " + text : ""),
                    });
                  }}
                  editable={isEditing}
                  className={
                    !isEditing
                      ? "bg-zinc-950 text-white"
                      : "!border-none !bg-transparent"
                  }
                />
              </View>
            </View>

            <View className="gap-2">
              <H5>Email</H5>
              <Input
                placeholder="Email"
                value={customer.email}
                onChangeText={(text) =>
                  setCustomerDetails({ ...customer, email: text })
                }
                keyboardType="email-address"
                editable={isEditing}
                className={!isEditing ? "bg-zinc-950 text-white" : ""}
              />
            </View>

            <View className="gap-2">
              <H5>Phone Number</H5>
              <Input
                placeholder="Phone"
                value={customer.phone_number}
                onChangeText={(text) =>
                  setCustomerDetails({ ...customer, phone_number: text })
                }
                keyboardType="phone-pad"
                editable={isEditing}
                className={!isEditing ? "bg-zinc-950 text-white" : ""}
              />
            </View>

            <View className="gap-2">
              <H5>Address</H5>
              <Input
                placeholder="Address"
                value={customer.address === "" ? "N/A" : customer.address}
                onChangeText={(text) =>
                  setCustomerDetails({ ...customer, address: text })
                }
                editable={isEditing}
                className={!isEditing ? "bg-zinc-950 text-white" : ""}
              />
            </View>

            <View className="space-y-4 pt-4">
              {isEditing ? (
                <View className="flex-row w-full justify-between">
                  <Button
                    variant="outline"
                    onPress={handleSavecustomer}
                    size={'lg'}
                    className="w-2/3 rounded-full bg-white !py-4 !border-none"
                  >
                    <H5 className="!leading-none text-black ">Save Changes</H5>
                  </Button>
                  <Button
                    variant="outline"
                    onPress={() => setIsEditing(false)}
                    size={'lg'}
                    className="rounded-full bg-red-400 !py-4 !border-none"
                  >
                    <H5 className="!leading-0 text-black">Cancel</H5>
                  </Button>
                </View>
              ) : (
                <Button
                    variant="outline"
                    size={'lg'}
                  className="rounded-full bg-white !py-4 !border-none"
                  onPress={() => setIsEditing(true)}
                >
                  <H5 className="text-black leading-none">Edit Profile</H5>
                </Button>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity
        className="flex-row items-center p-4 mt-6 bg-red-200"
        onPress={() => navigation.navigate("LoginScreen")}
      >
        <H3 className="text-sm text-[#555]">Log out</H3>
        <Ionicons
          name="arrow-forward-sharp"
          size={15}
          color="#555"
          className="ml-auto"
        />
      </TouchableOpacity>
    </ScrollView>
  );
}
