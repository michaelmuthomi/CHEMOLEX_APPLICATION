import { BottomSheetView } from "@gorhom/bottom-sheet";
import { H3, H5, P } from "../ui/typography";
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
import { checkUser, submitFeedback } from "~/lib/supabase";
import { useEmail } from "~/app/EmailContext";

export function Feedback({ sheetTrigger }: { sheetTrigger: React.ReactNode }) {
  const [loading, setLoading] = React.useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [value, setValue] = React.useState("Comfortable");
  const [message, setMessage] = React.useState("");

  const [customer, setCustomerDetails] = useState([]);
  const emailContext = useEmail();

  React.useEffect(() => {
    async function fetchUserDetails() {
      const response = await checkUser(emailContext?.email);
      setCustomerDetails(response);
    }
    fetchUserDetails();
  }, []);

  // Function to handle present modal
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleFeedBack = async () => {
    // Make sure to also collect order_id and comments
    const order_id = 1; // This should be dynamically defined based on your application's context
    const comments = message; // Using the message state as comments

    // Validate input fields
    if (customer.user_id && selectedEmoji && comments) {
      const feedback = {
        user_id: customer.user_id, // user ID from the customer details
        rating: selectedEmoji, // rating based on selected emoji
        comments: comments, // comments collected from the textarea
      };

      const response = await submitFeedback(feedback); // Submit the feedback

      console.log("Response output: ", response)

      if (response?.startsWith("error")) {
        console.error("Error submitting feedback:", response);
        showMessage({
          message: "Error submitting feedback",
          type: "danger",
        });
        return;
      } else {
        // Optionally show a success message or further process response data
        showMessage({
          message: "Thanks for the feedback",
          type: "success",
        });
        bottomSheetModalRef.current?.dismiss();
        return;
      }
    } else {
      showMessage({
        message: "Please fill in all the fields",
        type: "danger",
      });
    }
  }

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
                      className="sr-only h-max"
                      onValueChange={function (val: string): void {
                        throw new Error("Function not implemented.");
                      }}
                    />
                    <TouchableOpacity onPress={() => setSelectedEmoji(item.id)}>
                      <View
                        className={`transform ${
                          isSelected ? "scale-150" : "scale-100"
                        } transition-transform duration-200`}
                      >
                        <P
                          className={`text-2xl ${
                            isSelected ? "text-4xl shadow-2xl" : "text-2xl opacity-30"
                          }`}
                        >
                          {item.emoji}
                        </P>
                      </View>
                    </TouchableOpacity>
                    {isSelected && (
                      <View className="mt-2">
                        <H5 className="text-xs font-medium text-zinc-200 px-3 py-4 rounded-full">
                          {item.label}
                        </H5>
                      </View>
                    )}
                  </View>
                );
              })}
            </RadioGroup>

            {/* Comment Input */}
            <Textarea
              className="rounded-xl p-4 mb-6 min-h-[100px] !bg-transparent"
              placeholder="Please tell us more"
              onChangeText={setMessage}
            />

            {/* Submit Button */}
            <Button
              onPress={handleFeedBack}
              className="w-full rounded-full"
              size={"lg"}
              variant="default"
              disabled={loading}
            >
              <H5 className=" text-black">
                {loading ? "Thanks for your feedback" : "Submit Feedback"}
              </H5>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}