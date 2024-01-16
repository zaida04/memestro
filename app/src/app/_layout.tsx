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
];
const showTabOnPage = ["index", "create-post", "profile", "search", "settings"];
const noop = () => null;

export default function Layout() {
	return (
		<Tabs
			screenOptions={(options) => ({
				// headerShown: showTabOnPage.includes(options.route.name),
				headerShown: true,
				headerStyle: {
					backgroundColor: "black"
				},
				headerTintColor: "#fffc01",
				tabBarStyle: {
					display: showTabOnPage.includes(options.route.name) ? "flex" : "none",
				},
				tabBarButton: !tabs.some((x) => x.name === options.route.name) ? noop : undefined,
			})}
			initialRouteName="index"
		>
			{tabs.map((tab) => (
				<Tabs.Screen
					key={tab.name}
					name={tab.name}
					options={{
						tabBarLabel: "",
						tabBarIconStyle: {
							backgroundColor: "#fffc01"
						},
						tabBarLabelStyle: {
							fontSize: 1
						},
						tabBarActiveTintColor: "#fffc01",
						tabBarInactiveTintColor: "white",
						tabBarStyle: {
							paddingTop: 5,
							backgroundColor: "black",
						},
						tabBarIcon(props) {
							return <Feather name={tab.icon as any} {...props} />;
						},
					}}
				/>
			))}
		</Tabs>
	);
}
