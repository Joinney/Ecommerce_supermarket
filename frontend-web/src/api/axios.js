import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Đảm bảo Port này trùng với Server Node của bạn
    withCredentials: true // Rất quan trọng để lưu Cookie (RefreshToken)
});

// Mỗi khi gọi API, tự động lấy AccessToken từ LocalStorage dán vào Header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.token = `Bearer ${token}`;
    }
    return config;
});

export default api;