import { Feather } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";

interface CommentOptionsProps {
	upvotes: number;
	downvotes: number;
	content: string;
}
export default function Comment(props: CommentOptionsProps) {
	return (
		<View className="flex flex-row px-4 py-3 border-y-[0.25px] border-gray-400">
			<Image
				className="rounded-full"
				style={{
					width: 35,
					height: 35,
				}}
				source={{ uri: "https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg" }}
			/>
			<View className="pl-4 pr-3 flex">
				<Text className="font-semibold text-xs pb-1">John Doe</Text>
				<Text className="w-[265px] text-xs">{props.content}</Text>
			</View>

			<View className="flex flex-col items-center gap-1">
				<Feather name="arrow-up" size={24} />
				<Text className="text-xs">{props.upvotes - props.downvotes}</Text>
				<Feather name="arrow-down" size={24} />
			</View>
		</View>
	);
}
