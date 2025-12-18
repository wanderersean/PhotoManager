import {upload} from '@/lib/upload'
import {useShareIntentContext} from "expo-share-intent"
import React, {useState, useRef} from "react"
import {View, StyleSheet, Alert, Image} from "react-native"
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"
import Toast from 'react-native-toast-message'
import {Appbar, TextInput, Button, Snackbar} from 'react-native-paper'

import ProgressBar from '../../components/ProgressBar'
import SubmitButton from "../../components/SubmitButton";
import TagEditor from "../../components/TagEditor";
import useIntentFiles from "../../lib/intent";
import MediaViewer from "../../components/MediaViewer";
import AppHeaderForUpload from "../../components/AppHeaderForUpload";

export default function Upload() {
    const scrollRef = useRef(null);
    
    const onSubmit = async () => {
        try {
            setIsUploading(true)
            console.log('哈哈哈哈')
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
    const [tags, setTags] = useState([]) // init tags
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')

    const [isUploading, setIsUploading] = useState(false)

    // 显示提示信息
    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

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
            <AppHeaderForUpload title="上传照片" />
            
            <KeyboardAwareScrollView 
                style={styles.content}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={20}
                ref={scrollRef}
                // 添加额外的键盘偏移量
                extraHeight={30}
            >
                {/* 媒体预览 */}
                <View style={styles.mediaPreview}>
                    <MediaViewer medias={files}></MediaViewer>
                </View>

            </KeyboardAwareScrollView>

            {/* 上传按钮 - 固定在底部 */}
            <View style={styles.buttonContainer}>
                <Button 
                    mode="contained" 
                    onPress={onSubmit}
                    loading={isUploading}
                    disabled={isUploading}
                    style={styles.uploadButton}
                >
                    {isUploading ? '上传中...' : '上传照片'}
                </Button>
            </View>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={2000}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 8,
    },
    mediaPreview: {
        height: 300, // 固定高度以控制MediaViewer的高度
        alignItems: 'center',
        marginBottom: 10,
    },
    section: {
        marginBottom: 20,
    },
    buttonContainer: {
        padding: 10,
        backgroundColor: '#fff',
    },
    uploadButton: {
        marginBottom: 10,
    },
})