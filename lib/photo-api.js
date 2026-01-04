import axios from 'axios';
import { API_CONFIG, getApiUrl } from './config';

/**
 * 更新单张照片的元数据
 * @param {Object} oldPhoto - 原始照片对象,包含 originalData
 * @param {Object} updatedPhoto - 更新后的照片对象,包含新的 title 和 tags
 * @returns {Promise} API响应
 */
export async function updatePhotoMetadata(oldPhoto, updatedPhoto) {
    try {
        const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.METADATA), {
            username: oldPhoto.originalData?.username || 'sean',
            filename: oldPhoto.originalData?.filename,
            group: oldPhoto.originalData?.group || 'default',
            title: updatedPhoto.title || '',
            tags: updatedPhoto.tags || [],  // 直接传递数组
            favorite: updatedPhoto.favorite || oldPhoto.favorite || false
        });
        return response.data;
    } catch (error) {
        console.error('更新照片元数据失败:', error);
        throw error;
    }
}

/**
 * 批量更新多张照片的元数据
 * @param {Array<Object>} oldPhotos - 原始照片数组
 * @param {Array<Object>} updatedPhotos - 更新后的照片数组
 * @returns {Promise} API响应
 */
export async function updatePhotosMetadata(oldPhotos, updatedPhotos) {
    try {
        // 创建 ID 到照片的映射
        const oldPhotosMap = {};
        oldPhotos.forEach(photo => {
            oldPhotosMap[photo.id] = photo;
        });

        // 并发发送所有更新请求
        const updatePromises = updatedPhotos.map(updatedPhoto => {
            const oldPhoto = oldPhotosMap[updatedPhoto.id];
            if (!oldPhoto) {
                console.warn(`找不到 ID 为 ${updatedPhoto.id} 的原始照片`);
                return Promise.resolve();
            }
            return updatePhotoMetadata(oldPhoto, updatedPhoto);
        });

        const results = await Promise.all(updatePromises);
        return results;
    } catch (error) {
        console.error('批量更新照片元数据失败:', error);
        throw error;
    }
}
