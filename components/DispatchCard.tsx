import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin, Clock, Package, ListTodo } from 'lucide-react-native';
import { H3, H4, H5, P } from './ui/typography';
import { formatDate } from '~/lib/format-date';
import { formatTime } from '~/lib/format-time';
import { Button } from './ui/button';

type DispatchCardProps = {
  dispatch: any;
  onViewDetails: (orderId: number) => void;
};

export const DispatchCard: React.FC<DispatchCardProps> = ({ dispatch, onViewDetails }) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-sm p-4 mb-4"
      onPress={() => onViewDetails(dispatch.order_id)}
    >
      <View className="flex-row justify-between w-full relative overflow-clip">
        <View className="flex-row items-center mb-1">
          <H3 className="text-xl text-gray-600">
            {formatDate(dispatch.dispatch_date)}
          </H3>
        </View>
        <View className="flex items-start absolute right-[-14px] top-[-14px]">
          <TouchableOpacity
            className={`p-2 px-4 rounded-bl-lg rounded-tr-lg flex-row items-center w-auto bg-orange-300`}
          >
            <ListTodo color="#ea580c" size={19} />
            <P className="text-orange-600"> {"Pending"} </P>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row items-center mb-1">
        <P className="text-sm text-gray-600">
          {formatTime(dispatch.dispatch_date)}
        </P>
      </View>
      <View className="mb-6">
        <H3 className="text-lg text-gray-600" numberOfLines={1}>
          {dispatch.order.product.name}
        </H3>
        <P className="text-base text-gray-600" numberOfLines={1}>
          {dispatch.order.product.description}
        </P>
      </View>

      <View className="flex-row gap-4 w-full justify-between">
        <Button
          // onPress={handleBackStep}
          className="rounded-full border-2 border-black bg-transparent"
          size={"lg"}
          variant="default"
          disabled
        >
          <H5 className=" text-black">&larr; {" Decline"}</H5>
        </Button>
        <Button
          // onPress={handleShippingSubmit}
          className="rounded-full flex-1 bg-green-800"
          size={"lg"}
          variant="default"
        >
          <H5 className=" text-white">{"Accept"}</H5>
        </Button>
      </View>
    </TouchableOpacity>
  );
};

