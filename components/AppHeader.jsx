import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function AppHeader ({ title, showInput, isEditMode, onEditPress, onCancelPress, onToggleDetails, showDetails })  {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <Text style={styles.appTitle}>{title}</Text>
        {isEditMode ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
              <Text style={styles.editButtonText}>编辑</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCancelPress} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>退出</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      {showInput && (
        <TextInput
          style={styles.input}
          placeholder="搜索..."
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'yellow',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 5,
    marginRight: 10,
  },
  editButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  input: {
    height: 25, // 减小高度
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8, // 减小水平内边距
    paddingVertical: 8, // 减小垂直内边距
    backgroundColor: '#fff',
    fontSize: 14, // 减小字体大小
    lineHeight: 14, // 减小行高
  },
});