import * as React from "react";
import { Image, ScrollView, View } from "react-native";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { P, H1 } from "~/components/ui/typography";
import { Link, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { showMessage } from "react-native-flash-message";
import { addUserToDB } from "~/lib/supabase";

const displayNotification = (
  message: string,
  type: "danger" | "success" | "warning"
) => {
  return showMessage({
    message,
    type,
    hideOnPress: true,
    style: {
      marginTop: 40,
    },
    titleStyle: {
      fontFamily: "Inter_500Medium",
      textAlign: "center",
    },
  });
};

export default function Screen() {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [fullName, setFullName] = React.useState("");

  const onEmailInput = (text: string) => {
    setEmail(text);
  };
  const onPasswordInput = (text: string) => {
    setPassword(text);
  };
  const onPhoneNumberInput = (text: string) => {
    setPhoneNumber(text);
  };
  const onUserNameInput = (text: string) => {
    setUserName(text);
  };
  const onFullNameInput = (text: string) => {
    setFullName(text);
  };
  const validateInputs = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!userName || !fullName || !email || !phoneNumber || !password) {
      return "Please fill in all the fields";
    }
    if (!emailPattern.test(email)) {
      return "Please enter a valid email address";
    }
    if (!phonePattern.test(phoneNumber)) {
      return "Please enter a valid phone number (10 digits)";
    }
    return null;
  };

  const handleSignup = async () => {
    const validationError = validateInputs();
    if (validationError) {
      displayNotification(validationError, "warning");
      return;
    }
    if (userName && fullName && email && phoneNumber && password) {
      const response = await addUserToDB(
        userName,
        fullName,
        email,
        password,
        Number(phoneNumber)
      );
      if (response.startsWith("Success")) {
        router.push({
          pathname: "/LoginScreen",
        });
        displayNotification("User created successfully", "success");
        return;
      }
      displayNotification("User already exists", "danger");
    } else {
      displayNotification("Please fill all the fields", "warning");
    }
  };
  return (
    <View className="flex-1 justify-between items-center gap-5 px-6 pt-6">
      <Image
        source={require("../assets/images/Texture.jpg")}
        className="w-screen h-1/4 mx-auto absolute top-0 left-0 opacity-30"
      />
      <ScrollView>
        <View className="w-full mb-4">
          <H1>Create an account</H1>
          <P
            className="text-lg color-[#b3b3b3]"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Welcome to refnet create an account and start managing your air
            conditioning solutions
          </P>
        </View>
        <View className="w-full mb-auto mt-auto gap-6">
          <View className="w-full gap-4">
            <Input
              placeholder="Username"
              value={userName}
              onChangeText={onUserNameInput}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
              className="bg-[#131313] border-0 !h-14 text-white"
              autoComplete="username"
              textContentType="name"
            />
            <Input
              placeholder="Full Name"
              value={fullName}
              onChangeText={onFullNameInput}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
              className="bg-[#131313] border-0 !h-14 text-white"
              autoComplete="name"
              textContentType="name"
            />
            <Input
              placeholder="Phone number"
              value={phoneNumber}
              onChangeText={onPhoneNumberInput}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
              className="bg-[#131313] border-0 !h-14 text-white"
              autoComplete="tel"
              textContentType="telephoneNumber"
              keyboardType="number-pad"
              maxLength={10}
            />
            <Input
              placeholder="Email address"
              value={email}
              onChangeText={onEmailInput}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
              className="bg-[#131313] border-0 !h-14 text-white"
              autoComplete="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={onPasswordInput}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
              className="bg-[#131313] border-0 !h-14 text-white"
              autoComplete="password"
              textContentType="password"
              secureTextEntry
            />
            <Select defaultValue={{ value: "customer", label: "Customer" }}>
              <SelectTrigger className="w-full bg-[#131313] border-0 !h-14 text-white">
                <SelectValue
                  className="text-white text-sm native:text-lg bg-[#131313]"
                  placeholder="Select your role"
                  style={{ fontFamily: "Inter_400Regular" }}
                />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className="border-0 bg-[#131313] w-full px-4 !h-14 text-white"
              >
                <SelectGroup className="text-white bg-[#131313]">
                  <SelectLabel
                    className="text-white"
                    style={{ fontFamily: "Inter_400Regular" }}
                  >
                    Role
                  </SelectLabel>
                  <SelectItem
                    label="Customer"
                    value="customer"
                    style={{ fontFamily: "Inter_400Regular" }}
                  >
                    Customer
                  </SelectItem>
                  <SelectItem label="Service Manager" value="service_manager">
                    Service Manager
                  </SelectItem>
                  <SelectItem
                    label="Finance controller"
                    value="finance_controller"
                  >
                    Finance Controller
                  </SelectItem>
                  <SelectItem label="Stock Manager" value="stock_manager">
                    Stock Manager
                  </SelectItem>
                  <SelectItem label="Technician" value="technician">
                    Technician
                  </SelectItem>
                  <SelectItem label="Supervisor" value="supervisor">
                    Supervisor
                  </SelectItem>
                  <SelectItem label="Supplier" value="supplier">
                    Supplier
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>
          <Button onPress={handleSignup} className="w-full" size={"lg"}>
            <P className="text-black uppercase">Create account</P>
          </Button>
          <P
            className="text-center text-lg pt-4 color-[#b3b3b3]"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Sign in to access your account and manage your air conditioning
            solutions
          </P>
        </View>
      </ScrollView>
    </View>
  );
}
