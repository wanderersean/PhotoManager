import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons";


export default function Layout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'tomato',
            headerStyle: { backgroundColor: 'grey' },
            headerShown: true,
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

            <Tabs.Screen name="upload" options={{
                title: '上传',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => {
                    return <Ionicons name={focused ? "information-circle" : "information-circle-outline"} size={20}
                        color={color} />
                }
            }} />
            
            <Tabs.Screen name="edit" options={{
                headerShown: false,
                href: null // 隐藏此页面在tab栏中显示
            }} />
        </Tabs>
    )
}