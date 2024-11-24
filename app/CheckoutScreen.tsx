import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Check, Gift } from 'lucide-react-native';

const paymentMethods = [
  {
    id: 'card',
    title: 'Card',
    logos: [
      '/placeholder.svg?height=30&width=50', // Visa
      '/placeholder.svg?height=30&width=50', // Mastercard
      '/placeholder.svg?height=30&width=50', // Amex
      '/placeholder.svg?height=30&width=50', // Discover
    ],
  },
  {
    id: 'paypal',
    title: 'Pay with PayPal',
    logo: '/placeholder.svg?height=40&width=100', // PayPal
  },
  {
    id: 'applepay',
    title: 'Pay with Apple Pay',
    logo: '/placeholder.svg?height=40&width=60', // Apple Pay
  },
  {
    id: 'klarna',
    title: '$50.00 product minimum applies',
    logo: '/placeholder.svg?height=40&width=80', // Klarna
  },
];

export default function CheckoutScreen({ navigation }) {
  const [selectedMethod, setSelectedMethod] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressCompleted} />
          <View style={styles.progressCurrent} />
        </View>
        <View style={styles.progressLabels}>
          <View style={styles.progressStep}>
            <View style={styles.checkCircle}>
              <Check size={16} color="#fff" />
            </View>
            <Text style={styles.progressLabelCompleted}>Shipping</Text>
          </View>
          <View style={styles.progressStep}>
            <View style={styles.currentCircle} />
            <Text style={styles.progressLabelCurrent}>Payment</Text>
          </View>
          <View style={styles.progressStep}>
            <View style={styles.futureCircle} />
            <Text style={styles.progressLabelFuture}>Review</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Choose a payment method</Text>
        <Text style={styles.subtitle}>
          You will not be charged until you review this order on the next page.
        </Text>

        <View style={styles.paymentMethods}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.paymentMethod}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radio,
                  selectedMethod === method.id && styles.radioSelected
                ]} />
              </View>
              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <View style={styles.methodLogos}>
                  {method.logos ? (
                    method.logos.map((logo, index) => (
                      <Image
                        key={index}
                        source={{ uri: logo }}
                        style={styles.cardLogo}
                      />
                    ))
                  ) : (
                    <Image
                      source={{ uri: method.logo }}
                      style={styles.methodLogo}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.giftSection}>
          <Text style={styles.giftTitle}>Gift cards & Etsy Credit</Text>
          <TouchableOpacity style={styles.giftButton}>
            <Gift size={24} color="#000" />
            <Text style={styles.giftButtonText}>
              Redeem a gift card or Etsy Credit
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.merchantInfo}>
          Merchant is Etsy, Inc. (USA) or Etsy Ireland UC (Ireland), depending on the currency in which the Seller
        </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  cancelButton: {
    fontSize: 16,
    color: '#000',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    padding: 24,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#f1f1f1',
    marginBottom: 16,
    flexDirection: 'row',
  },
  progressCompleted: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressCurrent: {
    flex: 2,
    backgroundColor: '#f1f1f1',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStep: {
    alignItems: 'center',
    gap: 8,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
  },
  futureCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f1f1f1',
  },
  progressLabelCompleted: {
    fontSize: 14,
    color: '#000',
  },
  progressLabelCurrent: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  progressLabelFuture: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  paymentMethods: {
    gap: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    gap: 16,
  },
  radioContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioSelected: {
    backgroundColor: '#000',
  },
  methodContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodTitle: {
    fontSize: 16,
  },
  methodLogos: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  cardLogo: {
    width: 40,
    height: 25,
    resizeMode: 'contain',
  },
  methodLogo: {
    height: 30,
    width: 60,
    resizeMode: 'contain',
  },
  giftSection: {
    marginTop: 32,
  },
  giftTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  giftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  giftButtonText: {
    fontSize: 16,
  },
  merchantInfo: {
    marginTop: 32,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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

