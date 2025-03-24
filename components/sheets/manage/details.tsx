import { BottomSheetView } from "@gorhom/bottom-sheet";
import { H3, H5, P } from "~/components/ui/typography";
import { useRef } from "react";
import { H4 } from "~/components/ui/typography";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as React from "react";
import { useCallback } from "react";
import { ActivityIndicator, Linking, ScrollView, View } from "react-native";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import displayNotification from "~/lib/Notification";
import { Mail, MapPinIcon, Phone, User } from "lucide-react-native";
import { useEmail } from "~/app/EmailContext";
import { checkUser } from "~/lib/supabase";

export function ManageDetails({
  sheetTrigger,
}: {
  sheetTrigger: React.ReactNode;
}) {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const inputRef = useRef<Textarea>(null);
  const [loading, setLoading] = React.useState(false);
  const [customer, setCustomerDetails] = React.useState<{
    name?: string;
    email?: string;
    phonenumber?: string;
    address?: string;
  }>({});
  const emailContext = useEmail();
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    async function fetchUserDetails() {
      if (!emailContext?.email) return;
      const response = await checkUser(emailContext.email);
      setCustomerDetails(response);
    }
    fetchUserDetails();
  }, [emailContext]);

  const handleSavecustomer = () => {
    // TODO: Implement API call to save user info
    displayNotification("Profile updated successfully", "success");
    setIsEditing(false);
  };

  async function handleContactUs() {
    if (email && message) {
      displayNotification("We will get back to you soon", "success");
      bottomSheetModalRef.current?.dismiss();
      return;
    }
    displayNotification("Please fill in all the fields", "danger");
  }

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
      >
        <BottomSheetView className="p-6 gap-6">
          {/* Title and Subtitle */}
          <View className=" mb-8">
            <H3 className="text-2xl mb-2 text-white">
              Manage Personal details
            </H3>
            <P className="text-gray-500 ">Edit your profile details below</P>
          </View>
          <View className="py-2">
            <ScrollView className="gap-6 py-4">
              <View className="gap-4">
                <View className="flex-row">
                  <View className="gap-2 w-1/2 pr-2">
                    <H5 className="text-white">First Name</H5>
                    <View
                      className={`
                  flex-row items-center rounded-md
                  ${isEditing ? "border-[1px]" : "border-0"}
                `}
                    >
                      <User size={14} color={isEditing ? "white" : "gray"} />
                      <Input
                        placeholder="First Name"
                        value={customer.name ? customer.name.split(" ")[0] : ""}
                        onChangeText={(text) => {
                          const lastName = customer.name
                            .split(" ")
                            .slice(1)
                            .join(" ");
                          setCustomerDetails({
                            ...customer,
                            name: text + (lastName ? " " + lastName : ""),
                          });
                        }}
                        editable={isEditing}
                        className={
                          !isEditing
                            ? "bg-transparent border-0 flex-1 text-white"
                            : "border-0 flex-1 text-white"
                        }
                      />
                    </View>
                  </View>

                  <View className="gap-2 w-1/2">
                    <H5 className="text-white">Last Name</H5>
                    <View
                      className={`
                  flex-row items-center rounded-md
                  ${isEditing ? "border-[1px]" : "border-0"}
                `}
                    >
                      <User size={14} color={isEditing ? "white" : "gray"} />
                      <Input
                        placeholder="Last Name"
                        value={
                          customer.name
                            ? customer.name.split(" ").slice(1).join(" ")
                            : ""
                        }
                        onChangeText={(text) => {
                          const firstName = customer.name.split(" ")[0];
                          setCustomerDetails({
                            ...customer,
                            name: firstName + (text ? " " + text : ""),
                          });
                        }}
                        editable={isEditing}
                        className={
                          !isEditing
                            ? "bg-transparent border-0 flex-1 text-white"
                            : "border-0 flex-1 text-white"
                        }
                      />
                    </View>
                  </View>
                </View>

                <View className="gap-2">
                  <H5 className="text-white">Email</H5>
                  <View
                    className={`
                  flex-row items-center rounded-md
                  ${isEditing ? "border-[1px]" : "border-0"}
                `}
                  >
                    <Mail size={14} color={isEditing ? "white" : "gray"} />
                    <Input
                      placeholder="Email"
                      value={customer.email}
                      onChangeText={(text) =>
                        setCustomerDetails({ ...customer, email: text })
                      }
                      keyboardType="email-address"
                      editable={isEditing}
                      className={
                        !isEditing
                          ? "bg-transparent border-0 flex-1 text-white"
                          : "border-0 flex-1 text-white"
                      }
                    />
                  </View>
                </View>

                <View className="gap-2">
                  <H5 className="text-white">Phone Number</H5>
                  <View
                    className={`
                  flex-row items-center rounded-md
                  ${isEditing ? "border-[1px]" : "border-0"}
                `}
                  >
                    <Phone size={14} color={isEditing ? "white" : "gray"} />
                    <Input
                      placeholder="Phone"
                      value={customer.phonenumber}
                      onChangeText={(text) =>
                        setCustomerDetails({ ...customer, phonenumber: text })
                      }
                      keyboardType="phone-pad"
                      editable={isEditing}
                      className={
                        !isEditing
                          ? "bg-transparent border-0 flex-1 text-white"
                          : "border-0 flex-1 text-white"
                      }
                    />
                  </View>
                </View>

                <View className="gap-2">
                  <H5 className="text-white">Address</H5>
                  <View
                    className={`
                  flex-row items-center rounded-md
                  ${isEditing ? "border-[1px]" : "border-0"}
                `}
                  >
                    <MapPinIcon
                      size={14}
                      color={isEditing ? "white" : "gray"}
                    />
                    <Input
                      placeholder="Address"
                      value={customer.address === "" ? "N/A" : customer.address}
                      onChangeText={(text) =>
                        setCustomerDetails({ ...customer, address: text })
                      }
                      editable={isEditing}
                      className={
                        !isEditing
                          ? "bg-transparent border-0 flex-1 text-white"
                          : "border-0 flex-1 text-white"
                      }
                    />
                  </View>
                </View>

                <View className="space-y-4 pt-4">
                  {isEditing ? (
                    <View className="flex-row w-full gap-4 justify-between">
                      <Button
                        variant="outline"
                        onPress={() => setIsEditing(false)}
                        size={"lg"}
                        className="rounded-full bg-red-400 !py-4 !border-none w-max"
                      >
                        <H5 className="!leading-0 text-black">&larr; Cancel</H5>
                      </Button>
                      <Button
                        variant="outline"
                        onPress={handleSavecustomer}
                        size={"lg"}
                        className="rounded-full bg-white !py-4 !border-none flex-1"
                      >
                        <H5 className="!leading-none text-black ">
                          Save Changes
                        </H5>
                      </Button>
                    </View>
                  ) : (
                    <Button
                      variant="outline"
                      size={"lg"}
                      className="rounded-full bg-white !py-4 !border-none"
                      onPress={() => setIsEditing(true)}
                    >
                      <H5 className="text-black leading-none">Edit Profile</H5>
                    </Button>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
