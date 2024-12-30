import { Link, useNavigation } from "expo-router";
import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { H1, H2, H3, H4, P } from "~/components/ui/typography";
import { Separator } from "~/components/ui/separator";
import { Feedback } from "~/components/sheets/feedback";
import { AboutUs } from "~/components/sheets/aboutus";
import { ContactUs } from "~/components/sheets/contactus"
import { Contact, Info, SendToBack, User } from "lucide-react-native";

export default function SettingsScreen() {
  const navigation = useNavigation()
  return (
    <View className=" bg-[#060606] flex-1 p-6 gap-10">
      <ScrollView>
        <View className="flex-1">
          <TouchableOpacity className="flex-row w-full items-center gap-2" onPress={() => navigation.navigate('profile')}>
            <User size={16} color={"white"} />
            <H4 className="text-base">Account Information </H4>
            <P className="ml-auto">&rarr;</P>
          </TouchableOpacity>
          <Separator className="my-6 bg-zinc-900" />
          <ContactUs
            sheetTrigger={
              <TouchableOpacity className="flex-row w-full items-center gap-2">
                <Contact size={16} color={"white"} />
                <H4 className="text-base">Contact us </H4>
                <P className="ml-auto">&rarr;</P>
              </TouchableOpacity>
            }
          />
          <Separator className="my-6 bg-zinc-900" />
          <AboutUs
            sheetTrigger={
              <TouchableOpacity className="flex-row w-full items-center gap-2">
                <Info size={16} color={"white"} />
                <H4 className="text-base">About us </H4>
                <P className="ml-auto">&rarr;</P>
              </TouchableOpacity>
            }
          />
          <Separator className="my-6 bg-zinc-900" />
          <Feedback
            sheetTrigger={
              <TouchableOpacity className="flex-row w-full items-center gap-2">
                <SendToBack size={16} color={"white"} />
                <H4 className="text-base">Send us Feedback</H4>
                <P className="ml-auto">&rarr;</P>
              </TouchableOpacity>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};
