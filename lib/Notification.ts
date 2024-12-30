import { showMessage } from "react-native-flash-message";

export default function displayNotification(
  message: string,
  type: "danger" | "success" | "warning"
) {
  return showMessage({
    message,
    type,
    style: {
      paddingTop: 40,
    },
    titleStyle: {
      fontFamily: "Inter_500Medium",
      textAlign: "center",
    },
  });
}