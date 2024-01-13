import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function SettingsPage() {
	return (
		<View>
			<Stack.Screen options={{ title: "Settings" }} />
			<Text>Settings</Text>
		</View>
	);
}
