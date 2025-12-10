import {upload} from '@/lib/upload'
import {useShareIntentContext} from "expo-share-intent"
import {useEffect, useRef, useState} from "react"
import {Dimensions, StyleSheet, View, Text, TextInput} from "react-native"
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"
import Toast from 'react-native-toast-message'

import ProgressBar from '../../components/ProgressBar'
import SubmitButton from "../../components/SubmitButton";
import TitleEditor from "../../components/TitleEditor";
import TagEditor from "../../components/TagEditor";
import useIntentFiles from "../../lib/intent";
import MediaViewer from "../../components/MediaViewer";


export default function Upload() {
    const onSubmit = async () => {
        try {
            setIsUploading(true)
            Toast.show({type: 'success', text1: '上传成功'})
        } catch (e) {
            Toast.show({type: 'error', text1: '上传失败，请重试'})
            throw e
        } finally {
            setIsUploading(false)
            setProgress(0)
        }
    }


    const [progress, setProgress] = useState(0)
    let files = useIntentFiles()
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState([]) // init tags

    const [isUploading, setIsUploading] = useState(false)

    files = [
        require("../../assets/images/a.png"),
        require("../../assets/images/icon.png"),
        require("../../assets/images/react-logo.png"),
        require("../../assets/images/a.png"),
        require("../../assets/images/icon.png"),
        require("../../assets/images/react-logo.png"),
        require("../../assets/images/a.png"),
        require("../../assets/images/icon.png"),
        require("../../assets/images/react-logo.png"),
    ]

    return (
        <View style={styles.container}>
            <ProgressBar progress={progress}></ProgressBar>

            <TitleEditor title={title} onSave={setTitle}></TitleEditor>

            <TagEditor tags={tags} setTags={setTags}></TagEditor>

            <MediaViewer medias={files}></MediaViewer>


            <SubmitButton enabled={!isUploading} onPress={onSubmit}
                          style={styles.submitButtonContainer}></SubmitButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'grey',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },


    image: {},
    text: {
        color: 'white'
    },

    tagContainer: {
        marginTop: 20,
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        borderWidth: 1,
        borderColor: 'blue',
    },
    submitButtonContainer: {
        width: '100%',
    },
    footerContainer: {
        width: '100%',
        alignItems: "center",
    },
    hidden: {
        display: 'none'
    },
    buttonPressed: {},

})