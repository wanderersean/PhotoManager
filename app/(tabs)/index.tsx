import {Text, View, StyleSheet} from "react-native";
import {Link} from 'expo-router'

export default function Index() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Edit app/index.tsx to edit this screen. aaaS</Text>
            <Link href={'/about'} style={styles.button}>点击跳转</Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'grey',
    },
    text: {
        color: 'white'
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    }
})