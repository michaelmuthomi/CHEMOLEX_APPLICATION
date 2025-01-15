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
import { H2, H3, H5 } from "~/components/ui/typography";
import { View } from "react-native";
import { checkUser } from "~/lib/supabase";
import { useEffect, useState } from "react";
import { useEmail } from "~/app/EmailContext";

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
            tabBarActiveTintColor: "#fff",
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
                <View>
                  <H2 className="text-2xl border-b-0 leading-0">
                    Hi there,
                    {customer.username ? (
                      customer.username
                    ) : (
                      <View className="animate-pulse w-20 h-4 rounded-sm bg-zinc-800" />
                    )}
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
              ),
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="home-variant"
                  size={32}
                  color={color}
                />
              ),
              headerShown: true,
              headerStyle: { backgroundColor: "#111" },
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
              headerStyle: { backgroundColor: "#111" },
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
              headerStyle: { backgroundColor: "#111" },
            }}
          />
        </Tabs>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
