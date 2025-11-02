import {Stack} from "expo-router";
import {ShareIntentProvider} from "expo-share-intent";

export default function RootLayout() {
    return (
        <ShareIntentProvider
            options={{
                debug: true,
                resetOnBackground: true,
            }}
        >
            <Stack>
                <Stack.Screen name='(tabs)' options={{headerShown: false}}></Stack.Screen>
            </Stack>
        </ShareIntentProvider>
    )
}
