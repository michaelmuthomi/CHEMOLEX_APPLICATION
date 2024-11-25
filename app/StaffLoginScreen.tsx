import * as React from "react";
import { Image, View } from "react-native";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { P, H1 } from "~/components/ui/typography";
import { Link, router } from "expo-router";
import { showMessage } from "react-native-flash-message";
import { checkUser, validateUserCredentials } from "~/lib/supabase";
import { useEmail } from "~/app/EmailContext";

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

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const emailContext = useEmail();
  const { setEmail: setEmailContext } = emailContext || { setEmail: () => {} };

  const onEmailInput = (text: string) => {
    setEmail(text);
  };
  const onPasswordInput = (text: string) => {
    setPassword(text);
  };

  const handleLogin = async () => {
    if (email && password) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        displayNotification("Invalid Email", "warning");
        return;
      }
      const UserAvailable = await checkUser(email);
      if (!UserAvailable) {
        displayNotification("User does not exist", "danger");
        return;
      }
      const isValid = await validateUserCredentials(email, password);
      if (isValid["role"]) {
        const user_role = isValid["role"];
        console.log("Role:", user_role);
        
        // Route to appropriate screen based on role
        switch (user_role) {
          case "customer":
            router.push({
              pathname: "/HomeScreen",
              params: { email: email },
            });
            break;
          case "stock_manager":
            router.push({
              pathname: "./StockManagementScreen",
              params: { email: email },
            });
            break;
          case "finance_controller":
            router.push({
              pathname: "./FinanceControllerScreen",
              params: { email: email },
            });
            break;
          case "dispatch_manager":
            router.push({
              pathname: "./DispatcherManagerScreen",
              params: { email: email },
            });
            break;
          case "service_manager":
            router.push({
              pathname: "./ServiceManagerScreen",
              params: { email: email },
            });
            break;
          case "supervisor":
            router.push({
              pathname: "./SupervisorScreen",
              params: { email: email },
            });
            break;
          case "technician":
            router.push({
              pathname: "./TechnicianScreen",
              params: { email: email },
            });
            break;
          default:
            showMessage({
              message: "Invalid role or access denied",
              type: "danger",
              style: { paddingTop: 40 },
            });
            return;
        }

        setEmailContext(email);
      } else {
        displayNotification("Invalid Credentials", "danger");
      }
    } else {
      displayNotification("Please fill all the fields", "warning");
    }
  };
  return (
    <View className="flex-1 justify-between items-center gap-5 px-6 py-14">
      <Image
        source={require("../assets/images/RefnetLogo.png")}
        className="mt-14 w-screen h-32 scale-50 mx-auto absolute top-0 left-0"
        resizeMode="contain"
      />
      <View className="w-full mb-auto mt-auto gap-6">
        <View className="w-full">
          <H1>Staff Login Page</H1>
          <P
            className="text-lg color-[#b3b3b3]"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            We Don’t Promise... We’re Proven!
          </P>
        </View>
        <View className="w-full gap-4">
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
        </View>
        <P className="text-right uppercase text-blue-400">
          <Link href="/reset-password">Forgot Password</Link>
        </P>
        <Button onPress={handleLogin} className="w-full" size={"lg"}>
          <P className="uppercase text-white">Login and continue</P>
        </Button>
        <P
          className="text-center text-lg pt-4 color-[#b3b3b3]"
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Sign in to access your account and manage your air conditioning
          solutions
        </P>
      </View>
      <View className="gap-4 divide-x-2 flex flex-row">
        <Link href="/SignupScreen">
          <P className="text-blue-400 uppercase">Create an account</P>
        </Link>
        <P>|</P>
        <Link href="/LoginScreen" className="text-blue-400 ">
          <P className="text-blue-400 uppercase">User Login</P>
        </Link>
      </View>
    </View>
  );
}
