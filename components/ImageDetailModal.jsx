import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, StyleSheet, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';

const LOG_PREFIX = '[ImageDetailModal]';

export default function ImageDetailModal({
  isVisible,
  photo,
  onClose,
  onEdit, // 添加onEdit属性
  allPhotos = []
}) {
  const [showDetails, setShowDetails] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  // 当模态框显示且photo改变时，找到当前图片的索引
  React.useEffect(() => {
    if (isVisible && photo) {
      if (allPhotos.length > 0) {
        const index = allPhotos.findIndex(p => p.id === photo.id);
        if (index !== -1) {
          setTimeout(() => {
            setCurrentIndex(index);
          }, 50);
        }
      }
    } else if (!isVisible) {
      setCurrentIndex(0);
    }
  }, [isVisible, photo, allPhotos]);

  // 当currentIndex改变时，滚动到对应的图片
  useEffect(() => {
    if (scrollViewRef.current && allPhotos.length > 0 && currentIndex >= 0 && currentIndex < allPhotos.length) {
      setTimeout(() => {
        try {
          scrollViewRef.current?.scrollToIndex({
            index: currentIndex,
            animated: false
          });
        } catch (error) {
          console.warn(`${LOG_PREFIX} scrollToIndex error:`, error);
        }
      }, 100);
    }
  }, [currentIndex, allPhotos]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // 处理滚动结束事件，更新当前图片索引
  const handleScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;

    // 计算当前页码
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageNum);
  };

  // 获取当前显示的图片
  const getCurrentPhoto = () => {
    if (allPhotos.length > 0 && currentIndex >= 0 && currentIndex < allPhotos.length) {
      return allPhotos[currentIndex];
    }
    return photo;
  };

  // 渲染单个图片项
  const renderItem = ({ item: p, index }) => {
    return (
      <View style={styles.imageContainer}>
        {p.type === 'video' ? (
          <Video
            style={styles.image}
            source={{ uri: p.uriRaw }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            shouldPlay={index === currentIndex} // Only play if it's the current item
            posterSource={{ uri: p.uri }} // Use the thumbnail as poster
            usePoster={true}
            onError={(error) => {
              console.error(`${LOG_PREFIX} Video load error:`, {
                photoId: p.id,
                uriRaw: p.uriRaw,
                error
              });
            }}
          />
        ) : (
          <Image
            source={{ uri: p.uriRaw }}
            style={styles.image}
            resizeMode="contain"
            onError={(error) => {
              console.log('error photo', p)
              console.error(`${LOG_PREFIX} Image load error:`, {
                photoId: p.id,
                uriRaw: p.uriRaw,
                error: error.nativeEvent?.error
              });
            }}
          />
        )}
      </View>
    );
  };

  const currentPhoto = getCurrentPhoto();

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Appbar.Header statusBarHeight={0}>
          <Appbar.BackAction onPress={onClose} />
          <Appbar.Content title="图片详情" />
          <Appbar.Action
            icon={showDetails ? "eye-off" : "eye"}
            onPress={toggleDetails}
          />
          {onEdit && (
            <Appbar.Action icon="pencil" onPress={() => onEdit(currentPhoto)} />
          )}
        </Appbar.Header>

        {photo && (
          <View style={styles.content}>
            <FlatList
              ref={scrollViewRef}
              data={allPhotos.length > 0 ? allPhotos : (photo ? [photo] : [])}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScrollEnd}
              initialScrollIndex={currentIndex}
              getItemLayout={(data, index) => ({
                length: Dimensions.get('window').width,
                offset: Dimensions.get('window').width * index,
                index,
              })}
              windowSize={3}
              maxToRenderPerBatch={2}
              removeClippedSubviews={true}
              style={styles.scrollView}
            />

            {/* 页面指示器 */}
            {allPhotos.length > 1 && (
              <View style={styles.indicatorContainer}>
                <Text style={styles.indicatorText}>
                  {currentIndex + 1} / {allPhotos.length}
                </Text>
              </View>
            )}

            {showDetails && currentPhoto && (
              <View style={styles.detailsOverlay}>
                <Text style={styles.title}>{currentPhoto.title}</Text>
                <View style={styles.tagsContainer}>
                  {currentPhoto.tags && currentPhoto.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  indicatorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    maxHeight: '50%',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
  },
});