import React, { useState } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, Image } from 'react-native';
import { Appbar } from 'react-native-paper';
import TagEditor from './TagEditor';

export default function ImageViewer({ 
  isVisible, 
  photo, 
  onClose,
  onSave 
}) {
  const [showDetails, setShowDetails] = useState(true);
  const [title, setTitle] = useState(photo?.title || '');
  const [tags, setTags] = useState(photo?.tags || []);

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...photo,
        title,
        tags
      });
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

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
          <Appbar.Action icon="pencil" onPress={handleSave} />
        </Appbar.Header>

        {photo && (
          <View style={styles.content}>
            <Image 
              source={{ uri: photo.uri }} 
              style={styles.image}
              resizeMode="contain"
            />
            
            {showDetails && (
              <View style={styles.detailsOverlay}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.tagsContainer}>
                  {tags.map((tag, index) => (
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
  image: {
    width: '100%',
    height: '100%',
  },
  detailsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
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