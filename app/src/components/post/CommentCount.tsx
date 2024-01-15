import { FontAwesome } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { cn } from "~/utils/cn";

export default function CommentCount(props: { extendClassName?: string; darkMode?: boolean; comments: number }) {
    return <View className={cn("flex flex-row gap-2 items-center", props.extendClassName)}>
        <Text className={props.darkMode ? "text-white" : ""}>
            {props.comments}
        </Text>
        <FontAwesome name="comments" color={props.darkMode ? "white" : "black"} size={25} />
    </View>
}