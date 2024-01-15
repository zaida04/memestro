import { Button, Input } from "@rneui/themed";
import { Stack } from "expo-router";
import { View, Text } from "react-native";
import * as ImagePicker from 'expo-image-picker';

export default function CreatePostPage() {
	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		const image_upload = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			quality: 1,
		});
		const uri = image_upload.assets?.[0].uri;
		if (!uri) return;

		const image = await fetch(uri);
		const image_data = await image.blob();
		// upload image
	};

	return (
		<View>
			<Stack.Screen options={{ title: "Create a new Post" }} />

			<View className="mx-4 flex flex-col gap-y-2">
				<View>
					<Text className="text-lg font-medium">Title</Text>
					<Input placeholder="New Post" />
				</View>

				<View>
					<Text className="text-lg font-medium">Description</Text>
					<Input
						multiline={true}
						numberOfLines={8}
						placeholder="This is a new post. There are many like it, but this one is mine"
					/>
				</View>

				<View>
					<Text className="text-lg font-medium">Upload Image</Text>
					<Button title="Click to pick an image from camera roll" radius="lg" onPress={pickImage} />
				</View>
			</View>

			<View className="pt-8 w-[200px] mx-auto">
				<Button radius={"lg"}>Submit Post</Button>
			</View>
		</View>
	);
}
