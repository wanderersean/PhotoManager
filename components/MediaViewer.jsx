import React, {useState} from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity, Image} from 'react-native';

export default function MediaViewer({medias}) {
    const [currentIndex, setCurrentIndex] = useState(0);

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
        console.log("Image selected at index:", index);
    };

    return (
        <View style={styles.container}>
            {medias.length > 0 ? (
                <>
                    {/* 上方20%缩略图区域 */}
                    <View style={styles.thumbnailContainer}>
                        <ScrollView 
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
                    
                    {/* 下方80%大图展示区域 */}
                    <View style={styles.viewerContainer}>
                        <Image 
                            source={imageSources[currentIndex]} 
                            style={styles.mainImage}
                            resizeMode="contain"
                        />
                    </View>
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
        height: '50%',
        backgroundColor: '#f0f0f0',
    },
    thumbnailContainer: {
        height: '20%', // 占据20%的高度
        backgroundColor: '#e0e0e0',
    },
    thumbnailScrollContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
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
    viewerContainer: {
        height: '80%', // 占据80%的高度
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});