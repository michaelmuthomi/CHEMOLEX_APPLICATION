import { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { P } from "../ui/typography";
import { useRef } from "react";
import { H4 } from "../ui/typography";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as React from "react";
import { useCallback } from "react";
import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { faqs, foundersData } from "~/data/aboutUsData";

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
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            pressBehavior="none" // Manage how backdrop should behave on press
            opacity={0.5} // Adjust the opacity of the backdrop
          />
        )}
      >
        <BottomSheetView className="p-6 gap-6">
          <View>
            <H4 className="" style={{ fontFamily: "Inter_700Bold" }}>
              Get to Know Us
            </H4>
            <P>
              GJENGE - We help you Build Alternatively, Affordably and
              Sustainably.
            </P>
          </View>
          <Accordion
            type="multiple"
            collapsible
            defaultValue={["item-1"]}
            className="w-full max-w-sm native:max-w-md"
          >
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger>
                  <P>{faq.question}</P>
                </AccordionTrigger>
                <AccordionContent>
                  <P>{faq.answer}</P>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <View>
            <H4 className="" style={{ fontFamily: "Inter_700Bold" }}>
              Meet the team making this happen
            </H4>
          </View>
          <View className="gap-2">
            {foundersData.map((member, index) => (
              <TeamShowcase
                key={index}
                image_url={member.image_url}
                fallback={member.fallback}
                name={member.name}
                position={member.position}
              />
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

export function TeamShowcase({
  image_url,
  fallback,
  name,
  position,
}: {
  image_url: string;
  fallback: string;
  name: string;
  position: string;
}) {
  return (
    <View className="flex-row items-center gap-4">
      <Avatar alt="CEO IMAGE">
        <AvatarImage
          source={{
            uri: image_url,
          }}
        />
        <AvatarFallback>
          <H4>{fallback}</H4>
        </AvatarFallback>
      </Avatar>
      <View>
        <H4 style={{fontFamily: "Inter_500Medium"}}>{name}</H4>
        <P className="text-xs">{position}</P>
      </View>
    </View>
  );
}