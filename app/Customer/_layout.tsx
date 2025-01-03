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
import { useCart } from "~/lib/cart-context";

export default function CustomerTabs() {
  const { getCartQuantity } = useCart();
  const cartQuantity = getCartQuantity();
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
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="home-variant"
                  size={28}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons
                  name={color === "#fff" ? "search" : "search-outline"}
                  size={28}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="cart"
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons
                  name={cartQuantity > 0 ? "bag" : "bag-outline"}
                  size={28}
                  color={color}
                />
              ),
              tabBarBadge: cartQuantity || undefined,
              tabBarBadgeStyle: { backgroundColor: "#6366f1" },
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              tabBarIcon: ({ color }) => (
                <Feather name="user" size={28} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="product"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="checkout"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
