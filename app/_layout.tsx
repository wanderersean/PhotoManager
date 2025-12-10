import {Stack} from "expo-router";
import {ShareIntentProvider} from "expo-share-intent";
import Toast from 'react-native-toast-message';
import {StyleSheet} from "react-native";
import AppHeader from '../components/AppHeader'; // 导入自定义头部组件
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";

export default function RootLayout() {
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

                <Toast visibilityTime={2000}></Toast>
            </SafeAreaView>
        </ShareIntentProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});