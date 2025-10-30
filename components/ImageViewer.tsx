import {Image} from 'expo-image'
import {StyleSheet} from "react-native";

export default function ImageViewer({imgSource}: any) {
    return (
        <Image
            style={styles.image}
            source={imgSource}
            contentFit="cover"
            transition={100}
        />
    )
}

const styles = StyleSheet.create({
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
    }
})