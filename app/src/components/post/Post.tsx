import { Link } from "expo-router";
import { Image, Text, View } from "react-native";
import CommentCount from "./CommentCount";
import UpvoteCount from "./UpvoteCount";

interface PostOptions {
	title: string;
	description: string;
	image: string;
	upvotes: number;
	comments: number;
}
export default function Post(props: PostOptions) {
	return (
		<Link href="/posts/blah/" className="w-full active:bg-gray-200">
			<View className="w-full flex flex-row justify-between border border-gray-300 py-2 px-3">
				<View className="flex flex-row gap-4">
					<Image
						style={{
							width: 125,
							height: 100,
						}}
						source={{
							uri: props.image,
						}}
					/>
					<View className="flex flex-col">
						<Text className="font-semibold">{props.title}</Text>
						<Text className="text-gray-600 text-xs">{props.description}</Text>
					</View>
				</View>
				<View className="flex flex-col gap border-l border-gray-300 pl-4">
					<UpvoteCount extendClassName="test gap-1" upvotes={props.upvotes} />
					<CommentCount comments={props.comments} />
				</View>
			</View>
		</Link>
	);
}
