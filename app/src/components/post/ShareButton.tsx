import { Feather } from "@expo/vector-icons";
import { View } from "react-native";

export default function ShareButton(props: { darkMode?: boolean; }) {
    return <View>
        <Feather name="share-2" color={props.darkMode ? "white" : "black"} size={22} />
    </View>
}