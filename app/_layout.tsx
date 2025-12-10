import { Stack } from "expo-router";
import { ShareIntentProvider } from "expo-share-intent";
import Toast from 'react-native-toast-message';
import {Dimensions, Text, StyleSheet} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import AppHeader from "@/components/AppHeader";

export default function RootLayout() {
    console.log('root', Dimensions.get('window').height)
    return (
        <ShareIntentProvider
            options={{
                debug: true,
                resetOnBackground: true,
            }}
        >
            <StatusBar style="auto"/>
            <SafeAreaView style={styles.container}>
                <Stack
                    screenOptions={{
                        header: (props) => (
                            <AppHeader
                                title="Photo Manager"
                                showInput={props.route.name === 'search'} // 仅在搜索页面显示输入框
                            />
                        ),
                    }}
                >
                    <Stack.Screen name='(tabs)' ></Stack.Screen>
                </Stack>
            </SafeAreaView>

            <Toast visibilityTime={2000}></Toast>
        </ShareIntentProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});