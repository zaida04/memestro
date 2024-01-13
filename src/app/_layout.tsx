import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router/tabs";
import React from "react";

const tabs = [
	{
		name: "index",
		label: "Home",
		icon: "home",
	},
	{
		name: "profile",
		label: "Profile",
		icon: "user",
	},
	{
		name: "create-post",
		label: "Create Post",
		icon: "plus",
	},
	{
		name: "search",
		label: "Search",
		icon: "search",
	},
	{
		name: "settings",
		label: "Settings",
		icon: "settings",
	},
]
const noop = () => null;

function hideTab(options: any) {
	return {
		tabBarButton: !tabs.some(x => x.name === options.route.name)
			? noop
			: undefined,
	};
}

export default function Layout() {
	return (
		<Tabs
			screenOptions={hideTab}
			initialRouteName="index">
			{tabs.map((tab) => (
				<Tabs.Screen
					key={tab.name}
					name={tab.name}
					options={{
						tabBarLabel: tab.label,
						tabBarIcon(props) {
							return <Feather name={tab.icon as any} {...props} />;
						},
					}}
				/>
			))}
		</Tabs>
	);
}
