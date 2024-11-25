import '~/global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, Text, View } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FlashMessage from "react-native-flash-message";
import { EmailProvider } from "./EmailContext"; 
import { P } from "~/components/ui/typography";
import { router } from "expo-router";

import SignupScreen from "./SignupScreen";
import LoginScreen from "./LoginScreen";
import StaffLoginScreen from "./StaffLoginScreen";
import MainTabs from "./MainTabs";
import ProductScreen from "./ProductScreen";
import CheckoutScreen from "./CheckoutScreen";
import DispatcherManagerScreen from "./DispatcherManagerScreen";
import FinanceControllerScreen from "./FinanceControllerScreen";
import ServiceManagerScreen from "./ServiceManagerScreen";
import StockManagementScreen from "./StockManagementScreen";
import TechnicianScreen from "./TechnicianScreen";
import SupervisorScreen from "./SupervisorScreen";
import ForgotPassword from "./ForgotPassword";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { Button } from '~/components/ui/button';

export default function RootLayout({navigation}: any) {
  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  let fontSize = 24;
  let paddingVertical = 6;

  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }

      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={DARK_THEME}>
      <StatusBar style={"light"} />
      <EmailProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="ServiceManagerScreen"
            component={ServiceManagerScreen}
            // options={{ headerShown: true, headerTitle: "" }}
          />
          <Stack.Screen
            name="FinanceControllerScreen"
            component={FinanceControllerScreen}
            // options={{ headerShown: true, headerTitle: "" }}
          />
          <Stack.Screen
            name="DispatcherManagerScreen"
            component={DispatcherManagerScreen}
            // options={{ headerShown: true, headerTitle: "" }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            // options={{ headerShown: true, headerTitle: "" }}
          />
          <Stack.Screen
            name="StaffLoginScreen"
            component={StaffLoginScreen}
            // options={{ headerShown: true, headerTitle: "" }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: true, headerTitle: "" }}
          />
          <Stack.Screen
            name="SignupScreen"
            component={SignupScreen}
            options={{
              headerShown: true,
              headerTitleAlign: "left",
              headerTitle: () => (
                <P
                  onPress={() => router.push("/LoginScreen")}
                  className="text-white"
                >
                  Back
                </P>
              ),
            }}
          />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="ProductScreen" component={ProductScreen} />
          <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
          <Stack.Screen
            name="TechnicianScreen"
            component={TechnicianScreen}
            // options={{ headerShown: true, headerTitle: "" }}
          />
          <Stack.Screen
            name="SupervisorScreen"
            component={SupervisorScreen}
            // options={{ headerShown: true, headerTitle: "" }}
          />
          <Stack.Screen
            name="StockManagementScreen"
            component={StockManagementScreen}
            // options={{ headerShown: true, headerTitle: "" }}
          />
        </Stack.Navigator>
      </EmailProvider>
      <PortalHost />
      <FlashMessage position="top" />
    </ThemeProvider>
  );
}
