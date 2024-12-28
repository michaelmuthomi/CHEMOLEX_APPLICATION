import { Link } from "expo-router";
import React, { useCallback, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { H1, H2, H3, H4, P } from "~/components/ui/typography";
import { Separator } from "~/components/ui/separator";
import { Feedback } from "~/components/sheets/feedback";
import { AboutUs } from "~/components/sheets/aboutus";
import { ContactUs } from "~/components/sheets/contactus";
import { showMessage } from "react-native-flash-message";

const SettingsPage = () => {
  return (
    <View className=" bg-[#060606] flex-1 pt-20 px-6 gap-10">
      <View className="flex justify-center">
        <H1
          className="capitalize color-white"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Settings
        </H1>
      </View>
      <ScrollView>
        <View className="flex-1">
          <ContactUs
            sheetTrigger={
              <TouchableOpacity className="flex-row w-full items-center">
                <H4>Contact us </H4>
                <P className="ml-auto">&rarr;</P>
              </TouchableOpacity>
            }
          />
          <Separator className="my-6 bg-zinc-900" />
          <AboutUs
            sheetTrigger={
              <TouchableOpacity className="flex-row w-full items-center">
                <H4>About us </H4>
                <P className="ml-auto">&rarr;</P>
              </TouchableOpacity>
            }
          />
          <Separator className="my-6 bg-zinc-900" />
          <Feedback
            sheetTrigger={
              <TouchableOpacity className="flex-row w-full items-center">
                <H4>Send us Feedback</H4>
                <P className="ml-auto">&rarr;</P>
              </TouchableOpacity>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    padding: 36,
    alignItems: "center",
  },
});

export default SettingsPage;
