import AppHeader from '@/components/AppHeader';
import ImageDetailModal from '@/components/ImageDetailModal';
import MultiSelectEditModal from '@/components/MultiSelectEditModal';
import PhotoGrid from '@/components/PhotoGrid';
import { API_CONFIG, getApiUrl } from '@/lib/config';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { updatePhotosMetadata } from '../../lib/photo-api';

export default function Index() {
    const router = useRouter();
    const [photos, setPhotos] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isImageDetailVisible, setIsImageDetailVisible] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [lastId, setLastId] = useState(null);
    const [lastTimestamp, setLastTimestamp] = useState(null); // 新增时间戳状态
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // 从远程API获取照片数据
    const fetchPhotos = async (isRefresh = false) => {
        try {
            // 第一次请求使用当前时间戳，后续请求使用上次最后的照片时间戳
            const timestamp = isRefresh ? Math.floor(Date.now() / 1000) : (lastTimestamp || Math.floor(Date.now() / 1000));

            let url;
            if (isRefresh) {
                url = `${getApiUrl(API_CONFIG.ENDPOINTS.THUMBNAILS)}?username=sean&last_timestamp=${timestamp}`;
            } else {
                url = `${getApiUrl(API_CONFIG.ENDPOINTS.THUMBNAILS)}?username=sean&last_timestamp=${timestamp}${lastId ? `&last_id=${lastId}` : ''}`;
            }

            const response = await axios.get(url);

            // 检查响应是否有效
            if (!response.data || !response.data.data) {
                // 如果没有返回数据，说明已经没有更多数据了
                setHasMore(false);
                return;
            }

            const newPhotos = response.data.data.map(photo => ({
                id: photo.id.toString(),
                uri: photo.oss_path,
                uriRaw: photo.oss_path_raw,
                title: photo.title,
                tags: photo.tags ? photo.tags.split(',') : [],
                date: photo.file_created_at,
                type: (photo.file_type && photo.file_type.startsWith('video')) ||
                    (photo.filename && /\.(mp4|mov|avi|wmv|flv|mkv)$/i.test(photo.filename)) ||
                    (photo.title && /\.(mp4|mov|avi|wmv|flv|mkv)$/i.test(photo.title))
                    ? 'video' : 'image',
                duration: photo.duration || 0,
                originalData: photo
            }));

            if (isRefresh) {
                setPhotos(newPhotos);
            } else {
                setPhotos(prev => [...prev, ...newPhotos]);
            }

            // 更新lastId和lastTimestamp用于下一次请求
            if (newPhotos.length > 0) {
                const lastPhoto = newPhotos[newPhotos.length - 1].originalData;
                setLastId(lastPhoto.id);
                // 使用file_created_at或upload_time转换为时间戳
                const lastPhotoDate = new Date(lastPhoto.file_created_at || lastPhoto.upload_time);
                setLastTimestamp(Math.floor(lastPhotoDate.getTime() / 1000));
            } else {
                // 如果没有返回数据，说明已经没有更多数据了
                setHasMore(false);
            }
        } catch (error) {
            console.error('获取照片数据失败:', error);
            Alert.alert('错误', '获取照片数据失败');
        }
    };

    // 初始加载数据
    useEffect(() => {
        // 第一次请求使用当前时间戳
        const initialTimestamp = Math.floor(Date.now() / 1000);
        setLastTimestamp(initialTimestamp);
        fetchPhotos();
    }, []);

    const handlePhotoPress = (photo) => {
        if (isSelectionMode) {
            // 在选择模式下，点击照片切换其选择状态
            togglePhotoSelection(photo);
        } else {
            // 点击照片查看详情或全屏显示
            console.log('查看照片:', photo.title);
            setSelectedPhoto(photo);
            setIsImageDetailVisible(true);
        }
    };

    const handlePhotoLongPress = (photo) => {
        // 长按进入选择模式并选择该照片
        if (!isSelectionMode) {
            setIsSelectionMode(true);
            setSelectedPhotos([photo]);
        } else {
            togglePhotoSelection(photo);
        }
    };

    const togglePhotoSelection = (photo) => {
        const isSelected = selectedPhotos.some(p => p.id === photo.id);
        if (isSelected) {
            // 取消选择
            setSelectedPhotos(selectedPhotos.filter(p => p.id !== photo.id));
        } else {
            // 添加到选择列表
            setSelectedPhotos([...selectedPhotos, photo]);
        }
    };

    const handleEditPress = (photo) => {
        // 导航到编辑页面
        console.log('编辑照片:', photo.title)
        router.push({
            pathname: '/(tabs)/edit',
            params: { photo: JSON.stringify(photo) }
        });
    };

    const handleFavoritePress = (photo) => {
        const action = photo.isFavorite ? '添加' : '取消';
        console.log(`已${action}收藏:`, photo.title);
        // 这里可以添加实际的收藏逻辑，比如更新状态或发送到服务器

        // 更新照片收藏状态
        const updatedPhotos = photos.map(p =>
            p.id === photo.id ? { ...p, isFavorite: !p.isFavorite } : p
        );
        setPhotos(updatedPhotos);
    };

    const exitSelectionMode = () => {
        setIsSelectionMode(false);
        setSelectedPhotos([]);
    };

    // 新增取消选择模式的函数
    const handleCancelSelection = () => {
        exitSelectionMode();
    };

    const openEditModal = () => {
        if (selectedPhotos.length === 0) {
            Alert.alert('提示', '请至少选择一张照片进行编辑');
            return;
        }
        setIsEditModalVisible(true);
    };

    // 修改 onCloseModal 函数来确保退出选择模式
    const onCloseModal = () => {
        setIsEditModalVisible(false);
        // 不再调用exitSelectionMode()，保持选择模式和选中状态
        // exitSelectionMode();
    };

    const saveEditedPhotos = async (updatedPhotos) => {
        try {
            // 调用后端API保存修改,传递原始照片数组和更新后的照片数组
            await updatePhotosMetadata(photos, updatedPhotos);

            // 更新本地状态
            const updatedPhotosMap = {};
            updatedPhotos.forEach(photo => {
                updatedPhotosMap[photo.id] = photo;
            });

            const newPhotos = photos.map(photo =>
                updatedPhotosMap[photo.id] ? updatedPhotosMap[photo.id] : photo
            );

            setPhotos(newPhotos);
            setIsEditModalVisible(false);
            setIsImageDetailVisible(false); // 同时关闭详情模态框
            // 只有在保存后才退出选择模式
            exitSelectionMode();

            Alert.alert('成功', '照片信息已保存到服务器');
        } catch (error) {
            console.error('保存失败:', error);
            Alert.alert('错误', '保存照片信息失败,请重试');
        }
    };



    const openImageEditModal = (photoToEdit) => {
        // 设置要编辑的照片
        if (photoToEdit) {
            setSelectedPhotos([photoToEdit]);
        }
        // 关闭详情模态框
        setIsImageDetailVisible(false);
        // 打开编辑模态框(复用多选编辑模态框)
        setIsEditModalVisible(true);
    };

    // 加载更多照片
    const loadMorePhotos = async () => {
        console.log('loadMorePhotos called');
        if (loading || !hasMore) return;

        console.log('loadMorePhotos setLoading true');
        setLoading(true);
        try {
            // 使用当前的lastTimestamp参数
            const timestamp = lastTimestamp || Math.floor(Date.now() / 1000);
            const url = `${getApiUrl(API_CONFIG.ENDPOINTS.THUMBNAILS)}?username=sean&last_timestamp=${timestamp}${lastId ? `&last_id=${lastId}` : ''}`;
            const response = await axios.get(url);

            // 检查响应是否有效
            if (!response.data || !response.data.data) {
                // 如果没有返回数据，说明已经没有更多数据了
                setHasMore(false);
                return;
            }

            const newPhotos = response.data.data.map(photo => ({
                id: photo.id.toString(),
                uri: photo.oss_path,
                uriRaw: photo.oss_path_raw,
                title: photo.title,
                tags: photo.tags ? photo.tags.split(',') : [],
                date: photo.file_created_at, // 使用文件创建时间或上传时间
                originalData: photo // 保留原始数据，便于后续使用
            }));

            setPhotos(prev => [...prev, ...newPhotos]);

            // 更新lastId和lastTimestamp用于下一次请求
            if (newPhotos.length > 0) {
                const lastPhoto = newPhotos[newPhotos.length - 1].originalData;
                setLastId(lastPhoto.id);
                // 使用file_created_at或upload_time转换为时间戳
                const lastPhotoDate = new Date(lastPhoto.file_created_at || lastPhoto.upload_time);
                setLastTimestamp(Math.floor(lastPhotoDate.getTime() / 1000));
            } else {
                // 如果没有返回数据，说明已经没有更多数据了
                setHasMore(false);
            }
        } catch (error) {
            console.error('加载更多照片失败:', error);
            Alert.alert('错误', '加载更多照片失败');
        } finally {
            setLoading(false);
        }
    };

    // 下拉刷新
    const onRefresh = async () => {
        try {
            // 重置分页状态
            setLastId(null);
            setLastTimestamp(Math.floor(Date.now() / 1000)); // 使用当前时间戳
            setHasMore(true);
            await fetchPhotos(true);
        } catch (error) {
            console.error('刷新失败:', error);
        }
    };

    return (
        <View style={[styles.container]}>
            <AppHeader
                title="PhotoManager查看"
                isEditMode={isSelectionMode}
                onEditPress={openEditModal}
                onCancelPress={handleCancelSelection}
                showInput={undefined}
                onToggleDetails={undefined}
                showDetails={undefined} />
            <PhotoGrid
                photos={photos}
                onPhotoPress={handlePhotoPress}
                onPhotoLongPress={handlePhotoLongPress}
                onFavoritePress={handleFavoritePress}
                isSelectionMode={isSelectionMode}
                selectedPhotos={selectedPhotos}
                onPhotoSelect={togglePhotoSelection}
                onRefresh={onRefresh}
                loadMorePhotos={loadMorePhotos}
                refreshing={loading}
            />
            {/* 多选编辑模态框 */}
            <MultiSelectEditModal
                isVisible={isEditModalVisible}
                selectedPhotos={selectedPhotos}
                onClose={onCloseModal}
                onSave={saveEditedPhotos}
            />
            {/* 图片详情查看器 */}
            <ImageDetailModal
                isVisible={isImageDetailVisible}
                photo={selectedPhoto}
                allPhotos={photos}
                onClose={() => setIsImageDetailVisible(false)}
                onEdit={openImageEditModal}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});