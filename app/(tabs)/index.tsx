import {View, Text, StyleSheet} from 'react-native'
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function Index() {
    console.log(useSafeAreaInsets())
    return (
        <View style={{height: '50%', backgroundColor: 'red'}}>
            <View style={styles.container}>
                <Text style={styles.text}>
                    This is About 页面
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 0.8,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
})