import { Stack } from "expo-router";
import { ShareIntentProvider } from "expo-share-intent";
import Toast from 'react-native-toast-message';
import {Dimensions} from "react-native";

export default function RootLayout() {
    console.log('root', Dimensions.get('window').height)
    return (
        <ShareIntentProvider
            options={{
                debug: true,
                resetOnBackground: true,
            }}
        >

            <Stack>
                <Stack.Screen name='(tabs)' options={{ headerShown: false }}></Stack.Screen>
            </Stack>

            {/*<Toast visibilityTime={3000}></Toast>*/}


        </ShareIntentProvider>
    )
}
