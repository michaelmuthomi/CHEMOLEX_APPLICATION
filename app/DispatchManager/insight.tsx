import { View, Text, StyleSheet, ScrollView } from "react-native";
import { H1 } from "~/components/ui/typography";

export default function Tab() {
  return (
    <View className=" bg-[#060606] flex-1 pt-20 px-6 gap-10">
      <View className="flex justify-center">
        <H1
          className="capitalize color-white"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Insights
        </H1>
      </View>
    </View>
  );
}
