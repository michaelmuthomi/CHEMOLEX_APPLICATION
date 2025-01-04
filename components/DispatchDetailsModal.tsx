import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import { X, MapPin, Package, Calendar } from "lucide-react-native";

type DispatchDetailsModalProps = {
  visible: boolean;
  dispatch: any | null;
  onClose: () => void;
  onUpdateStatus: (orderId: number, newStatus: AsyncGenerator) => void;
};

export const DispatchDetailsModal: React.FC<DispatchDetailsModalProps> = ({
  visible,
  dispatch,
  onClose,
  onUpdateStatus,
}) => {
  if (!dispatch) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white rounded-t-3xl p-6 h-5/6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold">Dispatch Details</Text>
            <TouchableOpacity onPress={onClose}>
              <X className="w-6 h-6 text-gray-500" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <DetailItem label="Order ID" value={`#${dispatch.order_id}`} />
            <DetailItem label="Status" value={dispatch.status} />
            <DetailItem
              label="Tracking Number"
              value={dispatch.tracking_number}
            />
            <View className="flex-row items-center mb-2">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <Text className="text-base text-gray-800">
                {new Date(dispatch.dispatch_date).toLocaleString()}
              </Text>
            </View>
            <View className="flex-row items-center mb-2">
              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
              <Text className="text-base text-gray-800">
                {dispatch.delivery_address}
              </Text>
            </View>
            <View className="flex-row items-center mb-4">
              <Package className="w-4 h-4 text-gray-400 mr-2" />
              <Text className="text-base text-gray-800">
                {dispatch.tracking_number}
              </Text>
            </View>

            <Text className="text-lg font-bold mt-4 mb-2">
              Delivery Location
            </Text>
            {/* <Image
              source={require("../assets/map-placeholder.png")}
              className="w-full h-48 rounded-lg mb-4"
            /> */}

            {dispatch.status !== "Delivered" && (
              <TouchableOpacity
                className="bg-green-500 py-3 px-4 rounded-lg mt-4"
                onPress={() => onUpdateStatus(dispatch.order_id, "Delivered")}
              >
                <Text className="text-white text-center font-semibold">
                  Mark as Delivered
                </Text>
              </TouchableOpacity>
            )}
            {dispatch.status === "Pending" && (
              <TouchableOpacity
                className="bg-blue-500 py-3 px-4 rounded-lg mt-4"
                onPress={() => onUpdateStatus(dispatch.order_id, "In Transit")}
              >
                <Text className="text-white text-center font-semibold">
                  Start Delivery
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View className="mb-2">
    <Text className="text-sm text-gray-600 mb-1">{label}</Text>
    <Text className="text-base text-gray-800">{value}</Text>
  </View>
);
