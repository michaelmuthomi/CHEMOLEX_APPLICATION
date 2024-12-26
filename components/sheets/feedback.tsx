import { BottomSheetView } from "@gorhom/bottom-sheet";
import { P } from "../ui/typography";
import { useRef } from "react";
import { H4 } from "../ui/typography";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as React from "react";
import { useCallback } from "react";
import { ActivityIndicator, View } from "react-native";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "../ui/button";
import { showMessage } from "react-native-flash-message";

export function Feedback({ sheetTrigger }: { sheetTrigger: React.ReactNode }) {
  const [loading, setLoading] = React.useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [value, setValue] = React.useState("Comfortable");
  const [message, setMessage] = React.useState("");

  // Function to handle present modal
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleFeedBack = () => {
    if (value && message) {
      showMessage({
        message: "Thanks for the feedback",
        type: "success",
      });
      // Dismiss the modal after feedback
      bottomSheetModalRef.current?.dismiss();
      return;
    }

    showMessage({
      message: "Please fill in all the fields",
      type: "danger",
    });
  };

  return (
    <>
      {React.cloneElement(sheetTrigger as React.ReactElement, {
        onPress: handlePresentModalPress,
      })}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={['50%']}
        backgroundStyle={{ backgroundColor: "#0e0e0e" }}
        handleIndicatorStyle={{ backgroundColor: "white" }}
        onDismiss={() => setValue("Comfortable")} // Reset on dismiss
      >
        <BottomSheetView className="p-6 gap-6">
          <View>
            <H4 className="text-center" style={{ fontFamily: "Inter_700Bold" }}>
              How was your experience {"\n"} with the app?
            </H4>
            <P>
              State your experience interacting with the app and recommend improvements
            </P>
          </View>
          <View className="gap-4">
            <RadioGroup value={value} onValueChange={setValue} className="gap-3 flex-row">
              <RadioGroupItemWithLabel value="Bad" onLabelPress={() => setValue("Bad")} />
              <RadioGroupItemWithLabel value="Decent" onLabelPress={() => setValue("Decent")} />
              <RadioGroupItemWithLabel value="Love it!" onLabelPress={() => setValue("Love it!")} />
            </RadioGroup>
            <Textarea
              placeholder="Tell us more"
              value={message}
              onChangeText={setMessage}
              style={{ fontFamily: "Inter_500Medium" }}
            />
            <Button
              size={"lg"}
              variant={"default"}
              className="bg-[#66d46f] text-white rounded-full h-10"
              onPress={async () => {
                setLoading(true);
                handleFeedBack();
                setLoading(false);
              }}
            >
              {loading ? (
                <View className="flex flex-row gap-2">
                  <ActivityIndicator animating={true} color="black" />
                  <P className="text-base" style={{ fontFamily: "Inter_700Bold" }}>
                    Submitting...
                  </P>
                </View>
              ) : (
                <P className="text-base" style={{ fontFamily: "Inter_500Medium" }}>
                  Submit feedback
                </P>
              )}
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

function RadioGroupItemWithLabel({ value, onLabelPress }) {
  const emojiMap = {
    Bad: "😞",
    Decent: "🙂",
    "Love it!": "😍",
  };
  return (
    <View className="flex-row gap-2 flex-1 items-center p-2 background-color:white; border-radius:8px;">
      <RadioGroupItem
        value={value}
        aria-labelledby={`label-for-${value}`}
        style={{ display: "none" }}
      />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress} style={{ fontFamily: "Inter_500Medium", fontSize: 16 }}>
        {emojiMap[value]} {value}
      </Label>
    </View>
  );
}