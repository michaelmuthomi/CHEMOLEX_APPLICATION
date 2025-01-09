import { BottomSheetView } from "@gorhom/bottom-sheet";
import { H3, H5, P } from "../ui/typography";
import { useRef, useState, useEffect } from "react";
import { H4 } from "../ui/typography";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as React from "react";
import { useCallback } from "react";
import { ScrollView, View, Image, TouchableOpacity } from "react-native";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import displayNotification from "~/lib/Notification";
import {
  Box,
  Coins,
  Group,
  ImageIcon,
  ShieldCloseIcon,
  SquareStack,
} from "lucide-react-native";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchServiceDetails, fetchSuppliers, insertNewProductToDB, supabase } from "~/lib/supabase";
import { Value } from "@rn-primitives/select";
import { formatPrice } from "~/lib/format-price";

interface Supplier {
  user_id: Number;
  full_name: string;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View className="mb-4">
    <H5 className="text-sm text-gray-600 mb-1">{label}</H5>
    <H5 className="text-base text-white">{value}</H5>
  </View>
);

type ProductDetailsModalProps = {
  product: any;
  onUpdateStock: (productId: number, newStock: number) => void;
};

export function ServiceModal({
  sheetTrigger,
  serviceId,
}: {
  sheetTrigger: React.ReactNode;
  serviceId: any;
}) {

  console.log('Service ID: ', serviceId )

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [serviceDetails, setServiceDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServiceDetails = async () => {
      setLoading(true);
      try {
        const details = await fetchServiceDetails(Number(serviceId));
        console.log('Service details: ', details)
        setServiceDetails(details);
      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setLoading(false);
      }
    };

      loadServiceDetails();
  }, [serviceId]);

  async function handleBookService() {
    
  }

  return (
    <>
      {React.cloneElement(sheetTrigger as React.ReactElement, {
        onPress: () => bottomSheetModalRef.current?.present(),
      })}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backgroundStyle={{ backgroundColor: "#111" }}
        handleIndicatorStyle={{ backgroundColor: "white" }}
      >
        <BottomSheetView className="p-6 gap-6">
          <View>
            <H3 className="text-2xl">{serviceDetails?.name}</H3>
            <P className="text-base text-gray-400">
              {serviceDetails?.description}
            </P>
            <View className="mt-6 w-full">
              <H5 className="text-sm text-white mb-2">{"Service type"}</H5>
              <H3 className="text-base w-auto p-2 px-4 bg-green-300 text-green-900 leading-0 capitalize">
                {serviceDetails?.service_type}
              </H3>
            </View>
            <View className="flex-row gap-6 w-full justify-between mt-20">
              <Button
                className="rounded-full p-0 bg-transparent"
                size={"lg"}
                variant="default"
                disabled
              >
                <H5 className=" text-white">Ksh {serviceDetails?.price}</H5>
              </Button>
              <Button
                onPress={handleBookService}
                className="rounded-full flex-1"
                size={"lg"}
                variant="default"
              >
                <H5 className="text-black">{"Book Now"}</H5>
              </Button>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
