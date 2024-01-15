import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { cn } from "~/utils/cn";

export default function UpvoteCount(props: { extendClassName?: string; darkMode?: boolean; upvotes: number }) {
	return (
		<View className={cn("flex flex-row items-center", props.extendClassName)}>
			<Text className={props.darkMode ? "text-white" : ""}>{props.upvotes}</Text>
			<Feather name="arrow-up" color={props.darkMode ? "white" : "black"} size={25} />
		</View>
	);
}
