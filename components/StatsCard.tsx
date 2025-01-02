import { GalleryVertical } from "lucide-react-native"; // Ensure this is the correct import
import { View } from "react-native";
import { H4, P } from "./ui/typography";

interface StatsCardProps {
  iconBgColor?: string; // Made optional
  Icon: React.ReactNode; // Changed to React.ReactNode
  Title?: string; // Made optional
  Description?: string; // Made optional
}

const StatsCard: React.FC<StatsCardProps> = ({
  iconBgColor = "bg-blue-600", // Default value
  Icon,
  Title = "Set Title", // Default value
  Description = "Set Description", // Default value
}) => {
  return (
    <View className="gap-4 w-1/2">
      <View className="flex items-start">
        <View className={`p-2 rounded-full w-auto ${iconBgColor}`}>
          {Icon} {/* Ensure Icon is rendered here */}
        </View>
      </View>
      <View>
        <H4 className="text-black">{Title}</H4>
        <P className="text-zinc-400">{Description}</P>
      </View>
    </View>
  );
};
export default StatsCard;
