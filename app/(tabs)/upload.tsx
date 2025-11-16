import Button from '@/components/Button'
import {upload} from '@/lib/upload'
import {useShareIntentContext} from "expo-share-intent"
import {useEffect, useState} from "react"
import {Dimensions, StyleSheet, View, Text, TextInput} from "react-native"
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"
import Tags from 'react-native-tags'
import Toast from 'react-native-toast-message'
import * as Progress from 'react-native-progress'
import {SafeAreaView, useSafeAreaFrame, useSafeAreaInsets} from 'react-native-safe-area-context'
import {Image} from "expo-image";


export default function Upload() {
    const [imagePath, setImagePath] = useState('')
    const [title, setTitle] = useState<string>('')
    const [tags, setTags] = useState<string[]>([])
    const {hasShareIntent, shareIntent} = useShareIntentContext();
    const [progress, setProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const frame = useSafeAreaFrame()
    const insets = useSafeAreaInsets()
    console.log('frame info', frame.width, frame.height)
    console.log('insets', insets.top)
    useEffect(() => {
        if (hasShareIntent) {
            let filePath = shareIntent.files?.at(0)?.path
            setImagePath(filePath ? filePath : '')
        }
    }, [hasShareIntent, shareIntent]);

    return (
        <KeyboardAwareScrollView
            style={[{backgroundColor: 'yellow', flex: 1}]}
            contentContainerStyle={{minHeight: Dimensions.get('window').height}}
            enableOnAndroid={true}
            // extraHeight={100}
            keyboardShouldPersistTaps="handled"
        >

            <SafeAreaView style={[styles.container]}>
                <View style={[styles.progressContainer, isUploading && styles.hidden]}>
                    <Progress.Bar width={null} progress={progress}/>
                </View>

                <View>
                    <MyImageViewer></MyImageViewer>
                </View>

                <View style={styles.titleContainer}>
                    <TextInput
                        placeholder="(可选）请输入标题"
                        placeholderTextColor="black"
                        onChangeText={(text) => {
                            setTitle(text)
                        }}
                        style={{
                            width: '100%',
                            backgroundColor: 'white',
                            opacity: 0.7,
                            padding: 10,
                            borderRadius: 10,
                        }}
                    />
                </View>

                <View style={styles.tagContainer}>
                    <Tags
                        initialText={''}
                        textInputProps={{
                            placeholder: "自定义标签，空格或逗号结尾"
                        }}
                        createTagOnString={[",", "，", ' ', '\r\n']}
                        initialTags={tags}
                        onChangeTags={(tags: string[]) => {
                            setTags(tags)
                        }}
                        containerStyle={{justifyContent: "space"}}
                        inputStyle={{backgroundColor: "white", borderRadius: 10}}

                        // renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                        //     <TouchableOpacity key={`${tag}-${index}`} onPress={onPress}>
                        //         <Text>{tag}</Text>
                        //     </TouchableOpacity>
                        // )}
                    />
                </View>


                <View style={styles.footerContainer}>
                    <Button label={'点击上传'} enabled={!isUploading}
                            onPress={async () => {
                                try {
                                    setIsUploading(true)
                                    await upload('sean', imagePath, '标题', tags, setProgress)
                                    Toast.show({type: 'success', text1: '上传成功'})
                                } catch (e) {
                                    Toast.show({type: 'error', text1: '上传失败，请重试'})
                                    throw e
                                } finally {
                                    setIsUploading(false)
                                    setProgress(0)
                                }
                            }}
                    >
                    </Button>
                </View>
            </SafeAreaView>

        </KeyboardAwareScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'grey',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    progressContainer: {
        width: '100%',
    },

    image: {},
    text: {
        color: 'white'
    },
    titleContainer: {
        width: '80%',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    tagContainer: {
        marginTop: 20,
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        borderWidth: 1,
        borderColor: 'blue',
    },
    footerContainer: {
        width: '60%',
        alignItems: "center",
    },
    hidden: {
        display: 'none'
    },
    buttonPressed: {},

})