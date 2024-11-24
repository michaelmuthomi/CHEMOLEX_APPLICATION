import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Home, Search, ShoppingBag, User } from 'lucide-react-native';

import SignupScreen from './SignupScreen';
import LoginScreen from './LoginScreen';
import CartScreen from './CartScreen';
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import ProfileScreen from './ProfileScreen';
import { Foundation, MaterialCommunityIcons, Ionicons, FontAwesome6, FontAwesome5, Feather } from '@expo/vector-icons'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#f1f1f1",
          paddingBottom: 0,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#9ca3af",
        headerShown: false,
        tabBarLabelStyle: { display: "none" },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
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
      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
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
      <Tab.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="bag-remove-outline" size={28} color={color} />
          ),
          tabBarBadge: 6,
          tabBarBadgeStyle: { backgroundColor: "#6366f1" },
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}