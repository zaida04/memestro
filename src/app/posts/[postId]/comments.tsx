import { ScrollView, View } from "react-native";
import Topbar from "~/components/post/Topbar";
import Comment from "~/components/comment/Comment";

function generateRandomContent() {
    const filler_words = [
        "Lorem", "ipsum", "dolor", "sit", "amet,", "consectetur", "adipiscing", "elit.", "Sed", "convallis,", "ante", "sit", "amet", "convallis", "fermentum,", "augue", "libero", "consequat", "lectus,", "tempus", "commodo", "leo", "enim", "non", "ligula."
    ]
    const amount_of_words = Math.random() * 20 + 2;

    let content = "";
    for (let i = 0; i < amount_of_words; i++) {
        content += `${filler_words[Math.floor(Math.random() * filler_words.length)]} `;
    }

    return content;
}

export default function PostCommentPage() {
    return <View>
        <Topbar backDestination="/posts/test/" />

        <ScrollView>
            {Array(10).fill(0).map((_, index) => (
                <Comment key={index} upvotes={4} downvotes={9} content={generateRandomContent()} />
            ))}
        </ScrollView>
    </View>
}