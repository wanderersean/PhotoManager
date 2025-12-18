import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Text, RefreshControl, FlatList } from 'react-native';
import PhotoCard from './PhotoCard';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3; // 每列占屏幕宽度的三分之一

// 按日期分组照片数据
const groupPhotosByDate = (photos) => {
  const grouped = {};
  photos.forEach(photo => {
    // 假设照片对象有 date 属性，格式为 ISO 字符串
    const date = new Date(photo.date || new Date());
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // 使用 YYYY-MM-DD 作为键以便排序
    const key = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    // 显示格式为 YYYY年M月D日
    const displayTitle = `${year}年${month}月${day}日`;
    
    if (!grouped[key]) {
      grouped[key] = {
        title: displayTitle,
        sortKey: key,
        data: []
      };
    }
    grouped[key].data.push(photo);
  });
  
  // 转换为数组并按日期降序排列
  return Object.values(grouped)
    .sort((a, b) => {
      // 按日期字符串排序（因为格式是 YYYY-MM-DD，可以直接比较）
      return b.sortKey.localeCompare(a.sortKey);
    });
};

export default function PhotoGrid({ photos, onPhotoPress, onFavoritePress }) {
  const [refreshing, setRefreshing] = useState(false);
  const [displayedPhotos, setDisplayedPhotos] = useState(photos.slice(0, 10)); // 初始显示10张照片
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // 下拉刷新
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // 模拟网络请求
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // 加载更多照片
  const loadMorePhotos = useCallback(() => {
    if (isLoadingMore || displayedPhotos.length >= photos.length) return;
    
    setIsLoadingMore(true);
    // 模拟网络请求
    setTimeout(() => {
      const currentLength = displayedPhotos.length;
      const nextLength = Math.min(currentLength + 10, photos.length);
      setDisplayedPhotos(photos.slice(0, nextLength));
      setIsLoadingMore(false);
    }, 1000);
  }, [displayedPhotos.length, isLoadingMore, photos]);

  // 将照片数据转换为适合展示的格式
  const sections = groupPhotosByDate(displayedPhotos);

  // 处理滚动到底部
  const handleEndReached = () => {
    loadMorePhotos();
  };

  const renderDateSection = ({ item: section }) => {
    // 创建三个列数组
    const columns = [[], [], []];
    
    // 将照片按顺序分配到三列中
    section.data.forEach((photo, index) => {
      columns[index % 3].push(photo);
    });

    return (
      <View style={styles.dateSection}>
        {/* 日期标题 */}
        <View style={styles.dateHeader}>
          <Text style={styles.dateHeaderH2}>{section.title}</Text>
        </View>
        
        {/* 三列照片布局 */}
        <View style={styles.columnsContainer}>
          {columns.map((columnPhotos, columnIndex) => (
            <View key={`column-${columnIndex}`} style={styles.column}>
              {columnPhotos.map((photo) => (
                <PhotoCard
                  key={`photo-${photo.id}`}
                  photo={photo}
                  columnWidth={COLUMN_WIDTH}
                  onPress={() => onPhotoPress(photo)}
                  onFavoritePress={onFavoritePress}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={sections}
      renderItem={renderDateSection}
      keyExtractor={(item) => item.sortKey}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoadingMore ? (
          <View style={styles.loadingFooter}>
            <Text>加载更多照片...</Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  dateSection: {
    marginBottom: 10,
  },
  dateHeader: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 8,
    marginTop: 12,
    backgroundColor: 'transparent',
  },
  dateHeaderH2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  column: {
    flex: 1,
    paddingHorizontal: 2,
  },
  loadingFooter: {
    padding: 10,
    alignItems: 'center',
  },
});