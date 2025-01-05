import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin, Clock, Package, ListTodo } from 'lucide-react-native';
import { H3, H4, H5, P } from './ui/typography';
import { formatDate } from '~/lib/format-date';
import { formatTime } from '~/lib/format-time';
import { Button } from './ui/button';
import { DispatchDetails } from './sheets/dispatchDetails';

type DispatchCardProps = {
  dispatch: any;
  onViewDetails: (orderId: number) => void;
};

export const DispatchCard: React.FC<DispatchCardProps> = ({ dispatch, onViewDetails }) => {
  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <View className="flex-row justify-between w-full relative overflow-clip">
        <View className="flex-row items-center mb-1">
          <H3 className="text-xl text-gray-600">
            {formatDate(dispatch.dispatch_date)}
          </H3>
        </View>
        <View className="flex items-start absolute right-[-14px] top-[-14px]">
          <TouchableOpacity
            className={`p-2 px-4 rounded-bl-lg rounded-tr-lg flex-row items-center w-auto ${
              dispatch.status === "pending" ? "bg-orange-300" : "bg-green-300"
            }`}
          >
            <ListTodo
              color={`${dispatch.status === "pending" ? "#9a3412" : "#166534"}`}
              size={19}
            />
            <H5
              className={`${
                dispatch.status === "pending"
                  ? "text-orange-900"
                  : "text-green-900"
              } ml-2 text-base capitalize`}
            >
              {dispatch.status}
            </H5>
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
        <DispatchDetails
          sheetTrigger={
            <Button
              disabled={dispatch.status === "delivered" ? true : false}
              className="rounded-full border-2 border-black bg-transparent disabled:opacity-50"
              size={"lg"}
              variant="default"
            >
              <H5 className=" text-black">{"Decline"}</H5>
            </Button>
          }
          action="decline"
          dispatch={dispatch}
        />
        <DispatchDetails
          sheetTrigger={
            <Button
              disabled={dispatch.status === "delivered" ? true : false}
              className="rounded-full flex-1 bg-green-800 disabled:bg-green-400"
              size={"lg"}
              variant="default"
            >
              <H5 className=" text-white">{"Accept"}</H5>
            </Button>
          }
          action="accept"
          dispatch={dispatch}
        />
      </View>
    </View>
  );
};

