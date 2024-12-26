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

export default function DispatchManagerTabs() {
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
              title: "Home",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="home-variant"
                  size={32}
                  color={color}
                />
              ),
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="insight"
            options={{
              title: "Insight",
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="insights" size={28} color={color} />
              ),
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: "Settings",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={28} name="cog" color={color} />
              ),
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color }) => (
                <Feather name="user" size={28} color={color} />
              ),
              headerShown: false,
            }}
          />
        </Tabs>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
