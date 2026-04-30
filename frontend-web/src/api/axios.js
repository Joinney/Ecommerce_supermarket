import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const api = axios.create({
    baseURL: isLocalhost 
        ? 'http://localhost:5000/api' 
        : 'https://ecommerce-supermarket-k691.onrender.com/api',
    withCredentials: true 
});

/**
 * INTERCEPTOR CHO REQUEST: 
 */
api.interceptors.request.use((config) => {
  // 1. Luôn lấy token mới nhất từ localStorage trước mỗi request
  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  
  // 2. Fix lỗi CORS cho một số trình duyệt (Optional)
  config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';

  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * INTERCEPTOR CHO RESPONSE:
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response: res } = error;

    // CHỈ xử lý logout nếu gặp lỗi 401 (Hết hạn/Không hợp lệ) 
    // Tránh 403 (Cấm truy cập) vì đôi khi 403 là do quyền hạn (Role) 
    // chứ không phải do Token chết.
    if (res && res.status === 401) {
      
      // Kiểm tra xem có phải đang trong quá trình Login Google không
      const isGoogleProcessing = window.location.search.includes("token=");

      if (!isGoogleProcessing) {
        console.warn("Phiên đăng nhập hết hạn.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Chỉ chuyển hướng nếu không phải đang ở trang login
        if (window.location.pathname !== '/login' && window.location.pathname !== '/auth-success') {
           window.location.href = '/login';
        }
      }
    }

    // Nếu gặp 403, chỉ thông báo lỗi thay vì đá user ra ngoài
    if (res && res.status === 403) {
      console.error("❌ Bạn không có quyền truy cập tài nguyên này (403 Forbidden)");
    }

    return Promise.reject(error);
  }
);

export default api;