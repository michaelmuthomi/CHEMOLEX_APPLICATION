import * as React from "react";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { P, H1, H4, H5 } from "~/components/ui/typography";
import { Link, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { addUserToDB } from "~/lib/supabase";
import { Dropdown } from "react-native-element-dropdown";
import displayNotification from "~/lib/Notification";

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
  const [address, setaddress] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [role, setRole] = React.useState("customer");
  const [loading, setLoading] = React.useState(false);

  const onEmailInput = (text: string) => {
    setEmail(text);
  };
  const onPasswordInput = (text: string) => {
    setPassword(text);
  };
  const onPhoneNumberInput = (text: string) => {
    setPhoneNumber(text);
  };
  const onaddressInput = (text: string) => {
    setaddress(text);
  };
  const onFullNameInput = (text: string) => {
    setFullName(text);
  };
  const validateInputs = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!address || !fullName || !email || !phoneNumber || !password) {
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
    setLoading(true);
    const validationError = validateInputs();
    if (validationError) {
      displayNotification(validationError, "warning");
      setLoading(false)
      return;
    }
    if (address && fullName && email && phoneNumber && password && role) {
      const response = await addUserToDB(
        address,
        fullName,
        email,
        password,
        Number(phoneNumber),
        role
      );
      if (response.startsWith("Success")) {
        router.push({
          pathname: "/LoginScreen",
        });
        displayNotification("User created successfully", "success");
        setLoading(false)
        return;
      }
      console.log("Create account log: >> ", response)
      displayNotification("User already exists", "danger");
      setLoading(false);
    } else {
      displayNotification("Please fill all the fields", "warning");
      setLoading(false);
    }
  };
  return (
    <View className="">
      <ScrollView className="flex gap-10 px-2 pt-">
        <View className="w-full mb-4">
          <H4 className="text-lg color-[#b3b3b3]">
            Welcome to Chemolex, create an account and start managing your air
            conditioning solutions
          </H4>
        </View>
        <View className="w-full mb-auto mt-auto gap-6">
          <View className="w-full gap-4">
            <View className="gap-2">
              <H5 className="color-[#888888]">Full Name</H5>
              <Input
                placeholder="eg. John Doe"
                value={fullName}
                onChangeText={onFullNameInput}
                aria-labelledby="inputLabel"
                aria-errormessage="inputError"
                className="bg-white border border-zinc-400 !h-14 text-black"
                autoComplete="name"
                textContentType="name"
              />
            </View>
            <View className="gap-2">
              <H5 className="color-[#888888]">Phone Number</H5>
              <Input
                placeholder="eg. 0712-345-678"
                value={phoneNumber}
                onChangeText={onPhoneNumberInput}
                aria-labelledby="inputLabel"
                aria-errormessage="inputError"
                className="bg-white border border-zinc-400 !h-14 text-black"
                autoComplete="tel"
                textContentType="telephoneNumber"
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
            <View className="gap-2">
              <H5 className="color-[#888888]">Address</H5>
              <Input
                placeholder="eg. Nairobi, Kenya"
                value={address}
                onChangeText={onaddressInput}
                aria-labelledby="inputLabel"
                aria-errormessage="inputError"
                className="bg-white border border-zinc-400 !h-14 text-black"
                autoComplete="address"
                textContentType="name"
              />
            </View>
            <View className="gap-2">
              <H5 className="color-[#888888]">Email Address</H5>
              <Input
                placeholder="eg. xxx@gmail.com"
                value={email}
                onChangeText={onEmailInput}
                aria-labelledby="inputLabel"
                aria-errormessage="inputError"
                className="bg-white border border-zinc-400 !h-14 text-black"
                autoComplete="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View className="gap-2">
              <H5 className="color-[#888888]">Password</H5>
              <Input
                placeholder="xxxxxxxx"
                value={password}
                onChangeText={onPasswordInput}
                aria-labelledby="inputLabel"
                aria-errormessage="inputError"
                className="bg-white border border-zinc-400 !h-14 text-black"
                autoComplete="password"
                textContentType="password"
                secureTextEntry
              />
            </View>
            <Dropdown
              style={{
                height: 56,
                backgroundColor: "#fff",
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
              }}
              placeholderStyle={{
                color: "black",
                fontSize: 14,
                fontFamily: "Inter_400Regular",
              }}
              selectedTextStyle={{
                color: "black",
                fontSize: 14,
                fontFamily: "Inter_400Regular",
              }}
              data={[
                { label: "Customer", value: "Customer" },
                { label: "Waste Collector", value: "WasteCollector" },
                { label: "Recycler", value: "Recycler" },
                { label: "Inventory Manager", value: "InventoryManager" },
                { label: "Finance Manager", value: "FinanceManager" },
                { label: "Supplier Manager", value: "SupplierManager" },
                { label: "Service Manager", value: "ServiceManager" },
                { label: "Trainer", value: "Trainer" },
                { label: "Trainee", value: "Trainee" },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select your role"
              value={role}
              onChange={(item) => {
                setRole(item.value);
              }}
            />
          </View>
          <Button
            onPress={handleSignup}
            className="w-full rounded-full bg-green-900"
            size={"lg"}
            variant="default"
          >
            {loading ? (
              <View className="flex flex-row items-center gap-2">
                <ActivityIndicator size="small" color="#000" />
                <P className="text-center text-white">Create account</P>
              </View>
            ) : (
              <P className="text-center text-white">Create account</P>
            )}
          </Button>
          <H4 className="text-center text-lg pt-4 color-[#b3b3b3]">
            Create your account and start managing {"\n"} your air conditioning
            solutions
          </H4>
        </View>
      </ScrollView>
    </View>
  );
}
