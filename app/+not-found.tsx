import { Link, Stack } from "expo-router";
import { View, Image } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H1, P } from "~/components/ui/typography";
import { useNavigation } from "@react-navigation/native";

export default function NotFoundScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center">
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="p-4 mt-10 gap-6">
        <Image
          source={require("../assets/images/404.png")}
          className="w-full h-1/2 rounded-lg"
          resizeMode="cover"
        />
        <View>
          <H1 className="!text-6xl">Oops!</H1>
          <H1 className="text-zinc-500">
            We couldn't find the page you were looking for
          </H1>
        </View>
        <Button
          className="flex-row items-center gap-2 rounded-full bg-white"
          onPress={() => navigation.goBack()}
        >
          <P className="text-black">&larr; Go Back</P>
        </Button>
      </View>
    </View>
  );
}
