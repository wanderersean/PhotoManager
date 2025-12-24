import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

export default function Layout() {
    const router = useRouter();
    
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'tomato',
            headerStyle: { backgroundColor: 'grey' },
            headerShown: false, // 恢复为false，使用自定义header
            tabBarStyle: {
                backgroundColor: 'white',
            }
        }}>

            <Tabs.Screen name="index" options={{
                title: '查看',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => {
                    return <Ionicons name={focused ? "home-sharp" : "home-outline"} size={20} color={color} />
                }
            }} />

            <Tabs.Screen 
                name="upload" 
                options={{
                    title: '上传',
                    headerShown: false, // upload页面也使用自定义header
                    tabBarIcon: ({ color, focused }) => {
                        return <Ionicons name={focused ? "information-circle" : "information-circle-outline"} size={20}
                            color={color} />
                    }
                }}
                listeners={{
                    tabPress: (e) => {
                        // 阻止默认的tab切换行为
                        e.preventDefault();
                        // 使用replace方法，清空堆栈并将上传页面作为栈顶
                        router.replace('/(tabs)/upload');
                    },
                }}
            />
            
        </Tabs>
    )
}