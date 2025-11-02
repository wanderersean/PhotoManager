import {View, StyleSheet, Dimensions} from "react-native";
import ImageViewer from '@/components/ImageViewer'
import Button from '@/components/Button'
import * as ImagePicker from 'expo-image-picker'
import {useEffect, useState} from "react";
import { useShareIntentContext } from "expo-share-intent";

export default function Index() {
    const { hasShareIntent } = useShareIntentContext();
    useEffect(() => {
        if (hasShareIntent) {
            // we want to handle share intent event in a specific page
            console.debug("[expo-router-index] sean");
        }
    }, [hasShareIntent]);

    const [imagePath, setImagePath] = useState('')
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            console.log(result.assets[0].uri)
            setImagePath(result.assets[0].uri)
            if (imagePath) {
                console.log('show image', imagePath)
            }
        }
        console.log(result)
    };
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <ImageViewer imgSource={ imagePath ? {uri: imagePath} :require('@/assets/images/a.png')}/>
            </View>
            <View style={styles.footerContainer}>
                <Button label={'点击上传'} onPress={pickImage}></Button>
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
        flex: 1 / 5,
        width: '60%',
        alignItems: "center",
    }
})