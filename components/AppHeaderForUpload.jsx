import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

export default function AppHeaderForUpload ({ title, showInput })  {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <Text style={styles.appTitle}>{title}</Text>
      </View>
      {showInput && (
        <TextInput
          style={styles.input}
          placeholder="搜索..."
        />
      )}
    </View>
  );
};

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