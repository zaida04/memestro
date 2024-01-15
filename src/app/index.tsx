import { Stack } from "expo-router";
import { ScrollView, View } from "react-native";
import Post from "~/components/post/Post";

export default function Page() {
	return (
		<View>
			<Stack.Screen options={{ title: "All Pics" }} />

			<ScrollView>
				{Array(10).fill(0).map((_, index) => (
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

		</View>
	);
}
