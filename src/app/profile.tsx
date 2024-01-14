import { View } from "react-native";
import UserProfile from "~/components/UserProfile";

export default function ProfilePage() {
	return (
		<View >
			<UserProfile
				profilePicture="https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg"
				username="nico03727"
				displayName="Nico Nico"
				joinedAt="Joined 1 month ago"
				bio="This is a bio, it's not a super long one, but it's mine and there's nothing you can do about it."
			/>
		</View>
	);
}
