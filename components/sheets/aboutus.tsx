import { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { H3, H6, P } from "../ui/typography";
import { useRef } from "react";
import { H4 } from "../ui/typography";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as React from "react";
import { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { faqs, foundersData } from "~/data/aboutUsData";
import { ContactUs } from "./contactus";

export function AboutUs({ sheetTrigger }: { sheetTrigger: React.ReactNode }) {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <>
      {React.cloneElement(sheetTrigger as React.ReactElement, {
        onPress: handlePresentModalPress,
      })}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: "#0e0e0e" }}
        handleIndicatorStyle={{ backgroundColor: "white" }}
        enableDismissOnClose
      >
        <BottomSheetView className="p-6 gap-6">
          <View className="items-center">
            <H3 className="text-center text-2xl">Get to Know Us</H3>
            <P className="text-center text-gray-500">
              Our goal is to become the number one air conditioning (HVAC)
              contractor in Kenya and entire East Africa.
            </P>
          </View>
          <Accordion
            type="multiple"
            collapsible
            defaultValue={["item-1"]}
            // className="w-full max-w-sm native:max-w-md"
          >
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger>
                  <H6>{faq.question}</H6>
                </AccordionTrigger>
                <AccordionContent>
                  <P>{faq.answer}</P>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <View className="gap-2">
            <H3>Got any questions?</H3>
            <P className="text-zinc-200 text-sm w-3/5">
              Send us a message and we will get back to you as soon as possible
            </P>
          </View>
          <View className="gap-4">
            <ContactUs
              sheetTrigger={
                <TouchableOpacity className="flex-row w-full items-center">
                  <P>Reach out </P>
                  <P className="ml-auto">&rarr;</P>
                </TouchableOpacity>
              }
            />
            <ContactUs
              sheetTrigger={
                <TouchableOpacity className="flex-row w-full items-center">
                  <P>Send us Feedback </P>
                  <P className="ml-auto">&rarr;</P>
                </TouchableOpacity>
              }
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}