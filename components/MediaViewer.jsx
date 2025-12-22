import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, PanResponder} from 'react-native';
import TitleEditor from "@/components/TitleEditor";
import TagEditor from "@/components/TagEditor";
import {Card, Divider} from 'react-native-paper';

export default function MediaViewer({medias, onTitleChange, onTagsChange}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [titles, setTitles] = useState(medias.map(() => '')); // 为每张图片存储标题
    const [tags, setTags] = useState(medias.map(() => [])); // 为每张图片存储标签
    const scrollViewRef = useRef(null);

    // 当medias变化时，重新初始化titles和tags
    useEffect(() => {
        setTitles(medias.map(media => media.title || ''));
        setTags(medias.map(media => media.tags || []));
        setCurrentIndex(0); // 重置当前索引
    }, [medias]);

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
        
        // 如果提供了onTitleChange回调，则调用它
        if (onTitleChange) {
            onTitleChange(currentIndex, title);
        }
    };

    // 更新当前图片的标签
    const handleTagsChange = (newTags) => {
        const newTagsArray = [...tags];
        newTagsArray[currentIndex] = newTags;
        setTags(newTagsArray);
        
        // 如果提供了onTagsChange回调，则调用它
        if (onTagsChange) {
            onTagsChange(currentIndex, newTags);
        }
    };

    // Create PanResponder for swipe gestures on thumbnails
    const thumbnailPanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderRelease: (evt, gestureState) => {
            const {dx} = gestureState;
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

    // Create PanResponder for swipe gestures on main image area
    const imageCardPanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderRelease: (evt, gestureState) => {
            const {dx} = gestureState;
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
        <View style={[styles.container]}>
            {medias.length > 0 ? (
                <>
                    {/* 缩略图卡片区域 */}
                    <Card style={styles.thumbnailCard} contentStyle={{flex: 1}}>
                        <View style={styles.thumbnailTitleContainer}>
                            <Text
                                style={styles.imageCountText}>当前是第 {currentIndex + 1}/{medias.length} 张图片</Text>
                        </View>

                        {/* 添加Divider组件实现图片与标题的隔离 */}
                        <Divider/>

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
                        
                        {/* 标题和标签编辑区域 - 提升到更靠近缩略图的位置 */}
                        <View style={styles.editorSection}>
                            <TitleEditor
                                title={titles[currentIndex] || ''}
                                onSave={handleTitleChange}
                            />
                            <TagEditor
                                tags={tags[currentIndex] || []}
                                setTags={handleTagsChange}
                                key={currentIndex}
                            />
                        </View>
                        
                        {/* 图片展示区域 - 实现垂直居中 */}
                        <View 
                            {...imageCardPanResponder.panHandlers}
                            style={styles.mainImageContainer}>
                            <View style={styles.imageCenterContainer}>
                                <Image
                                    source={imageSources[currentIndex]}
                                    style={styles.mainImage}
                                    resizeMode="contain"
                                />
                            </View>
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
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    thumbnailCard: {
        margin: 10,
        elevation: 4,
        borderRadius: 8,
        overflow: 'hidden',
        flex: 1,
    },
    thumbnailTitleContainer: {
        padding: 10,
        backgroundColor: '#e0e0e0',
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
    editorSection: {
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    mainImageContainer: {
        flex: 1,
    },
    imageCenterContainer: {
        flex: 1,
        justifyContent: 'center', // 垂直居中
        alignItems: 'center', // 水平居中
    },
    mainImage: {
        flex: 1,
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