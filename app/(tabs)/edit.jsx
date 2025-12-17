import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Appbar, TextInput, Button, Snackbar } from 'react-native-paper';
import TagEditor from '@/components/TagEditor';

export default function EditPhotoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { photo } = params;
  const scrollRef = useRef();
  
  // 解析传入的照片数据
  const parsedPhoto = photo ? JSON.parse(photo) : null;
  
  // 设置初始状态
  const [title, setTitle] = useState(parsedPhoto?.title || '');
  const [tags, setTags] = useState(parsedPhoto?.tags || []);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // 显示提示信息
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // 保存更改
  const handleSave = () => {
    // 这里应该调用API保存更改
    showSnackbar('照片信息已更新');
    // 模拟保存操作
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  // 删除照片
  const handleDelete = () => {
    Alert.alert(
      '确认删除',
      '确定要删除这张照片吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '删除', style: 'destructive', onPress: () => {
          // 这里应该调用API删除照片
          showSnackbar('照片已删除');
          // 模拟删除操作
          setTimeout(() => {
            router.back();
          }, 1500);
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="编辑照片" />
        <Appbar.Action icon="check" onPress={handleSave} />
      </Appbar.Header>

      {parsedPhoto ? (
        <KeyboardAwareScrollView 
          style={styles.content}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={20}
          ref={scrollRef}
          // 添加额外的键盘偏移量
          extraHeight={170}
        >
          {/* 照片预览 */}
          <View style={styles.imagePreview}>
            <Image 
              source={{ uri: parsedPhoto.uri }} 
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* 标题输入 */}
          <TextInput
            label="标题"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
            // 添加焦点处理
            onFocus={() => {
              // 延迟执行以确保键盘完全弹出
              setTimeout(() => {
                scrollRef.current?.scrollToFocusedInput();
              }, 100);
            }}
          />

          {/* 标签编辑器 */}
          <View style={styles.section}>
            <TagEditor 
              tags={tags} 
              setTags={setTags} 
            />
          </View>

          {/* 操作按钮 */}
          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              onPress={handleSave}
              style={styles.saveButton}
            >
              保存更改
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={handleDelete}
              textColor="#FF6B6B"
              style={styles.deleteButton}
            >
              删除照片
            </Button>
          </View>
        </KeyboardAwareScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Appbar.Content title="无法加载照片" />
        </View>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imagePreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  saveButton: {
    marginBottom: 10,
  },
  deleteButton: {
    borderColor: '#FF6B6B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});