import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useCart } from '~/lib/cart-context';
import { formatPrice } from '~/lib/format-price';
import { H3, H4, P } from '~/components/ui/typography';
import { Button } from '~/components/ui/button';
import { ChevronLeft } from 'lucide-react-native';
import { Input } from '~/components/ui/input';
import { showMessage } from 'react-native-flash-message';

interface ValidationError {
  field: string;
  message: string;
}

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
}

const displayNotification = (
  message: string,
  type: "danger" | "success" | "warning"
) => {
  return showMessage({
    message,
    type,
    style: {
      paddingTop: 40,
    },
    titleStyle: {
      fontFamily: "Inter_500Medium",
      textAlign: "center",
    },
  });
};

const validateShippingInfo = (info: ShippingInfo): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Full Name validation
  if (!info.fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  } else if (info.fullName.length < 2) {
    errors.push({ field: 'fullName', message: 'Full name must be at least 2 characters' });
  }

  // Address validation
  if (!info.address.trim()) {
    errors.push({ field: 'address', message: 'Address is required' });
  } else if (info.address.length < 5) {
    errors.push({ field: 'address', message: 'Please enter a valid address' });
  }

  // City validation
  if (!info.city.trim()) {
    errors.push({ field: 'city', message: 'City is required' });
  }

  // State validation
  if (!info.state.trim()) {
    errors.push({ field: 'state', message: 'State is required' });
  } else if (info.state.length !== 2) {
    errors.push({ field: 'state', message: 'Please enter a valid 2-letter state code' });
  }

  // ZIP Code validation
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!info.zipCode.trim()) {
    errors.push({ field: 'zipCode', message: 'ZIP code is required' });
  } else if (!zipRegex.test(info.zipCode)) {
    errors.push({ field: 'zipCode', message: 'Please enter a valid ZIP code' });
  }

  // Phone validation
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (!info.phone.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!phoneRegex.test(info.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  return errors;
};

const validatePaymentInfo = (info: PaymentInfo): ValidationError[] => {
  const errors: ValidationError[] = [];



  // Expiry Date validation (MM/YY format)
  const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!info.expiryDate.trim()) {
    errors.push({ field: 'expiryDate', message: 'Expiry date is required' });
  } else if (!expiryRegex.test(info.expiryDate)) {
    errors.push({ field: 'expiryDate', message: 'Please enter a valid expiry date (MM/YY)' });
  } else {
    // Check if card is expired
    const [month, year] = info.expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    if (expiry < new Date()) {
      errors.push({ field: 'expiryDate', message: 'Card has expired' });
    }
  }

  // CVV validation
  const cvvRegex = /^[0-9]{3,4}$/;
  if (!info.cvv.trim()) {
    errors.push({ field: 'cvv', message: 'CVV is required' });
  } else if (!cvvRegex.test(info.cvv)) {
    errors.push({ field: 'cvv', message: 'Please enter a valid CVV' });
  }

  // Cardholder Name validation
  if (!info.cardHolderName.trim()) {
    errors.push({ field: 'cardHolderName', message: 'Cardholder name is required' });
  } else if (info.cardHolderName.length < 2) {
    errors.push({ field: 'cardHolderName', message: 'Please enter a valid cardholder name' });
  }

  return errors;
};

export default function CheckoutScreen({ navigation }) {
  const { items, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
  });

  const handleShippingSubmit = () => {
    const validationErrors = validateShippingInfo(shippingInfo);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      displayNotification(validationErrors[0].message, 'warning');
      return;
    }

    setCurrentStep('payment');
  };

  const handlePaymentSubmit = () => {
    const validationErrors = validatePaymentInfo(paymentInfo);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      displayNotification(validationErrors[0].message, 'warning');
      return;
    }

    setCurrentStep('review');
  };

  const formatCardNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatPhone = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Format as (XXX) XXX-XXXX
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const parts = [match[1], match[2], match[3]].filter(Boolean);
      if (parts.length === 0) return '';
      if (parts.length === 1) return `(${parts[0]}`;
      if (parts.length === 2) return `(${parts[0]}) ${parts[1]}`;
      return `(${parts[0]}) ${parts[1]}-${parts[2]}`;
    }
    return cleaned;
  };

  const formatExpiryDate = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const getFieldError = (fieldName: string) => {
    const error = errors.find(error => error.field === fieldName)?.message;
    if (error) {
      return {
        style: { borderColor: '#ef4444' },  // Red border for error state
        className: "border-red-500"
      };
    }
    return {};
  };

  const handlePlaceOrder = () => {
    // Here you would typically make an API call to process the order
    displayNotification('Order Placed!', 'success');
    Alert.alert(
      'Order Placed!',
      'Thank you for your order. You will receive a confirmation email shortly.',
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            navigation.navigate('MainTabs');
          },
        },
      ]
    );
  };

  const renderShippingForm = () => (
    <View className="gap-6">
      <H4>Shipping Information</H4>
      <View className="gap-2">
        <Input
          placeholder="Full Name"
          placeholderTextColor="#666"
          value={shippingInfo.fullName}
          onChangeText={(text) =>
            setShippingInfo({ ...shippingInfo, fullName: text })
          }
          {...getFieldError('fullName')}
        />
        <Input
          placeholder="Address"
          placeholderTextColor="#666"
          value={shippingInfo.address}
          onChangeText={(text) =>
            setShippingInfo({ ...shippingInfo, address: text })
          }
          {...getFieldError('address')}
        />
        <View className="flex-row gap-2">
          <Input
            placeholder="City"
            className="flex-1"
            placeholderTextColor="#666"
            value={shippingInfo.city}
            onChangeText={(text) =>
              setShippingInfo({ ...shippingInfo, city: text })
            }
            {...getFieldError('city')}
          />
          <Input
            placeholder="State"
            className="flex-1"
            placeholderTextColor="#666"
            value={shippingInfo.state}
            onChangeText={(text) =>
              setShippingInfo({ ...shippingInfo, state: text.toUpperCase().slice(0, 2) })
            }
            {...getFieldError('state')}
          />
        </View>
        <View className="flex-row gap-2">
          <Input
            className="w-1/3"
            placeholder="ZIP Code"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={shippingInfo.zipCode}
            onChangeText={(text) =>
              setShippingInfo({ ...shippingInfo, zipCode: text.slice(0, 10) })
            }
            {...getFieldError('zipCode')}
          />
          <Input
            className="flex-auto"
            placeholder="Phone"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            value={formatPhone(shippingInfo.phone)}
            onChangeText={(text) =>
              setShippingInfo({ ...shippingInfo, phone: text })
            }
            {...getFieldError('phone')}
          />
        </View>
      </View>
      <Button
        variant="default"
        onPress={handleShippingSubmit}
      >
        <P className="uppercase text-black">Continue to Payment</P>
      </Button>
    </View>
  );

  const renderPaymentForm = () => (
    <View className='gap-6'>
      <H4>Payment Information</H4>
      <View className="gap-2">
        <Input
          placeholder="Card Number"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={formatCardNumber(paymentInfo.cardNumber)}
          onChangeText={(text) =>
            setPaymentInfo({ ...paymentInfo, cardNumber: text })
          }
          {...getFieldError('cardNumber')}
        />
        <View className="flex-row gap-2">
          <Input
            placeholder="MM/YY"
            placeholderTextColor="#666"
            value={formatExpiryDate(paymentInfo.expiryDate)}
            onChangeText={(text) =>
              setPaymentInfo({ ...paymentInfo, expiryDate: text })
            }
            {...getFieldError('expiryDate')}
          />
          <Input
            placeholder="CVV"
            placeholderTextColor="#666"
            keyboardType="numeric"
            secureTextEntry
            value={paymentInfo.cvv}
            onChangeText={(text) =>
              setPaymentInfo({ ...paymentInfo, cvv: text.slice(0, 4) })
            }
            {...getFieldError('cvv')}
          />
        </View>
        <Input
          placeholder="Cardholder Name"
          placeholderTextColor="#666"
          value={paymentInfo.cardHolderName}
          onChangeText={(text) =>
            setPaymentInfo({ ...paymentInfo, cardHolderName: text })
          }
          {...getFieldError('cardHolderName')}
        />
      </View>
      <Button
        variant="default"
        onPress={handlePaymentSubmit}
      >
        <P className="uppercase text-black">Review Order</P>
      </Button>
    </View>
  );

  const renderOrderReview = () => (
    <View style={styles.orderReview}>
      <H4>Order Review</H4>
      <View style={styles.orderReviewFields}>
        <View style={styles.orderReviewSection}>
          <H4>Shipping To</H4>
          <P>{shippingInfo.fullName}</P>
          <P>{shippingInfo.address}</P>
          <P>{`${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`}</P>
          <P>{shippingInfo.phone}</P>
        </View>

        <View style={styles.orderReviewSection}>
          <H4>Payment Method</H4>
          <P>Card ending in {paymentInfo.cardNumber.slice(-4)}</P>
          <P>{paymentInfo.cardHolderName}</P>
        </View>

        <View style={styles.orderReviewSection}>
          <H4>Order Summary</H4>
          {items.map((item) => (
            <View key={item.product_id} style={styles.orderReviewItem}>
              <P>{`${item.quantity}x ${item.name}`}</P>
              <P>{formatPrice(item.price * item.quantity)}</P>
            </View>
          ))}
          <View style={styles.orderReviewTotal}>
            <View style={styles.orderReviewTotalItem}>
              <P>Subtotal</P>
              <P>{formatPrice(getCartTotal())}</P>
            </View>
            <View style={styles.orderReviewTotalItem}>
              <P>Shipping</P>
              <P>Free</P>
            </View>
            <View style={styles.orderReviewTotalItem}>
              <H4>Total</H4>
              <H4>{formatPrice(getCartTotal())}</H4>
            </View>
          </View>
        </View>
      </View>
      <Button
        variant="default"
        onPress={handlePlaceOrder}
      >
        <P className="uppercase text-black">Place Order</P>
      </Button>
    </View>
  );

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView style={styles.scrollView}>
        <View style={styles.steps}>
          <View style={styles.step}>
            <View
              style={[
                currentStep === 'shipping' ? styles.stepCircleActive : styles.stepCircleInactive,
              ]}
              className='!bg-[#2c2c2c] w-8 h-8 rounded-full flex items-center justify-center'
            >
              <P style={currentStep === 'shipping' ? styles.stepTextActive : styles.stepTextInactive}>1</P>
            </View>
            <P style={styles.stepLabel}>Shipping</P>
          </View>
          <View style={styles.step}>
            <View
              style={[
                currentStep === 'payment' ? styles.stepCircleActive : styles.stepCircleInactive,
              ]}
              className='!bg-[#2c2c2c] w-8 h-8 rounded-full flex items-center justify-center'
            >
              <P style={currentStep === 'payment' ? styles.stepTextActive : styles.stepTextInactive}>2</P>
            </View>
            <P style={styles.stepLabel}>Payment</P>
          </View>
          <View style={styles.step}>
            <View
              style={[
                currentStep === 'review' ? styles.stepCircleActive : styles.stepCircleInactive,
              ]}
              className='!bg-[#2c2c2c] w-8 h-8 rounded-full flex items-center justify-center'
            >
              <P style={currentStep === 'review' ? styles.stepTextActive : styles.stepTextInactive}>3</P>
            </View>
            <P style={styles.stepLabel}>Review</P>
          </View>
        </View>

        {currentStep === 'shipping' && renderShippingForm()}
        {currentStep === 'payment' && renderPaymentForm()}
        {currentStep === 'review' && renderOrderReview()}
      </ScrollView>
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 24,
  },
  steps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  step: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#fff',
  },
  stepCircleInactive: {
    backgroundColor: '#f1f1f1',
  },
  stepTextActive: {
    fontSize: 14,
    color: '#000',
  },
  stepTextInactive: {
    fontSize: 14,
    color: '#666',
  },
  stepLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  shippingForm: {
    marginBottom: 24,
  },
  shippingFormFields: {
    marginBottom: 24,
  },
  textInput: {
    height: 40,
    borderColor: '#666',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex1TextInput: {
    flex: 1,
    height: 40,
    borderColor: '#666',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 16,
  },
  w20TextInput: {
    width: 80,
    height: 40,
    borderColor: '#666',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  flex2TextInput: {
    flex: 2,
    height: 40,
    borderColor: '#666',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#666',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  paymentForm: {
    marginBottom: 24,
  },
  paymentFormFields: {
    marginBottom: 24,
  },
  orderReview: {
    marginBottom: 24,
  },
  orderReviewFields: {
    marginBottom: 24,
  },
  orderReviewSection: {
    marginBottom: 24,
  },
  orderReviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  orderReviewTotal: {
    borderTopWidth: 1,
    borderTopColor: '#666',
    paddingVertical: 16,
  },
  orderReviewTotalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
});
