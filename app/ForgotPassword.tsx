import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useState } from "react";
import { H1, P } from "~/components/ui/typography";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { showMessage } from "react-native-flash-message";
import { checkUser, resetPassword } from "~/lib/supabase";

const displayNotification = (
  message: string,
  type: "danger" | "success" | "warning"
) => {
  showMessage({
    message,
    type,
    style: { paddingTop: 40 },
  });
};

export default function Screen() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email || !newPassword || !confirmPassword) {
      displayNotification("Please fill all fields", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      displayNotification("Passwords do not match", "warning");
      return;
    }

    if (newPassword.length < 6) {
      displayNotification("Password must be at least 6 characters", "warning");
      return;
    }

    setIsLoading(true);
    try {
      // First check if user exists
      const user = await checkUser(email);
      if (!user["email"]) {
        displayNotification("User not found", "danger");
        return;
      }

      // Reset the password
      const response = await resetPassword(email, newPassword);
      
      if (response.startsWith("Success")) {
        displayNotification("Password reset successful", "success");
        // Redirect based on user role
        if (user["role"] === "customer") {
          router.push("/LoginScreen");
        } else {
          router.push("/StaffLoginScreen");
        }
      } else {
        displayNotification(response.replace("Error: ", ""), "danger");
      }
    } catch (error) {
      displayNotification("Failed to reset password", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-between items-center gap-5 px-6 py-14">
      <Image
        source={require("../assets/images/RefnetLogo.png")}
        className="mt-14 w-screen h-32 scale-50 mx-auto absolute top-0 left-0"
      />
      <View className="w-full space-y-4 mt-20">
        <H1 className="text-center">Reset Password</H1>
        <P className="text-center text-muted-foreground">
          Enter your email and new password
        </P>
        <View className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="bg-[#131313] border-0 !h-14 text-white"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            className="bg-[#131313] border-0 !h-14 text-white"
            autoComplete="password"
            textContentType="password"
            secureTextEntry
          />
          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            className="bg-[#131313] border-0 !h-14 text-white"
            autoComplete="password"
            textContentType="password"
            secureTextEntry
          />
          <Button 
            onPress={handleResetPassword} 
            className="w-full" 
            size={"lg"}
            disabled={isLoading}
          >
            <P className="text-black uppercase">
              {isLoading ? "Resetting..." : "Reset Password"}
            </P>
          </Button>
        </View>
      </View>
      <View className="gap-4 divide-x-2 flex flex-row">
        <Link href="/LoginScreen">
          <P className="text-blue-400 uppercase">Back to Login</P>
        </Link>
      </View>
    </View>
  );
}
