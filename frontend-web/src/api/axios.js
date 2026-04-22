import axios from 'axios';

/**
 * TỰ ĐỘNG NHẬN DIỆN MÔI TRƯỜNG:
 * - Nếu đang mở web bằng http://localhost... -> Dùng API localhost.
 * - Nếu đang mở bằng link Render -> Dùng API Render.
 */
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const api = axios.create({
    baseURL: isLocalhost 
        ? 'http://localhost:5000/api' 
        : 'https://ecommerce-supermarket-k691.onrender.com/api',
    withCredentials: true // Rất quan trọng để lưu Cookie (RefreshToken)
});

// Mỗi khi gọi API, tự động lấy AccessToken từ LocalStorage dán vào Header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        // Demi lưu ý: Backend đang dùng header là 'token' (chữ thường) 
        // dựa theo cấu hình cors của server lúc nãy nên giữ nguyên nhé.
        config.headers.token = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;