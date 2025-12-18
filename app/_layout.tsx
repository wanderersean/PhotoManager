import {Stack} from "expo-router";
import {ShareIntentProvider} from "expo-share-intent";
import Toast from 'react-native-toast-message';
import {Dimensions, Text, StyleSheet} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {PaperProvider} from 'react-native-paper';

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

                <StatusBar style="auto"/>
                <SafeAreaView style={styles.container}>
                    <Stack
                        screenOptions={{
                            headerShown: false, // 移除默认的header
                        }}
                    >
                        <Stack.Screen name='(tabs)'></Stack.Screen>
                    </Stack>
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