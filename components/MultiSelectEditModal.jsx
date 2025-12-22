import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Modal} from 'react-native';
import {Button} from 'react-native-paper';
import MediaViewer from './MediaViewer';

export default function MultiSelectEditModal({
                                                 isVisible,
                                                 selectedPhotos,
                                                 onClose,
                                                 onSave
                                             }) {
    // 为每个选定的照片初始化标题和标签
    const [titles, setTitles] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (isVisible && selectedPhotos.length > 0) {
            // 初始化标题和标签数组
            const initialTitles = selectedPhotos.map(photo => photo.title || '');
            const initialTags = selectedPhotos.map(photo => photo.tags || []);

            setTitles(initialTitles);
            setTags(initialTags);
        }
    }, [isVisible, selectedPhotos]);

    // 更新指定索引处的照片标题
    const updateTitle = (index, newTitle) => {
        const newTitles = [...titles];
        newTitles[index] = newTitle;
        setTitles(newTitles);
    };

    // 更新指定索引处的照片标签
    const updateTags = (index, newTags) => {
        const newTagsArray = [...tags];
        newTagsArray[index] = newTags;
        setTags(newTagsArray);
    };

    // 保存所有更改
    const handleSave = () => {
        // 构造更新后的照片数据
        const updatedPhotos = selectedPhotos.map((photo, index) => ({
            ...photo,
            title: titles[index] || '',
            tags: tags[index] || []
        }));

        onSave(updatedPhotos);
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>编辑照片</Text>
                </View>

                {/* Media Viewer */}

                {selectedPhotos.length > 0 && (
                    <View style={{flex: 1}}>
                        <MediaViewer
                            medias={selectedPhotos}
                            onTitleChange={updateTitle}
                            onTagsChange={updateTags}
                        />
                    </View>
                )}

                {/* Bottom Buttons */}
                <View style={styles.bottomButtonsContainer}>
                    <Button
                        mode="outlined"
                        onPress={onClose}
                        style={[styles.button, styles.cancelButton]}
                        labelStyle={styles.buttonLabel}
                    >
                        取消
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handleSave}
                        style={[styles.button, styles.saveButton]}
                        labelStyle={styles.buttonLabel}
                    >
                        保存
                    </Button>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
        marginBottom: 10,
    },
    cancelButton: {
        borderColor: '#666',
    },
    saveButton: {
        // 默认的 contained 按钮样式已经很好了
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
});