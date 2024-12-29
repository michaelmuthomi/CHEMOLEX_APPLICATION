import { BottomSheetView } from "@gorhom/bottom-sheet";
import { H3, P } from "../ui/typography";
import { useRef, useState } from "react";
import { H4 } from "../ui/typography";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as React from "react";
import { useCallback } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "../ui/button";
import { showMessage } from "react-native-flash-message";
import { Input } from "../ui/input";


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

    const emojis = [
      { id: 1, emoji: "😢", label: "Help Needed" },
      { id: 2, emoji: "😕", label: "Room for Improvement" },
      { id: 3, emoji: "😐", label: "It's Okay" },
      { id: 4, emoji: "🙂", label: "Happy Customer" },
      { id: 5, emoji: "🤗", label: "Delighted!" },
    ];

    const [selectedEmoji, setSelectedEmoji] = useState(3);
    const [comment, setComment] = useState("");

  return (
    <>
      {React.cloneElement(sheetTrigger as React.ReactElement, {
        onPress: handlePresentModalPress,
      })}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={["50%"]}
        backgroundStyle={{ backgroundColor: "#0e0e0e" }}
        handleIndicatorStyle={{ backgroundColor: "white" }}
        onDismiss={() => setValue("Comfortable")} // Reset on dismiss
      >
        <BottomSheetView className="p-6 gap-6">
          <View className="rounded-t-3xl">
            {/* Title and Subtitle */}
            <View className="items-center mb-8">
              <H3 className="text-2xl mb-2">How are you feeling?</H3>
              <P className="text-gray-500 text-center">
                Your input is valuable in helping us better understand your
                needs and tailor our service accordingly.
              </P>
            </View>

            {/* Emoji Selection */}
            <RadioGroup
              value={selectedEmoji.toString()}
              onValueChange={(value) => setSelectedEmoji(Number(value))}
              className="flex-row justify-between mb-8"
            >
              {emojis.map((item) => {
                const isSelected = selectedEmoji === item.id;
                return (
                  <View key={item.id} className="items-center">
                    <RadioGroup
                      value={item.id.toString()}
                      className="sr-only" onValueChange={function (val: string): void {
                        throw new Error("Function not implemented.");
                      } }                    />
                    <TouchableOpacity onPress={() => setSelectedEmoji(item.id)}>
                      <View
                        
                        style={{
                          transform: [{ scale: isSelected ? 1.5 : 1 }],
                        }}
                      >
                        <P
                          className={`text-2xl ${isSelected ? "text-3xl" : ""}`}
                        >
                          {item.emoji}
                        </P>
                      </View>
                    </TouchableOpacity>
                    {isSelected && (
                      <View className="mt-2">
                        <P className="text-sm font-medium text-white px-3 py-1 rounded-full">
                          {item.label}
                        </P>
                      </View>
                    )}
                  </View>
                );
              })}
            </RadioGroup>

            {/* Comment Input */}
            <Textarea
              className="bg-gray-50 rounded-xl p-4 mb-6 min-h-[100px]"
              placeholder="Add a Comment..."
              multiline
              value={comment}
              onChangeText={setComment}
            />

            {/* Submit Button */}
            <Button
              className="bg-green-500 py-4 rounded-xl"
              onPress={() => {
                /* Handle submit */
              }}
            >
              <P className="text-white text-center font-semibold">Submit Now</P>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}