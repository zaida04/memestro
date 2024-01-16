import { Feather } from "@expo/vector-icons";
import { Button } from "@rneui/base";
import { ScrollView, TextInput, View } from "react-native";
import Comment from "~/components/post/Comment";
import Topbar from "~/components/post/Topbar";

function generateRandomContent() {
	const filler_words = [
		"Lorem",
		"ipsum",
		"dolor",
		"sit",
		"amet,",
		"consectetur",
		"adipiscing",
		"elit.",
		"Sed",
		"convallis,",
		"ante",
		"sit",
		"amet",
		"convallis",
		"fermentum,",
		"augue",
		"libero",
		"consequat",
		"lectus,",
		"tempus",
		"commodo",
		"leo",
		"enim",
		"non",
		"ligula.",
	];
	const amount_of_words = Math.random() * 20 + 2;

	let content = "";
	for (let i = 0; i < amount_of_words; i++) {
		content += `${filler_words[Math.floor(Math.random() * filler_words.length)]} `;
	}

	return content;
}

export default function PostCommentPage() {
	return (
		<View>
			<Topbar backDestination="/posts/test/" title="Comments" />

			<ScrollView className="h-[85vh]">
				{Array(10)
					.fill(0)
					.map((_, index) => (
						<Comment key={index} upvotes={4} downvotes={9} content={generateRandomContent()} />
					))}
			</ScrollView>
			<View className="flex flex-row justify-center items-center gap-2 absolute bottom-0 bg-white p-1">
				<TextInput className="bg-white p-2 h-[40px] w-4/5 border rounded-2xl" placeholder="Write a comment" />
				<Button radius="xl" color="black" className="bg-black w-[40px] text-white">
					<Feather name="send" color="white" size={24} />
				</Button>
			</View>
		</View>
	);
}
