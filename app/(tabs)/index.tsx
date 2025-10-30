import { View, StyleSheet, Dimensions} from "react-native";
import ImageViewer from '@/components/ImageViewer'
import Button from '@/components/Button'

export default function Index() {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <ImageViewer imgSource={require('@/assets/images/a.png')}></ImageViewer>
            </View>
            <View style={styles.footerContainer}>
                <Button label={'点击上传'}></Button>
            </View>
        </View>
    )
}

const {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'grey',
        width: '100%',
    },
    imageContainer: {
        flex: 1,
    },
    image: {
        borderRadius: 15,
        borderColor: 'white',
        borderWidth: 3,
        width: width * 0.9,
        height: height * 0.7,
    },
    text: {
        color: 'white'
    },
    footerContainer: {
        flex: 1/5,
        width: '60%',
        alignItems: "center",
    }
})