import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function PhotoCard({ 
  photo, 
  columnWidth, 
  onPress,
  onFavoritePress,
  isSelected,
  onLongPress
}) {
  // 状态管理收藏状态
  const [isFavorite, setIsFavorite] = useState(photo.isFavorite || false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [prevIsSelected, setPrevIsSelected] = useState(isSelected); // 跟踪前一个选择状态

  // 处理收藏点击事件
  const handleFavoritePress = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    // 调用父组件传递的回调函数
    if (onFavoritePress) {
      onFavoritePress({ ...photo, isFavorite: newFavoriteState });
    }
  };

  // 确保照片资源正确处理，使用 useMemo 避免不必要的重新计算
  const imageSource = useMemo(() => {
    // 如果之前加载失败，不尝试重新加载
    if (imageLoadError) {
      return null;
    }
    
    const media = photo.uri || photo;
    // 如果是对象且有uri属性，直接返回
    if (typeof media === 'object' && media !== null && media.uri) {
      return media;
    }
    // 如果是字符串（本地路径或远程URI），包装成uri对象
    if (typeof media === 'string') {
      return { uri: media };
    }
    // 其他情况（如本地require()）直接返回
    return media;
  }, [photo.uri, photo, imageLoadError]);

  // 监听isSelected状态变化
  useEffect(() => {
    // 如果选择状态发生了变化，重置图片加载状态
    if (prevIsSelected !== isSelected) {
      setPrevIsSelected(isSelected);
      // 重置图片状态以确保正确显示
      setImageLoadError(false);
      setImageLoaded(false);
    }
  }, [isSelected, prevIsSelected]);

  return (
    <Card style={[styles.card, { width: columnWidth - 10 }, isSelected && styles.selectedCard]}>
      {/* 照片显示区域 */}
      <TouchableOpacity 
        onPress={onPress} 
        onLongPress={onLongPress}
        style={styles.imageContainer}
      >
        {!imageLoadError && imageSource ? (
          <Image 
            source={imageSource} 
            style={styles.image}
            resizeMode="cover"
            onError={(error) => {
              console.log('Image load error:', error);
              setImageLoadError(true);
              setImageLoaded(false);
            }}
            onLoad={() => {
              console.log('Image loaded successfully');
              setImageLoaded(true);
              setImageLoadError(false);
            }}
          />
        ) : (
          // 图片加载失败时显示占位符
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>图片无法加载</Text>
          </View>
        )}
        {/* 选择标记 - 左上角 */}
        {isSelected && (
          <View style={styles.selectionIndicator}>
            <MaterialIcons 
              name="check-circle" 
              size={24} 
              color="#007AFF" 
            />
          </View>
        )}
        {/* 收藏图标 - 右上角 */}
        <TouchableOpacity 
          style={styles.favoriteIcon} 
          onPress={handleFavoritePress}
        >
          <MaterialIcons 
            name={isFavorite ? "favorite" : "favorite-border"} 
            size={20} 
            color={isFavorite ? "#FF6B6B" : "#FFFFFF"} 
          />
        </TouchableOpacity>
        {/* 标题显示在图片左下角 */}
        <View style={styles.titleOverlay}>
          <Text style={styles.title} numberOfLines={1}>
            {photo.title || '未命名'}
          </Text>
        </View>
      </TouchableOpacity>
      
      {/* 卡片下半部分：标签 */}
      <View style={styles.infoContainer}>
        {/* 标签显示区域 - 单行横向滚动 */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
          contentContainerStyle={styles.tagsContentContainer}
        >
          {photo.tags && photo.tags.map((tag, index) => (
            <View key={`${photo.id}-tag-${index}`} style={styles.tag}>
              <Text style={styles.tagText} numberOfLines={1}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 5,
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    backgroundColor: '#fff',
    height: 130, // 设置卡片固定高度为150
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  imageContainer: {
    height: '80%', // 照片占据卡片80%的高度
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 5,
    right: 5, // 保持在右上角
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    padding: 3,
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // 减少透明度以减少遮盖
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontSize: 12, // 调整字体大小为12
    fontWeight: 'bold',
    color: '#fff', // 白色字体
  },
  infoContainer: {
    padding: 2,
    height: '20%', // 信息区域占据20%的高度
  },
  tagsContainer: {
    flex: 1,
  },
  tagsContentContainer: {
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginRight: 3,
    minWidth: 40,
    alignItems: 'center',
  },
  tagText: {
    fontSize: 11,
    color: '#666',
  },
});