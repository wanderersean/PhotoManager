import React, {useState, useRef} from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, PanResponder} from 'react-native';
import TitleEditor from "./TitleEditor";
import TagEditor from "./TagEditor";
import { Card, Divider } from 'react-native-paper';

export default function MediaViewer({medias, style}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [titles, setTitles] = useState(medias.map(() => '')); // 为每张图片存储标题
    const [tags, setTags] = useState(medias.map(() => [])); // 为每张图片存储标签
    const scrollViewRef = useRef(null);

    // Convert media resources to image objects
    // Handle both local require() resources and URI strings
    const imageSources = medias.map(media => {
        // If it's already an object with uri property, return as is
        if (typeof media === 'object' && media !== null && media.uri) {
            return media;
        }
        // If it's a string (local path or remote URI), wrap in uri object
        if (typeof media === 'string') {
            return {uri: media};
        }
        // For other cases (like local require()), pass directly
        return media;
    });

    // Handle image selection
    const handleImageSelect = (index) => {
        setCurrentIndex(index);
        // Scroll to the selected thumbnail
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({x: index * 70, animated: true});
        }
    };

    // 更新当前图片的标题
    const handleTitleChange = (title) => {
        const newTitles = [...titles];
        newTitles[currentIndex] = title;
        setTitles(newTitles);
    };

    // 更新当前图片的标签
    const handleTagsChange = (newTags) => {
        const newTagsArray = [...tags];
        newTagsArray[currentIndex] = newTags;
        setTags(newTagsArray);
    };

    // Create PanResponder for swipe gestures on thumbnails
    const thumbnailPanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderRelease: (evt, gestureState) => {
            const { dx } = gestureState;
            // Swipe right (previous image)
            if (dx > 50 && currentIndex > 0) {
                handleImageSelect(currentIndex - 1);
            }
            // Swipe left (next image)
            else if (dx < -50 && currentIndex < medias.length - 1) {
                handleImageSelect(currentIndex + 1);
            }
        },
    });

    // Create PanResponder for swipe gestures on main image card
    const imageCardPanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderRelease: (evt, gestureState) => {
            const { dx } = gestureState;
            // Swipe right (previous image)
            if (dx > 50 && currentIndex > 0) {
                handleImageSelect(currentIndex - 1);
            }
            // Swipe left (next image)
            else if (dx < -50 && currentIndex < medias.length - 1) {
                handleImageSelect(currentIndex + 1);
            }
        },
    });

    return (
        <View style={[styles.container, style]}>
            {medias.length > 0 ? (
                <>
                    {/* 缩略图卡片区域 */}
                    <Card style={styles.thumbnailCard}>
                        <View style={styles.thumbnailTitleContainer}>
                            <Text style={styles.thumbnailTitle}>缩略图</Text>
                            <Text style={styles.imageCountText}>当前是第 {currentIndex + 1}/{medias.length} 张图片</Text>
                        </View>
                        
                        {/* 添加Divider组件实现图片与标题的隔离 */}
                        <Divider />
                        
                        {/* 缩略图区域 */}
                        <View 
                            {...thumbnailPanResponder.panHandlers}
                            style={styles.thumbnailContainer}>
                            <ScrollView 
                                ref={scrollViewRef}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.thumbnailScrollContainer}
                            >
                                {imageSources.map((image, index) => (
                                    <TouchableOpacity 
                                        key={index}
                                        style={[
                                            styles.thumbnailWrapper,
                                            currentIndex === index && styles.selectedThumbnailWrapper
                                        ]}
                                        onPress={() => handleImageSelect(index)}
                                    >
                                        <Image 
                                            source={image} 
                                            style={styles.thumbnail}
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </Card>
                    
                    {/* 下方图片详情卡片区域 */}
                    <Card 
                        {...imageCardPanResponder.panHandlers}
                        style={styles.imageDetailCard}>
                        {/* 记录标题 */}
                        <View style={styles.recordTitleContainer}>
                            <Text style={styles.recordTitle}>记录</Text>
                        </View>
                        
                        {/* 标题和标签编辑区域 */}
                        <View style={styles.editorSection}>
                            <TitleEditor 
                                title={titles[currentIndex] || ''} 
                                onSave={handleTitleChange}
                            />
                            <TagEditor 
                                tags={tags[currentIndex] || []} 
                                setTags={handleTagsChange}
                            />
                        </View>
                        
                        {/* 图片展示区域 */}
                        <View style={styles.mainImageContainer}>
                            <Image 
                                source={imageSources[currentIndex]} 
                                style={styles.mainImage}
                                resizeMode="contain"
                            />
                        </View>
                    </Card>
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text>No images to display</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%', // 使用100%高度，由父容器控制
        backgroundColor: '#f0f0f0',
    },
    thumbnailCard: {
        margin: 10,
        elevation: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    thumbnailTitleContainer: {
        padding: 10,
        backgroundColor: '#e0e0e0',
    },
    thumbnailTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left', // 左对齐
        marginBottom: 5,
    },
    imageCountText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'left', // 左对齐
    },
    thumbnailContainer: {
        height: 80, // 固定高度，确保缩略图完全显示
        backgroundColor: '#e0e0e0',
    },
    thumbnailScrollContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10, // 增加垂直内边距
        alignItems: 'center',
    },
    thumbnailWrapper: {
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 5,
    },
    selectedThumbnailWrapper: {
        borderColor: '#007AFF',
    },
    thumbnail: {
        width: 60,
        height: 60,
    },
    imageDetailCard: {
        flex: 1,
        margin: 10,
        elevation: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    recordTitleContainer: {
        padding: 10,
        backgroundColor: '#e0e0e0',
    },
    recordTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    editorSection: {
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    mainImageContainer: {
        flex: 1,
        width: '100%',
        minHeight: 200,
    },
    mainImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});