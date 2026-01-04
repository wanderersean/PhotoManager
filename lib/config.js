
// 全局配置文件
export const API_CONFIG = {
    BASE_URL: 'http://192.168.194.233:8080',
    ENDPOINTS: {
        THUMBNAILS: '/thumbnails',
        UPLOAD: '/upload',
        METADATA: '/metadata'
    }
};

// OSS Configuration
export const OSS_CONFIG = {
    ACCESS_KEY_ID: process.env.EXPO_PUBLIC_OSS_ACCESS_KEY_ID,
    ACCESS_KEY_SECRET: process.env.EXPO_PUBLIC_OSS_ACCESS_KEY_SECRET,
    BUCKET_NAME: process.env.EXPO_PUBLIC_OSS_BUCKET_NAME,
    ENDPOINT: process.env.EXPO_PUBLIC_OSS_ENDPOINT
};

export const getApiUrl = (endpoint) => {
    return API_CONFIG.BASE_URL + endpoint;
};
