import { Stack, useRouter } from "expo-router";
import { ShareIntentProvider, useShareIntentContext } from "expo-share-intent";
import { StatusBar } from "expo-status-bar";
import { useEffect } from 'react';
import { Dimensions, StyleSheet } from "react-native";
import { PaperProvider } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

function RootNavigator() {
    const router = useRouter();
    const { hasShareIntent, shareIntent } = useShareIntentContext();

    // Navigate to upload page when share intent is detected
    useEffect(() => {
        if (hasShareIntent && shareIntent?.files && shareIntent.files.length > 0) {
            console.log('[RootLayout] Share intent detected, navigating to upload...');
            // Use setTimeout to ensure navigation happens after initial render
            setTimeout(() => {
                router.push('/(tabs)/upload');
            }, 100);
        }
    }, [hasShareIntent, shareIntent]);

    return (
        <Stack
            screenOptions={{
                headerShown: false, // 移除默认的header
            }}
        >
            <Stack.Screen name='(tabs)'></Stack.Screen>
        </Stack>
    );
}

export default function RootLayout() {
    console.log('root', Dimensions.get('window').height)
    return (
        <ShareIntentProvider
            options={{
                debug: true,
                resetOnBackground: true,
            }}
        >
            <PaperProvider>

                <StatusBar style="auto" />
                <SafeAreaView style={styles.container}>
                    <RootNavigator />
                </SafeAreaView>

                <Toast visibilityTime={2000}></Toast>
            </PaperProvider>
        </ShareIntentProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});