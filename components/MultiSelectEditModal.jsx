import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';
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
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>取消</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>编辑照片</Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>保存</Text>
          </TouchableOpacity>
        </View>

        {/* Media Viewer */}
        {selectedPhotos.length > 0 && (
          <MediaViewer 
            medias={selectedPhotos}
            onTitleChange={updateTitle}
            onTagsChange={updateTags}
          />
        )}
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
    justifyContent: 'space-between',
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
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});