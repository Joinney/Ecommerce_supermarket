import axios from 'axios';

/**
 * TỰ ĐỘNG NHẬN DIỆN MÔI TRƯỜNG:
 * - Local: Dùng API localhost:5000
 * - Production: Dùng API trên Render
 */
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const api = axios.create({
    baseURL: isLocalhost 
        ? 'http://localhost:5000/api' 
        : 'https://ecommerce-supermarket-k691.onrender.com/api',
    withCredentials: true // Duy trì Cookie để hệ thống Refresh Token hoạt động
});

/**
 * INTERCEPTOR CHO REQUEST:
 * Tự động đính kèm Access Token vào Header mỗi khi gửi yêu cầu
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        // Sử dụng key 'token' đồng bộ với cấu hình CORS của Backend Demi
        config.headers.token = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * INTERCEPTOR CHO RESPONSE:
 * Xử lý tập trung các lỗi trả về (như hết hạn phiên làm việc)
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Nếu lỗi 401 (Hết hạn token), Demi có thể xử lý xóa local tại đây nếu muốn
        if (error.response && error.response.status === 401) {
            console.warn("Phiên làm việc đã hết hạn.");
        }
        return Promise.reject(error);
    }
);

export default api;