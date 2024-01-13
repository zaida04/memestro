import { Stack } from "expo-router";
import { Tabs } from "expo-router/tabs";

export default function Layout() {
	return <Tabs>
		<Tabs.Screen name='details' />
	</Tabs>;
}
