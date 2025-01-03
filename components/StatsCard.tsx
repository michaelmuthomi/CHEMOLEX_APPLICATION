import { GalleryVertical } from "lucide-react-native"; // Ensure this is the correct import
import { TouchableOpacity, View } from "react-native";
import { H4, P } from "./ui/typography";

interface StatsCardProps {
  iconBgColor?: string;
  Icon: React.ReactNode;
  Title?: string;
  Description?: string;
  onStatPress?: any;
  statChartStyles?: any;
}

const StatsCard: React.FC<StatsCardProps> = ({
  iconBgColor = "bg-blue-600",
  Icon,
  Title = "Set Title",
  Description = "Set Description",
  onStatPress,
  statChartStyles,
}) => {
  return (
    <TouchableOpacity
      className="gap-4 w-1/2"
      onPress={onStatPress}
      style={statChartStyles}
    >
      <View className="flex items-start">
        <TouchableOpacity className={`p-2 rounded-full w-auto ${iconBgColor}`}>
          {Icon}
        </TouchableOpacity>
      </View>
      <View>
        <H4 className="text-black">{Title}</H4>
        <P className="text-zinc-400">{Description}</P>
      </View>
    </TouchableOpacity>
  );
};
export default StatsCard;
