import { Feather } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { Link } from "expo-router";
import { Image, Text, View } from "react-native";

interface PostOptions {
    title: string;
    description: string;
    image: string;
    upvotes: number;
    comments: number;
}
export default function Post(props: PostOptions) {
    return <Link href="/posts/blah" className="w-full active:bg-gray-200">
        <View className="w-full flex flex-row justify-between border border-gray-300 p-2">
            <View className="flex flex-row gap-2">
                <Image
                    style={{
                        width: 125,
                        height: 100,
                    }}
                    source={{
                        uri: props.image
                    }}
                />
                <View className="flex flex-col">
                    <Text className="font-semibold">{props.title}</Text>
                    <Text className="text-gray-600 text-xs">
                        {props.description}
                    </Text>
                </View>
            </View>
            <View className="flex flex-col gap">
                <View className="flex flex-row gap-2 items-center">
                    <Text>
                        {props.upvotes}
                    </Text>
                    <Feather name="arrow-up" size={25} />
                </View>
                <View className="flex flex-row gap-2 items-center">
                    <Text>
                        {props.comments}
                    </Text>
                    <FontAwesome name="comments" size={25} />
                </View>
            </View>
        </View>
    </Link>
}