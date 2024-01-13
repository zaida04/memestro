import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router/tabs";
import React from "react";

export default function Layout() {
	return (
		<Tabs initialRouteName="index">
			<Tabs.Screen
				name="index"
				options={{
					tabBarLabel: "Home",
					tabBarIcon(props) {
						return <Feather name="home" {...props} />;
					},
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					tabBarLabel: "Profile",
					tabBarIcon(props) {
						return <Feather name="user" {...props} />;
					},
				}}
			/>
			<Tabs.Screen
				name="create-post"
				options={{
					tabBarLabel: "Create Post",
					tabBarIcon(props) {
						return <Feather name="plus" {...props} />;
					},
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					tabBarLabel: "Search",
					tabBarIcon(props) {
						return <Feather name="search" {...props} />;
					},
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					tabBarLabel: "Settings",
					tabBarIcon(props) {
						return <Feather name="settings" {...props} />;
					},
				}}
			/>
		</Tabs>
	);
}