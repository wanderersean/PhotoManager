import { uploadFiles } from '@/lib/upload'
import * as ImagePicker from 'expo-image-picker'
import { useFocusEffect, useNavigation, useRouter } from 'expo-router'
import { useShareIntentContext } from "expo-share-intent"
import React, { useEffect, useRef, useState } from "react"
import { Alert, BackHandler, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Button, Snackbar } from 'react-native-paper'
import Toast from 'react-native-toast-message'

import AppHeaderForUpload from "../../components/AppHeaderForUpload"
import MediaViewer from "../../components/MediaViewer"
import ProgressBar from '../../components/ProgressBar'
import useIntentFiles from "../../lib/intent"

export default function Upload() {
    const scrollRef = useRef(null);
    const router = useRouter();
    const navigation = useNavigation();
    const mediaViewerRef = useRef(null); // 添加MediaViewer引用

    // 添加状态来管理当前显示的页面
    const [showPicker, setShowPicker] = useState(true); // 是否显示选择器页面
    const [selectedImages, setSelectedImages] = useState([]); // 选中的图片

    // Get share intent files
    const intentFiles = useIntentFiles();
    const { hasShareIntent, resetShareIntent } = useShareIntentContext();

    // Handle share intent files
    useEffect(() => {
        if (hasShareIntent && intentFiles.length > 0) {
            console.log('[Upload] Share intent detected with files:', intentFiles.length);
            setSelectedImages(intentFiles);
            setShowPicker(false);
        }
    }, [hasShareIntent, intentFiles]);

    // 使用 useFocusEffect 来处理返回按键
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                // 如果当前在图片选择器页面，返回到上一页面
                if (showPicker) {
                    // 让系统处理默认返回行为
                    return false;
                } else {
                    // 如果在上传页面，返回到选择器页面而不是离开Tab
                    setShowPicker(true);
                    setSelectedImages([]);
                    return true; // 表示已处理返回事件
                }
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                subscription?.remove();
            };
        }, [showPicker])
    );

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
            mediaTypes: ImagePicker.MediaTypeOptions.All,
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
        // Reset share intent if it was from share
        if (hasShareIntent && resetShareIntent) {
            resetShareIntent();
        }
    };

    const onSubmit = async () => {
        try {
            setIsUploading(true);

            // 获取当前选择的图片列表
            const filesToUpload = selectedImages.length > 0 ? selectedImages : [];

            // 从MediaViewer获取标题和标签数据
            let titles = [];
            let tags = [];

            if (mediaViewerRef.current) {
                titles = mediaViewerRef.current.getTitles();
                tags = mediaViewerRef.current.getTags();
            }

            // 使用封装的uploadFiles函数进行批量上传，传递标题和标签数据
            let lastProgress = 0; // 跟踪上一次的进度,确保进度只增不减
            await uploadFiles(filesToUpload, (newProgress) => {
                // 确保进度只增不减
                if (newProgress >= lastProgress) {
                    setProgress(newProgress);
                    lastProgress = newProgress;
                }
            }, "sean", titles, tags); // 使用默认组信息，以及从组件获取的标题和标签

            Toast.show({ type: 'success', text1: '所有照片上传成功!' });

            // Reset share intent after successful upload
            if (hasShareIntent && resetShareIntent) {
                resetShareIntent();
            }

            // Reset to picker view
            setShowPicker(true);
            setSelectedImages([]);
        } catch (e) {
            Toast.show({ type: 'error', text1: '上传失败，请重试' });
            throw e;
        } finally {
            setIsUploading(false);
            setProgress(0);
        }
    }

    const [progress, setProgress] = useState(0)
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
    const files = selectedImages.length > 0 ? selectedImages : [
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
                <MediaViewer ref={mediaViewerRef} medias={files}></MediaViewer>
            </View>

            {/* 进度条 */}
            {isUploading && (
                <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                    <ProgressBar progress={progress} />
                </View>
            )}

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