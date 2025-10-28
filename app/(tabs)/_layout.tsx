import {Tabs} from 'expo-router'
import {Ionicons} from "@expo/vector-icons";


export default function Layout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'tomato',
            headerStyle: {backgroundColor: 'grey'},
            headerTintColor: 'red',
            tabBarStyle:{
                backgroundColor: 'blue'
            }
        }}>
            <Tabs.Screen name="index" options={{
                title: 'Home',
                tabBarIcon: ({color, focused}) => {
                    return <Ionicons name={focused ? "home-sharp" : "home-outline"} size={20} color={color}/>
                }
            }}/>
            <Tabs.Screen name="about" options={{
                title: 'About',
                tabBarIcon: ({color, focused}) => {
                    return <Ionicons name={focused ? "information-circle" : "information-circle-outline"} size={20}
                                     color={color}/>
                }
            }}/>
        </Tabs>
    )
}