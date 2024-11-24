import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
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
} from 'lucide-react-native';

const menuItems = [
  {
    id: 1,
    title: 'Personal information',
    icon: User,
  },
  {
    id: 2,
    title: 'Payments and payouts',
    icon: Wallet,
  },
  {
    id: 3,
    title: 'Translation',
    icon: Languages,
  },
  {
    id: 4,
    title: 'Notifications',
    icon: Bell,
  },
  {
    id: 5,
    title: 'Privacy and sharing',
    icon: Lock,
  },
];

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: '/placeholder.svg?height=100&width=100' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>John</Text>
          <TouchableOpacity>
            <Text style={styles.showProfile}>Show profile</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.promotionCard}>
          <View style={styles.promotionIcon}>
            <DollarSign size={24} color="#FF385C" />
          </View>
          <View style={styles.promotionContent}>
            <Text style={styles.promotionTitle}>
              Earn money from your extra space
            </Text>
            <Text style={styles.learnMore}>Learn more</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account settings</Text>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <item.icon size={24} color="#000" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <ChevronRight size={24} color="#000" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hosting</Text>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Home size={24} color="#000" />
              <Text style={styles.menuItemText}>List your space</Text>
            </View>
            <ChevronRight size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Image
          source={{ uri: '/placeholder.svg?height=40&width=40' }}
          style={styles.footerLogo}
        />
        <Text style={styles.footerText}>curated by</Text>
        <Image
          source={{ uri: '/placeholder.svg?height=80&width=80' }}
          style={styles.mobbinLogo}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
  },
  profileImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 16,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  showProfile: {
    fontSize: 16,
    textDecorationLine: 'underline',
    color: '#000',
  },
  promotionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    gap: 16,
  },
  promotionIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FFE1E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promotionContent: {
    flex: 1,
  },
  promotionTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  learnMore: {
    fontSize: 16,
    textDecorationLine: 'underline',
    color: '#000',
  },
  section: {
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    gap: 8,
  },
  footerLogo: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  footerText: {
    color: '#666',
  },
  mobbinLogo: {
    width: 80,
    height: 20,
    resizeMode: 'contain',
  },
});

