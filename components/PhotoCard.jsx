import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function PhotoCard({ 
  photo, 
  columnWidth, 
  onPress,
  onFavoritePress
}) {
  // 状态管理收藏状态
  const [isFavorite, setIsFavorite] = useState(photo.isFavorite || false);

  // 处理收藏点击事件
  const handleFavoritePress = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    // 调用父组件传递的回调函数
    if (onFavoritePress) {
      onFavoritePress({ ...photo, isFavorite: newFavoriteState });
    }
  };

  // 确保照片资源正确处理
  const getImageSource = (media) => {
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
  };

  return (
    <Card style={[styles.card, { width: columnWidth - 10 }]}>
      {/* 照片显示区域 */}
      <TouchableOpacity onPress={onPress} style={styles.imageContainer}>
        <Image 
          source={getImageSource(photo.uri || photo)} 
          style={styles.image}
          resizeMode="cover"
        />
        {/* 收藏图标 - 左上角 */}
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
            <View key={index} style={styles.tag}>
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
  imageContainer: {
    height: '80%', // 照片占据卡片80%的高度
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
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