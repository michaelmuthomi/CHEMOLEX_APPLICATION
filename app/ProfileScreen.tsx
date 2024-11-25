import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
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
  X,
} from 'lucide-react-native';
import { H2, H3, H4, P } from '~/components/ui/typography';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { showMessage } from 'react-native-flash-message';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'returned';
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
}

const menuItems = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Update your profile details and preferences',
    icon: User,
    screen: 'personal',
  },
  {
    id: 'orders',
    title: 'Orders & Returns',
    description: 'Track orders and manage returns',
    icon: ShoppingBag,
    screen: 'orders',
  },
];

const mockOrders: Order[] = [
  {
    id: 'ORD001',
    date: '2024-01-15',
    status: 'delivered',
    total: 129.99,
    items: [
      {
        id: 'ITEM001',
        name: 'Wireless Earbuds',
        price: 79.99,
        quantity: 1,
        image: 'https://picsum.photos/200',
      },
      {
        id: 'ITEM002',
        name: 'Phone Case',
        price: 24.99,
        quantity: 2,
        image: 'https://picsum.photos/200',
      },
    ],
    trackingNumber: '1Z999AA1234567890',
  },
  {
    id: 'ORD002',
    date: '2024-01-20',
    status: 'shipped',
    total: 199.99,
    items: [
      {
        id: 'ITEM003',
        name: 'Smart Watch',
        price: 199.99,
        quantity: 1,
        image: 'https://picsum.photos/200',
      },
    ],
    trackingNumber: '1Z999AA1234567891',
  },
  {
    id: 'ORD003',
    date: '2024-01-25',
    status: 'processing',
    total: 49.99,
    items: [
      {
        id: 'ITEM004',
        name: 'Power Bank',
        price: 49.99,
        quantity: 1,
        image: 'https://picsum.photos/200',
      },
    ],
  },
];

export default function ProfileScreen({ navigation }) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    address: '123 Main St, City, State 12345',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleMenuPress = (screen: string) => {
    setActiveModal(screen);
  };

  const handleSavePersonalInfo = () => {
    // TODO: Implement API call to save user info
    showMessage({
      message: 'Profile updated successfully',
      type: 'success',
      style: { paddingTop: 40 },
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'text-yellow-500';
      case 'shipped':
        return 'text-blue-500';
      case 'delivered':
        return 'text-green-500';
      case 'returned':
        return 'text-red-500';
      default:
        return 'text-zinc-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleInitiateReturn = (orderId: string) => {
    // TODO: Implement return initiation logic
    showMessage({
      message: 'Return request initiated',
      description: 'Our team will contact you shortly with return instructions.',
      type: 'success',
      style: { paddingTop: 40 },
    });
    setSelectedOrder(null);
  };

  const renderPersonalInfoModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={activeModal === 'personal'}
      onRequestClose={() => setActiveModal(null)}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-zinc-900 rounded-t-3xl">
          <SafeAreaView className="flex-1">
            <View className="flex-row justify-between items-center p-4 border-b border-zinc-800">
              <H3 className="text-white">Personal Information</H3>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              <View className="space-y-4">
                <Input
                  placeholder="First Name"
                  value={personalInfo.firstName}
                  onChangeText={(text) => setPersonalInfo({ ...personalInfo, firstName: text })}
                  editable={isEditing}
                  className={!isEditing ? 'bg-zinc-950 text-white' : ''}
                />

                <Input
                  placeholder="Last Name"
                  value={personalInfo.lastName}
                  onChangeText={(text) => setPersonalInfo({ ...personalInfo, lastName: text })}
                  editable={isEditing}
                  className={!isEditing ? 'bg-zinc-950 text-white' : ''}
                />

                <Input
                  placeholder="Email"
                  value={personalInfo.email}
                  onChangeText={(text) => setPersonalInfo({ ...personalInfo, email: text })}
                  keyboardType="email-address"
                  editable={isEditing}
                  className={!isEditing ? 'bg-zinc-950 text-white' : ''}
                />

                <Input
                  placeholder="Phone"
                  value={personalInfo.phone}
                  onChangeText={(text) => setPersonalInfo({ ...personalInfo, phone: text })}
                  keyboardType="phone-pad"
                  editable={isEditing}
                  className={!isEditing ? 'bg-zinc-950 text-white' : ''}
                />

                <Input
                  placeholder="Address"
                  value={personalInfo.address}
                  onChangeText={(text) => setPersonalInfo({ ...personalInfo, address: text })}
                  editable={isEditing}
                  className={!isEditing ? 'bg-zinc-950 text-white' : ''}
                />

                <View className="space-y-4 pt-4">
                  {isEditing ? (
                    <View className="space-y-2">
                      <Button
                        variant="default"
                        onPress={handleSavePersonalInfo}
                        className="bg-zinc-950"
                      >
                        <P className="text-white uppercase">Save Changes</P>
                      </Button>
                      <Button
                        variant="outline"
                        onPress={() => setIsEditing(false)}
                      >
                        <P className="uppercase">Cancel</P>
                      </Button>
                    </View>
                  ) : (
                    <Button
                      variant="outline"
                      onPress={() => setIsEditing(true)}
                    >
                      <P className="uppercase">Edit Information</P>
                    </Button>
                  )}
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );

  const renderOrdersModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={activeModal === 'orders'}
      onRequestClose={() => setActiveModal(null)}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-zinc-900 rounded-t-3xl">
          <SafeAreaView className="flex-1">
            <View className="flex-row justify-between items-center p-4 border-b border-zinc-800">
              <H3 className="text-white">Orders & Returns</H3>
              <TouchableOpacity onPress={() => {
                setActiveModal(null);
                setSelectedOrder(null);
              }}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
              {selectedOrder ? (
                <View className="p-4 space-y-4">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <H4 className="text-white">Order #{selectedOrder.id}</H4>
                      <P className="text-zinc-500">{formatDate(selectedOrder.date)}</P>
                    </View>
                    <View>
                      <P className={`uppercase ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </P>
                    </View>
                  </View>

                  {selectedOrder.trackingNumber && (
                    <View className="bg-zinc-950 p-4 rounded-xl">
                      <P className="text-zinc-500">Tracking Number</P>
                      <P className="text-white">{selectedOrder.trackingNumber}</P>
                    </View>
                  )}

                  <View className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <View key={item.id} className="flex-row bg-zinc-950 p-4 rounded-xl">
                        <Image
                          source={{ uri: item.image }}
                          className="w-20 h-20 rounded-lg"
                        />
                        <View className="flex-1 ml-4">
                          <H4 className="text-white">{item.name}</H4>
                          <P className="text-zinc-500">Quantity: {item.quantity}</P>
                          <P className="text-white">${item.price.toFixed(2)}</P>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View className="bg-zinc-950 p-4 rounded-xl">
                    <View className="flex-row justify-between">
                      <P className="text-zinc-500">Total</P>
                      <P className="text-white">${selectedOrder.total.toFixed(2)}</P>
                    </View>
                  </View>

                  {selectedOrder.status === 'delivered' && (
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
                      key={order.id}
                      className="bg-zinc-950 p-4 rounded-xl"
                      onPress={() => setSelectedOrder(order)}
                    >
                      <View className="flex-row justify-between items-center">
                        <View>
                          <H4 className="text-white">Order #{order.id}</H4>
                          <P className="text-zinc-500">{formatDate(order.date)}</P>
                        </View>
                        <View>
                          <P className={`uppercase ${getStatusColor(order.status)}`}>
                            {order.status}
                          </P>
                        </View>
                      </View>
                      <View className="mt-4">
                        <P className="text-zinc-500">{order.items.length} items</P>
                        <P className="text-white">${order.total.toFixed(2)}</P>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="items-center justify-center py-8 bg-zinc-900">
          <View className="relative">
            <Image
              source={{ uri: 'https://i.pravatar.cc/150' }}
              className="w-24 h-24 rounded-full"
            />
            <TouchableOpacity 
              className="absolute bottom-0 right-0 p-2 rounded-full shadow-sm border border-zinc-200"
              onPress={() => handleMenuPress('personal')}
            >
              <User size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <H3 className="mt-4 text-white">{personalInfo.firstName} {personalInfo.lastName}</H3>
          <P className="text-zinc-500">{personalInfo.email}</P>
        </View>

        {/* Menu Items */}
        <View className="p-4 space-y-4">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center p-4 bg-zinc-950 rounded-2xl"
              onPress={() => handleMenuPress(item.screen)}
            >
              <View className="p-3 rounded-full">
                <item.icon size={20} color="#fff" />
              </View>
              <View className="flex-1 ml-4">
                <H4 className="text-white">{item.title}</H4>
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
          </Button>
        </View>
      </ScrollView>

      {/* Modals */}
      {renderPersonalInfoModal()}
      {renderOrdersModal()}
    </SafeAreaView>
  );
}
