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
            <H3 className="text-xl">{serviceDetails.name}</H3>
            <P className="text-sm">{serviceDetails.description}</P>
            <P className="text-base">Price: {serviceDetails.price}</P>
            <Button onPress={handleBookService} className="mt-4">
              <P className="text-white">Book Now</P>
            </Button>
            <TouchableOpacity className="mt-4">
              <P className="text-blue-500">Close</P>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
