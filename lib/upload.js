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
        formData.append('title', title);
        formData.append('tags', tags.join(','));

        const response = await axios.post('http://192.168.0.106:9999/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                updateProgress(progressEvent.loaded / progressEvent.total)
            }
        })
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