import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import {
  Foundation,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  FontAwesome6,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { H2, H3, H5, P } from "~/components/ui/typography";
import { View } from "react-native";
import { checkUser } from "~/lib/supabase";
import { useEffect, useState } from "react";
import { useEmail } from "~/app/EmailContext";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function TabsLayout() {
  const [customer, setCustomerDetails] = useState({});
  const emailContext = useEmail();

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await checkUser(emailContext?.email);
        setCustomerDetails(response);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
    fetchUserDetails();
  }, [emailContext?.email]);
  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <Tabs
          screenOptions={{
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: "#f1f1f1",
              paddingBottom: 0,
            },
            tabBarActiveTintColor: "#000",
            tabBarInactiveTintColor: "#555555",
            headerShown: false,
            tabBarLabelStyle: { display: "none" },
            tabBarHideOnKeyboard: true,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              headerTitle: () => (
                <View className="flex-row gap-4 items-center">
                  <Avatar alt="Customer's Avatar">
                    <AvatarFallback>
                      <P className="text-white">
                        {customer.name &&
                          customer.name
                            .split(" ")
                            .map((name: string) => name[0])
                            .join("")}
                      </P>
                    </AvatarFallback>
                  </Avatar>
                  <View>
                    <H2 className="text-xl border-b-0 leading-0">
                      Hi there,{"\n"}
                      {customer.name} 👋
                    </H2>
                  </View>
                </View>
              ),
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="home-variant"
                  size={32}
                  color={color}
                />
              ),
              headerShown: true,
              headerStyle: { backgroundColor: "#fff" },
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              headerTitle: () => <H3>Settings</H3>,
              tabBarIcon: ({ color }) => (
                <FontAwesome size={28} name="cog" color={color} />
              ),
              headerShown: true,
              headerStyle: { backgroundColor: "#fff" },
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              headerTitle: () => <H3>Profile</H3>,
              tabBarIcon: ({ color }) => (
                <Feather name="user" size={28} color={color} />
              ),
              headerShown: true,
              headerStyle: { backgroundColor: "#fff" },
            }}
          />
        </Tabs>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
