import React, { useState, useEffect } from 'react';
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
import { H3, H4, H5, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Barcode, CalendarRange, ChevronLeft, ClipboardEdit, CreditCard, Earth, LocateFixedIcon, MapPin, MapPinned, PhoneCallIcon, User, WalletCards } from "lucide-react-native";
import { Input } from "~/components/ui/input";
import { useEmail } from "~/app/EmailContext";
import { checkUser, placeAnOrder } from "~/lib/supabase";
import displayNotification from "~/lib/Notification";
import { useNavigation } from 'expo-router';

interface ValidationError {
  field: string;
  message: string;
}

interface ShippingInfo {
  full_name: string;
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

const validateShippingInfo = (info: ShippingInfo): ValidationError[] => {
  const errors: ValidationError[] = [];

  return errors;
};

const validatePaymentInfo = (info: PaymentInfo): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Expiry Date validation (MM/YY format)
  const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!info.expiryDate.trim()) {
    errors.push({ field: "expiryDate", message: "Expiry date is required" });
  } else if (!expiryRegex.test(info.expiryDate)) {
    errors.push({
      field: "expiryDate",
      message: "Please enter a valid expiry date (MM/YY)",
    });
  } else {
    // Check if card is expired
    const [month, year] = info.expiryDate.split("/");
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    if (expiry < new Date()) {
      errors.push({ field: "expiryDate", message: "Card has expired" });
    }
  }

  // CVV validation
  const cvvRegex = /^[0-9]{3,4}$/;
  if (!info.cvv.trim()) {
    errors.push({ field: "cvv", message: "CVV is required" });
  } else if (!cvvRegex.test(info.cvv)) {
    errors.push({ field: "cvv", message: "Please enter a valid CVV" });
  }

  // Cardholder Name validation
  if (!info.cardHolderName.trim()) {
    errors.push({
      field: "cardHolderName",
      message: "Cardholder name is required",
    });
  } else if (info.cardHolderName.length < 2) {
    errors.push({
      field: "cardHolderName",
      message: "Please enter a valid cardholder name",
    });
  }

  return errors;
};

export default function Page() {
  const navigation = useNavigation()
  const emailContext = useEmail();
  const [customer, setCustomerDetails] = useState([]);
  const { setEmail: setEmailContext } = emailContext || { setEmail: () => {} };
  const { items, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<
    "shipping" | "payment" | "review"
  >("shipping");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    full_name: "",
    address: "",
    city: "",
    state: "",
    zipCode: 30100,
    phone: "",
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
  });

  useEffect(() => {
    async function fetchUserDetails() {
      const response = await checkUser(emailContext?.email);
      console.log("Username", response.full_name);
      setCustomerDetails(response);
    }
    fetchUserDetails();
  }, [emailContext]);

  const handleShippingSubmit = () => {
    const validationErrors = validateShippingInfo(shippingInfo);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      displayNotification(validationErrors[0].message, "warning");
      return;
    }

    setCurrentStep("payment");
  };

  const handlePaymentSubmit = () => {
    const validationErrors = validatePaymentInfo(paymentInfo);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      displayNotification(validationErrors[0].message, "warning");
      return;
    }

    setCurrentStep("review");
  };

  const formatCardNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, "");
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatPhone = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, "");
    // Format as (XXX) XXX-XXXX
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const parts = [match[1], match[2], match[3]].filter(Boolean);
      if (parts.length === 0) return "";
      if (parts.length === 1) return `(${parts[0]}`;
      if (parts.length === 2) return `(${parts[0]}) ${parts[1]}`;
      return `(${parts[0]}) ${parts[1]}-${parts[2]}`;
    }
    return cleaned;
  };

  const formatExpiryDate = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, "");
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const getFieldError = (fieldName: string) => {
    const error = errors.find((error) => error.field === fieldName)?.message;
    if (error) {
      return {
        style: { borderColor: "#ef4444" }, // Red border for error state
        className: "border-red-500",
      };
    }
    return {};
  };

  const handlePlaceOrder = () => {
    async function PlaceOrder() {
      // Calculate total amount as a single value
      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Create an order for each item
      for (const item of items) {
        const details = {
          total_amount: total,
          user_id: customer.user_id,
          payment_method: "credit_card",
          payment_status: "completed",
          delivery_address: customer.address,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.price,
        };

        try {
          const response = await placeAnOrder(details);
          if (typeof response === "string" && response.startsWith("Error")) {
            displayNotification(response, "danger");
            return;
          }
        } catch (error) {
          displayNotification("Failed to place order", "danger");
          return;
        }
      }

      displayNotification("Order Placed!", "success");
      clearCart()
      navigation.navigate("profile");
    }
    PlaceOrder();
  };

  const handleBackStep = () => {
    if (currentStep === "payment") {
      setCurrentStep("shipping");
    } else if (currentStep === "review") {
      setCurrentStep("payment");
    }
  };

  const renderShippingForm = () => (
    <View className="gap-10 my-4">
      <View>
        <H3>Shipping Information</H3>
        <P className="text-gray-500">
          Please fill in your shipping details below
        </P>
      </View>
      <View className="gap-6">
        <View className="gap-2">
          <H5>Full Name</H5>
          <View className="flex-row items-center rounded-md">
            <User size={16} color={"#aaaaaa"} />
            <Input
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={customer.full_name}
              onChangeText={(text) =>
                setShippingInfo({ ...customer, full_name: text })
              }
              {...getFieldError("full_name")}
              className="border-0 flex-1"
            />
          </View>
        </View>
        <View className="gap-2">
          <H5>Address</H5>
          <View className="flex-row items-center rounded-md">
            <MapPin size={16} color={"#aaaaaa"} />
            <Input
              placeholder="Address"
              placeholderTextColor="#666"
              value={customer.address}
              onChangeText={(text) =>
                setShippingInfo({ ...customer, address: text })
              }
              {...getFieldError("address")}
              className="border-0 flex-1"
            />
          </View>
        </View>
        <View className="flex-row gap-2">
          <View className="gap-2 w-1/2">
            <H5>City</H5>
            <View className="flex-row items-center rounded-md">
              <MapPinned size={16} color={"#aaaaaa"} />
              <Input
                placeholder="City"
                placeholderTextColor="#666"
                value={customer.city}
                onChangeText={(text) =>
                  setShippingInfo({ ...customer, city: text })
                }
                {...getFieldError("city")}
                required={true}
                className="border-0 flex-1"
              />
            </View>
          </View>
          <View className="gap-2 flex-1">
            <H5>Country</H5>
            <View className="flex-row items-center rounded-md">
              <Earth size={16} color={"#aaaaaa"} />
              <Input
                placeholder="Country"
                placeholderTextColor="#666"
                value={customer.state}
                required={true}
                onChangeText={(text) =>
                  setShippingInfo({
                    ...customer,
                    state: text.toUpperCase().slice(0, 2),
                  })
                }
                {...getFieldError("state")}
                className="border-0 flex-1"
              />
            </View>
          </View>
        </View>
        <View className="gap-2">
          <H5>Phone Number</H5>
          <View className="flex-row items-center rounded-md w-full">
            <PhoneCallIcon size={16} color={"#aaaaaa"} />
            <Input
              placeholder="Phone"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={customer.phone_number}
              onChangeText={(text) =>
                setShippingInfo({ ...customer, phone_number: text })
              }
              {...getFieldError("phone")}
              className="border-0 flex-1"
            />
          </View>
        </View>
      </View>
      <View className="flex-row gap-4 w-full justify-between">
        <Button
          onPress={handleBackStep}
          className="rounded-full border-[1px] border-white bg-transparent"
          size={"lg"}
          variant="default"
          disabled
        >
          <H5 className=" text-white">&larr; {" Back"}</H5>
        </Button>
        <Button
          onPress={handleShippingSubmit}
          className="rounded-full flex-1"
          size={"lg"}
          variant="default"
        >
          <H5 className=" text-black">{"Continue"}</H5>
        </Button>
      </View>
    </View>
  );

  const renderPaymentForm = () => (
    <View className="gap-10">
      <View className="flex-row items-center gap-2">
        <View>
          <H3>Choose a Payment Method</H3>
          <P className="text-gray-500">
            You will not be charged untill you complete the transaction
          </P>
        </View>
      </View>
      <View className="gap-6">
        <View className="gap-2">
          <H5>Name on Card</H5>
          <View className="flex-row items-center rounded-md w-full">
            <ClipboardEdit size={16} color={"#aaaaaa"} />
            <Input
              placeholder="Cardholder Name"
              placeholderTextColor="#666"
              value={paymentInfo.cardHolderName}
              onChangeText={(text) =>
                setPaymentInfo({ ...paymentInfo, cardHolderName: text })
              }
              {...getFieldError("cardHolderName")}
              className="border-0 flex-1"
            />
          </View>
        </View>
        <View className="gap-2">
          <H5>Card Number</H5>
          <View className="flex-row items-center rounded-md w-full">
            <CreditCard size={16} color={"#aaaaaa"} />
            <Input
              placeholder="Card Number"
              placeholderTextColor="**** **** **** ****"
              keyboardType="numeric"
              value={formatCardNumber(paymentInfo.cardNumber)}
              onChangeText={(text) =>
                setPaymentInfo({ ...paymentInfo, cardNumber: text })
              }
              {...getFieldError("cardNumber")}
              className="border-0 flex-1"
            />
          </View>
        </View>
        <View className="flex-row gap-2">
          <View className="gap-2 w-1/2">
            <H5>Expiration date</H5>
            <View className="flex-row items-center rounded-md w-full">
              <CalendarRange size={16} color={"#aaaaaa"} />
              <View className="flex-row gap-2">
                <Input
                  placeholder="MM/YY"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  value={formatExpiryDate(paymentInfo.expiryDate)}
                  onChangeText={(text) =>
                    setPaymentInfo({ ...paymentInfo, expiryDate: text })
                  }
                  {...getFieldError("expiryDate")}
                  className="border-0 flex-1"
                />
              </View>
            </View>
          </View>
          <View className="gap-2 flex-1">
            <H5>Security code</H5>
            <View className="flex-row items-center rounded-md w-full">
              <Barcode size={16} color={"#aaaaaa"} />
              <Input
                placeholder="CVV"
                placeholderTextColor="#666"
                keyboardType="numeric"
                secureTextEntry
                value={paymentInfo.cvv}
                onChangeText={(text) =>
                  setPaymentInfo({ ...paymentInfo, cvv: text.slice(0, 4) })
                }
                {...getFieldError("cvv")}
                className="border-0 flex-1"
              />
            </View>
          </View>
        </View>
      </View>
      <View className="flex-row gap-4 w-full justify-between">
        <Button
          onPress={handleBackStep}
          className="rounded-full border-[1px] border-white bg-transparent"
          size={"lg"}
          variant="default"
        >
          <H5 className="text-white">&larr; {" Back"}</H5>
        </Button>
        <Button
          onPress={handlePaymentSubmit}
          className="rounded-full flex-1"
          size={"lg"}
          variant="default"
        >
          <H5 className=" text-black">{"Review Order"}</H5>
        </Button>
      </View>
    </View>
  );

  const renderOrderReview = () => (
    <View className="gap-10">
      <View className="flex-row items-center gap-2">
        <View>
          <H3>Please confirm and submit order</H3>
          <P className="text-gray-500">
            By clicking submit, your account will be charges and the product(s)
            dispatched.
          </P>
        </View>
      </View>
      <View>
        <View className="gap-4">
          <H3 className="text-xl">Shipping address</H3>
          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <P className="w-1/2">Name</P>
              <H5 className="text-right">{customer.full_name}</H5>
            </View>
            <View className="flex-row justify-between items-center">
              <P className="w-1/2">Address</P>
              <H5 className="text-right">{customer.address}</H5>
            </View>
            <P>{customer.phone}</P>
          </View>
        </View>

        <View>
          <View className="gap-4">
            <H3 className="text-xl">Payment method</H3>
            <View className="flex-row justify-between items-center">
              <P className="w-1/2">
                &#183; &#183; &#183; &#183; {paymentInfo.cardNumber.slice(-4)}
              </P>
              <H5 className="text-right">
                {formatExpiryDate(paymentInfo.expiryDate)}
              </H5>
            </View>
          </View>
        </View>
      </View>
      <View>
        <H3>Order Summary</H3>
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
        <View className="flex-row gap-4 w-full justify-between">
          <Button
            onPress={handleBackStep}
            className="rounded-full border-[1px] border-white bg-transparent"
            size={"lg"}
            variant="default"
          >
            <H5 className=" text-white">&larr; {" Back"}</H5>
          </Button>
          <Button
            onPress={handlePlaceOrder}
            className="rounded-full flex-1"
            size={"lg"}
            variant="default"
          >
            <H5 className="text-black">{"Place Order"}</H5>
          </Button>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <ScrollView style={styles.scrollView}>
        <View style={styles.steps}>
          <View className="flex-row items-center gap-2">
            <View
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "shipping" ? "bg-green-500" : "!bg-[#2c2c2c]"
              }`}
            >
              <P> 1 </P>
            </View>
            <H4
              className={`text-base ${
                currentStep === "shipping" ? "text-white" : "text-zinc-400"
              }`}
            >
              Shipping
            </H4>
          </View>
          <View className="flex-row items-center gap-2">
            <View
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "payment" ? "bg-green-500" : "!bg-[#2c2c2c]"
              }`}
            >
              <P> 2 </P>
            </View>
            <H4
              className={`text-base ${
                currentStep === "payment" ? "text-white" : "text-zinc-400"
              }`}
            >
              Payment
            </H4>
          </View>
          <View className="flex-row items-center gap-2">
            <View
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "review" ? "bg-green-500" : "!bg-[#2c2c2c]"
              }`}
            >
              <P> 3 </P>
            </View>
            <H4
              className={`text-base ${
                currentStep === "review" ? "text-white" : "text-zinc-400"
              }`}
            >
              Review
            </H4>
          </View>
        </View>

        {currentStep === "shipping" && renderShippingForm()}
        {currentStep === "payment" && renderPaymentForm()}
        {currentStep === "review" && renderOrderReview()}
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
