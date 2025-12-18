import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PhotoGrid from '@/components/PhotoGrid';
import { useRouter } from 'expo-router';

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

  const handlePhotoPress = (photo) => {
    // 点击照片查看详情或全屏显示
    console.log('查看照片:', photo.title);
    handleEditPress(photo)
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
  };

  return (
    <View style={[styles.container]}>
      <PhotoGrid
        photos={mockPhotos}
        onPhotoPress={handlePhotoPress}
        onEditPress={handleEditPress}
        onFavoritePress={handleFavoritePress}
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