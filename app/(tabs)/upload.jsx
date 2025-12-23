import {upload} from '@/lib/upload'
import {useShareIntentContext} from "expo-share-intent"
import React, {useState, useRef} from "react"
import {View, StyleSheet, Alert, Image, TouchableOpacity, Text} from "react-native"
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"
import Toast from 'react-native-toast-message'
import {Appbar, TextInput, Button, Snackbar} from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';

import ProgressBar from '../../components/ProgressBar'
import SubmitButton from "../../components/SubmitButton";
import TagEditor from "../../components/TagEditor";
import useIntentFiles from "../../lib/intent";
import MediaViewer from "../../components/MediaViewer";
import AppHeaderForUpload from "../../components/AppHeaderForUpload";

export default function Upload() {
    const scrollRef = useRef(null);
    
    // 添加状态来管理当前显示的页面
    const [showPicker, setShowPicker] = useState(true); // 是否显示选择器页面
    const [selectedImages, setSelectedImages] = useState([]); // 选中的图片
    
    // 请求权限并打开图片选择器
    const openImagePicker = async () => {
        // 请求媒体库权限
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('权限被拒绝', '需要访问相册权限才能选择图片');
            return;
        }
        
        // 打开图片选择器
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });
        
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setSelectedImages(result.assets);
            setShowPicker(false); // 显示上传页面
        }
    };
    
    // 取消上传，返回到选择页面
    const handleCancel = () => {
        setShowPicker(true);
        setSelectedImages([]);
    };
    
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
    const [tags, setTags] = useState([]) // init tags
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')

    const [isUploading, setIsUploading] = useState(false)

    // 显示提示信息
    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    // 如果showPicker为true，显示选择器页面
    if (showPicker) {
        return (
            <View style={styles.container}>
                <AppHeaderForUpload title="上传照片" />
                
                <View style={styles.pickerContainer}>
                    <TouchableOpacity style={styles.logoButton} onPress={openImagePicker}>
                        <Image 
                            source={require('../../assets/images/icon.png')} 
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <View style={styles.logoTextContainer}>
                            <Text style={styles.logoText}>点击选择照片</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // 否则显示上传页面
    files = selectedImages.length > 0 ? selectedImages : [
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
            
                {/* 媒体预览 */}
                <View style={styles.mediaPreview}>
                    <MediaViewer medias={files}></MediaViewer>
                </View>


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
                
                {/* 添加取消按钮 */}
                <Button 
                    mode="outlined" 
                    onPress={handleCancel}
                    style={styles.cancelButton}
                    labelStyle={styles.cancelButtonLabel}
                >
                    取消
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
    },
    mediaPreview: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    section: {
        marginBottom: 20,
    },
    buttonContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    uploadButton: {
        marginBottom: 10,
    },
    cancelButton: {
        marginBottom: 10,
    },
    cancelButtonLabel: {
        color: '#666',
    },
    pickerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logoButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 120,
        height: 120,
    },
    logoTextContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    logoText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
})