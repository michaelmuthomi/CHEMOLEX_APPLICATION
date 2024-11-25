import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  User,
  Wallet,
  Languages,
  Bell,
  Lock,
  ChevronRight,
  Home,
  DollarSign,
  LogOut,
  Settings,
  ShoppingBag,
} from 'lucide-react-native';
import { H2, H3, H4, P } from '~/components/ui/typography';
import { Button } from '~/components/ui/button';

const menuItems = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Update your profile details and preferences',
    icon: User,
    screen: 'PersonalInfoScreen',
  },
  {
    id: 'orders',
    title: 'Orders & Returns',
    description: 'Track orders and manage returns',
    icon: ShoppingBag,
    screen: 'OrdersScreen',
  },
  {
    id: 'payments',
    title: 'Payments & Payouts',
    description: 'Manage payment methods and transactions',
    icon: Wallet,
    screen: 'PaymentsScreen',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Control your notification preferences',
    icon: Bell,
    screen: 'NotificationsScreen',
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    description: 'Manage your account security and privacy',
    icon: Lock,
    screen: 'PrivacyScreen',
  },
  {
    id: 'settings',
    title: 'App Settings',
    description: 'Language, currency, and other preferences',
    icon: Settings,
    screen: 'SettingsScreen',
  },
];

export default function ProfileScreen({ navigation }) {
  const handleMenuPress = (screen: string) => {
    // TODO: Implement actual navigation when screens are ready
    console.log(`Navigating to ${screen}`);
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logging out...');
  };

  return (
    <SafeAreaView className="flex-1 ">
      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="items-center justify-center py-8 bg-zinc-900">
          <View className="relative">
            <Image
              source={{ uri: 'https://i.pravatar.cc/150' }}
              className="w-24 h-24 rounded-full"
            />
            <TouchableOpacity 
              className="absolute bottom-0 right-0  p-2 rounded-full shadow-sm border border-zinc-200"
              onPress={() => handleMenuPress('EditProfileScreen')}
            >
              <User size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <H3 className="mt-4">John Doe</H3>
          <P className="text-zinc-500">john.doe@example.com</P>
        </View>

        {/* Menu Items */}
        <View className="p-4 space-y-4">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center p-4 bg-zinc-950 rounded-2xl"
              onPress={() => handleMenuPress(item.screen)}
            >
              <View className=" p-3 rounded-full">
                <item.icon size={20} color="#fff" />
              </View>
              <View className="flex-1 ml-4">
                <H4>{item.title}</H4>
                <P className="text-sm text-zinc-500">{item.description}</P>
              </View>
              <ChevronRight size={20} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View className="p-4 pt-8">
          <Button
            variant="outline"
            className="flex-row items-center justify-center space-x-2 p-4 gap-4"
            onPress={() => {
              navigation.navigate('LoginScreen');
            }}
          >
            <P className="uppercase">Log Out Now</P>
            {/* <LogOut size={20} color="#fff" /> */}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
