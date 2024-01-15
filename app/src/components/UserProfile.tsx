import { Image, ScrollView, Text, View } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/Tab";
import Post from "~/components/post/Post";
import Comment from "./post/Comment";

interface UserProfileProps {
	profilePicture: string;
	username: string;
	displayName: string;
	joinedAt: string;
	bio: string;
}
export default function UserProfile(props: UserProfileProps) {
	return (
		<View className="w-full flex items-center my-4">
			<View className="flex flex-row gap-4 items-center">
				<Image
					className="rounded-full"
					style={{
						width: 75,
						height: 75,
					}}
					source={{ uri: "https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg" }}
				/>
				<Text className="text-2xl font-semibold">{props.displayName}</Text>
			</View>
			<Text className="text-gray-600 text-xs my-2">{props.joinedAt}</Text>
			<Text className="text-gray-700 my-2 px-2">{props.bio}</Text>

			<Tabs defaultValue="posts">
				<TabsList>
					<TabsTrigger id="posts" title="Posts" />
					<TabsTrigger id="comments" title="Comments" />
				</TabsList>
				<TabsContent value="posts">
					<ScrollView className="flex flex-col overflow-y-scroll">
						{Array(10)
							.fill(0)
							.map((_, index) => (
								<Post
									key={index}
									title={`A cute cat ${index + 1}`}
									description="This is a cute cat"
									image="https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg"
									upvotes={Math.floor(Math.random() * 10)}
									comments={index}
								/>
							))}
					</ScrollView>
				</TabsContent>
				<TabsContent value="comments">
					<ScrollView>
						{Array(10)
							.fill(0)
							.map((_, index) => (
								<Comment
									key={index}
									content="This is a comment"
									upvotes={Math.floor(Math.random() * 10)}
									downvotes={Math.floor(Math.random() * 10)}
								/>
							))}
					</ScrollView>
				</TabsContent>
			</Tabs>
		</View>
	);
}
