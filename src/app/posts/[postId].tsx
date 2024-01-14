import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function PostPage() {
    const { postId } = useLocalSearchParams();
    const router = useRouter();

    return <View>
        <Text>Post Page {postId}</Text>
    </View>
}