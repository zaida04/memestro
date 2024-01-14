import { Image, ScrollView, Text, View } from "react-native";
import Post from "~/components/post/Post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/Tab';

interface UserProfileProps {
    profilePicture: string;
    username: string;
    displayName: string;
    joinedAt: string;
    bio: string;
}
export default function UserProfile(props: UserProfileProps) {
    return <View className="w-full flex items-center my-4">
        <View className="flex flex-row gap-4 items-center">
            <Image
                className="rounded-full"
                style={{
                    width: 75,
                    height: 75,
                }}
                source={{ uri: "https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg" }}
            />
            <Text className="text-2xl font-semibold">{props.displayName}</Text>
        </View>
        <Text className="text-gray-600 text-xs my-2">{props.joinedAt}</Text>
        <Text className="text-gray-700 my-2 px-2">{props.bio}</Text>

        <Tabs defaultValue="posts">
            <TabsList>
                <TabsTrigger id="posts" title="Posts" />
                <TabsTrigger id="comments" title="Comments" />
            </TabsList>
            <TabsContent value="posts">
                <ScrollView className="flex flex-col overflow-y-scroll">
                    {Array(10).fill(0).map((_, index) => (
                        <Post
                            key={index}
                            title={`A cute cat ${index + 1}`}
                            description="This is a cute cat"
                            image="https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg"
                            upvotes={Math.floor(Math.random() * 10)}
                            comments={index}
                        />
                    ))}
                </ScrollView>
            </TabsContent>
            <TabsContent value="comments">
                <Text className="text-black dark:text-white">
                    Your comments
                </Text>
            </TabsContent>
        </Tabs>
    </View>
}