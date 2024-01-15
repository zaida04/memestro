import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";

export default function Topbar() {
    const router = useRouter();

    return <View className="pt-14 pb-6 px-4 bg-black">
        <TouchableOpacity onPress={() => router.back()}>
            <View className="flex flex-row gap-2 items-center" >
                <Feather name="arrow-left" size={24} color="white" />
                <Text className="text-white">Back</Text>
            </View>
        </TouchableOpacity>
    </View>
}