import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function SettingsPage() {
	return (
		<View>
			<Stack.Screen options={{ title: "Settings" }} />
			<Text className="pl-4 text-lg">Settings</Text>
			<Text>Nothing to configure yet...</Text>
		</View>
	);
}
