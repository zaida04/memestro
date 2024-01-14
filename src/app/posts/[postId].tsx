import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import CommentCount from "~/components/post/CommentCount";
import ShareButton from "~/components/post/ShareButton";
import UpvoteCount from "~/components/post/UpvoteCount";

export default function PostPage() {
    const { postId } = useLocalSearchParams();
    const router = useRouter();

    return <View className="w-screen h-screen">
        <View className="flex flex-col justify-between h-[91vh]">
            <View className="pt-14 pb-6 px-4 bg-black">
                <TouchableOpacity onPress={() => router.back()}>
                    <View className="flex flex-row gap-2 items-center" >
                        <Feather name="arrow-left" size={24} color="white" />
                        <Text className="text-white">Back</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View>
                <Image
                    style={{
                        width: "100%",
                        height: 300
                    }}
                    source={{
                        uri: "https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg"
                    }} />
            </View>

            <View className="w-full flex flex-row justify-center items-center bg-black py-6">
                <View className="flex flex-row">
                    <UpvoteCount darkMode={true} extendClassName="mr-12" upvotes={10} />
                    <CommentCount darkMode={true} extendClassName="mr-14" comments={5} />
                    <ShareButton darkMode={true} />
                </View>
            </View>
        </View>
    </View>
}