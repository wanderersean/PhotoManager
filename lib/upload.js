import axios from 'axios';

export async function upload(username, file, title, tags, updateProgress) {
    try {
        const formData = new FormData();
        formData.append('file', {
            uri: file,
            name: 'image.jpg',
            type: 'image/jpeg',       // MIME 类型（尽量准确，否则后端可能拒绝）
        });
        formData.append('user', username);
        formData.append('group', 'default')
        formData.append('title', title);
        formData.append('tags', tags.join(','));

        const response = await axios.post('http://192.168.0.106:8080/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (updateProgress) {
                    updateProgress(progressEvent);
                }
            }
        });
        
        return response; // 返回响应结果
    } catch (error) {
        if (error.response) {
            console.error('Upload failed:', error.response.data)
        } else if (error.request) {
            console.error('Upload failed:', error.request)
        } else {
            console.error('Unknown error', error)
        }
        throw error
    }
}

// 批量上传文件的函数
export async function uploadFiles(files, updateOverallProgress, username, titles = [], tagsList = []) {
    // 遍历图片并逐张上传
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 计算整体进度
        const baseProgress = (i / files.length) * 100;
        
        // 使用用户输入的标题和标签，如果没有则使用默认值
        const title = titles[i]
        const tags = tagsList[i]
        
        // 上传单个文件，传入进度回调函数
        await upload(username, file.uri, title, tags, (progressEvent) => {
            // progressEvent.loaded / progressEvent.total 是 upload 函数内部的进度
            // 需要将其映射到整体进度范围
            const fileProgress = (progressEvent.loaded / progressEvent.total) * (100 / files.length);
            const overallProgress = baseProgress + fileProgress;
            if (updateOverallProgress) {
                updateOverallProgress(overallProgress);
            }
        });
    }
}