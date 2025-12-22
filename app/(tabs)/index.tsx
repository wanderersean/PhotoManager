import { View, StyleSheet, Alert } from 'react-native'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PhotoGrid from '@/components/PhotoGrid';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import MultiSelectEditModal from '@/components/MultiSelectEditModal';
import ImageDetailModal from '@/components/ImageDetailModal';

// 模拟照片数据
const mockPhotos = [
  {
    id: '1',
    uri: 'https://picsum.photos/400/600?random=1',
    title: '美丽风景哈啊',
    tags: ['自然', '山水', '旅行'],
    date: '2023-05-15T20:15:00Z'
  },
  {
    id: '2',
    uri: 'https://picsum.photos/400/300?random=2',
    title: '城市夜景',
    tags: ['都市', '夜晚', '灯光', '建筑'],
    date: '2023-05-15T20:15:00Z'
  },
  {
    id: '3',
    uri: 'https://picsum.photos/300/400?random=3',
    title: '美食分享',
    tags: ['食物', '美味'],
    date: '2023-05-15T20:15:00Z'
  },
  {
    id: '13',
    uri: 'https://picsum.photos/300/400?random=3',
    title: '美食分享1',
    tags: ['食物', '美味'],
    date: '2023-05-15T20:15:00Z'
  },
  {
    id: '4',
    uri: 'https://picsum.photos/500/400?random=4',
    title: '动物朋友',
    tags: ['宠物', '可爱', '动物'],
    date: '2023-04-05T16:20:00Z'
  },
  {
    id: '5',
    uri: 'https://picsum.photos/400/500?random=5',
    title: '艺术创作',
    tags: ['绘画', '创意'],
    date: '2023-03-22T09:10:00Z'
  },
  {
    id: '6',
    uri: 'https://picsum.photos/350/350?random=6',
    title: '运动时刻',
    tags: ['健身', '活力'],
    date: '2023-03-18T07:30:00Z'
  },
  {
    id: '7',
    uri: 'https://picsum.photos/400/600?random=7',
    title: '海边日出',
    tags: ['海洋', '日出', '美景'],
    date: '2023-02-14T06:45:00Z'
  },
  {
    id: '8',
    uri: 'https://picsum.photos/300/300?random=8',
    title: '咖啡时光',
    tags: ['咖啡', '休闲'],
    date: '2023-02-10T15:30:00Z'
  },
];

export default function Index() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [photos, setPhotos] = useState(mockPhotos);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isImageDetailVisible, setIsImageDetailVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isImageEditModalVisible, setIsImageEditModalVisible] = useState(false);

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

  const saveEditedPhotos = (updatedPhotos) => {
    // 更新照片数据
    const updatedPhotosMap = {};
    updatedPhotos.forEach(photo => {
      updatedPhotosMap[photo.id] = photo;
    });
    
    const newPhotos = photos.map(photo => 
      updatedPhotosMap[photo.id] ? updatedPhotosMap[photo.id] : photo
    );
    
    setPhotos(newPhotos);
    setIsEditModalVisible(false);
    // 只有在保存后才退出选择模式
    exitSelectionMode();
    
    Alert.alert('成功', '照片信息已更新');
  };

  const saveSinglePhoto = (updatedPhoto) => {
    // 更新单张照片数据
    const newPhotos = photos.map(photo => 
      photo.id === updatedPhoto.id ? updatedPhoto : photo
    );
    
    setPhotos(newPhotos);
    setIsImageDetailVisible(false);
    setIsImageEditModalVisible(false);
    
    Alert.alert('成功', '照片信息已更新');
  };

  const openImageEditModal = (photoToEdit) => {
    // 设置要编辑的照片
    if (photoToEdit) {
      setSelectedPhotos([photoToEdit]);
    }
    setIsImageEditModalVisible(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader 
        title="Photo Manager" 
        isEditMode={isSelectionMode}
        onEditPress={openEditModal}
        onCancelPress={handleCancelSelection}
      />
      <PhotoGrid
        photos={photos}
        onPhotoPress={handlePhotoPress}
        onPhotoLongPress={handlePhotoLongPress}
        onFavoritePress={handleFavoritePress}
        isSelectionMode={isSelectionMode}
        selectedPhotos={selectedPhotos}
        onPhotoSelect={togglePhotoSelection}
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
        onSave={saveSinglePhoto}
        onEdit={openImageEditModal}
      />
      
      {/* 图片编辑模态框 */}
      <MultiSelectEditModal
        isVisible={isImageEditModalVisible}
        selectedPhotos={selectedPhotos}
        onClose={() => setIsImageEditModalVisible(false)}
        onSave={saveSinglePhoto}
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