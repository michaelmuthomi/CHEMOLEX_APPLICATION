import * as React from "react";
import { ActivityIndicator, Image, SafeAreaView, View } from "react-native";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { P, H1, H2, H4, H5 } from "~/components/ui/typography";
import { Link, router } from "expo-router";
import { showMessage } from "react-native-flash-message";
import { checkUser, validateUserCredentials } from "~/lib/supabase";
import { useEmail } from "~/app/EmailContext";
import { useNavigation } from "@react-navigation/native";

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

export default function Screen() {
  const navigation = useNavigation(); // Use hook to access navigation
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const emailContext = useEmail();
  const { setEmail: setEmailContext } = emailContext || { setEmail: () => {} };
  const [loading, setLoading] = React.useState(false);

  const onEmailInput = (text: string) => {
    setEmail(text);
  };

  const onPasswordInput = (text: string) => {
    setPassword(text);
  };

 const handleLogin = async () => {
   setLoading(true);

   // Check if both email and password are provided
   if (!email || !password) {
     displayNotification("Please fill all the fields", "warning");
     setLoading(false);
     return;
   }

   // Validate email format
   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailPattern.test(email)) {
     displayNotification("Invalid Email", "warning");
     setLoading(false);
     return;
   }

   // Check if user exists
   const UserAvailable = await checkUser(email);
   if (!UserAvailable) {
     displayNotification("User does not exist", "danger");
     setLoading(false);
     return;
   }

   // Validate user credentials
   const isValid = await validateUserCredentials(email, password);

   // Handle user role or invalid password
   if (isValid) {
     const user_role = isValid["role"];
     console.log(user_role);

     if (user_role === "customer") {
       console.log("User is a Customer");
       setEmailContext(email);
       navigation.navigate("Customer");
     } else {
       displayNotification("Invalid Credentials", "danger");
     }
   } else {
     displayNotification("Invalid Credentials", "danger");
   }

   setLoading(false); // Move this to the end to maintain consistent loading state
 };
  return (
    <SafeAreaView className="flex-1 justify-between items-center px-6 py-14">
      <Image
        source={require("../assets/images/RefnetLogo.png")}
        className="mt-14 w-1/3 h-8 absolute top-4 left-6"
        resizeMode="cover"
      />
      <View className="w-full mb-auto mt-auto gap-10 bg-zinc-950">
        <View className="gap-2">
          <H1 className="text-3xl">Sign in to your Account</H1>
          <P
            className=" color-[#b3b3b3] pr-6"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            Enter your email and password to login to your account
          </P>
        </View>
        <View className="w-full gap-6">
          <View className="gap-2">
            <H5 className="color-[#888888] px-2">Email Address</H5>
            <Input
              placeholder="example@gmail.com"
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
          </View>
          <View className="gap-2">
            <H5 className="color-[#888888] px-2">Password</H5>
            <Input
              placeholder="password123"
              value={password}
              onChangeText={onPasswordInput}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
              className="bg-[#131313] border-0 !h-14 text-white"
              autoComplete="password"
              textContentType="password"
              secureTextEntry
            />
          </View>
        </View>
        <P className="text-right uppercase text-blue-400">
          <Link href="/ForgotPassword">Forgot Password ?</Link>
        </P>
        <Button
          onPress={handleLogin}
          className="w-full flex"
          size={"lg"}
          variant="default"
          disabled={loading}
        >
          <P className="uppercase text-black">
            {loading ? "Logging In" : "Login and continue"}
          </P>
        </Button>
      </View>
      <View className="gap-4 divide-x-2 flex flex-row">
        <Link href="/SignupScreen">
          <P className="text-blue-400 uppercase">Create an account</P>
        </Link>
        <P>|</P>
        <Link href="/StaffLoginScreen" className="text-blue-400 ">
          <P className="text-blue-400 uppercase">Staff Login</P>
        </Link>
      </View>
    </SafeAreaView>
  );
}
