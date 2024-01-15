import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";

export default function Topbar(props: { title?: string }) {
    const router = useRouter();

    const BackButton = () => (
        <TouchableOpacity onPress={router.back}>
            <View className="flex flex-row gap-2 items-center pl-4">
                <Feather name="arrow-left" color="white" size={24} />
                <Text className="text-white">Back</Text>
            </View>
        </TouchableOpacity>
    );

    return <Stack.Screen options={{
        title: props.title ?? " ",
        headerLeft: () => <BackButton />,
        headerStyle: { backgroundColor: "black" }
    }} />
    // return <View className="pt-14 pb-6 px-4 bg-black">
    //     <TouchableOpacity onPress={() => router.back()}>
    //         <View className="flex flex-row gap-2 items-center" >
    //             <Feather name="arrow-left" size={24} color="white" />
    //             <Text className="text-white">Back</Text>
    //         </View>
    //     </TouchableOpacity>
    // </View>
}