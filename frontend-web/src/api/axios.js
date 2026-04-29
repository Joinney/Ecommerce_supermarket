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
 * Demi hãy đảm bảo luôn đọc localStorage MỚI NHẤT mỗi khi gửi request.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  
  // Mẹo: Thêm log này để Demi kiểm tra trong Console xem 
  // lúc bị 403 thì thực tế Token có được gửi đi không.
  // console.log("Request sent with token:", !!token); 
  
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
    // CHỈ logout nếu đó là lỗi xác thực THẬT SỰ
    // Tránh trường hợp đang Login Google (URL có token) mà bị redirect về /login oan
    const isAuthError = error.response && (error.response.status === 401 || error.response.status === 403);
    const isGoogleRedirect = window.location.search.includes("token=");

    if (isAuthError && !isGoogleRedirect) {
      console.warn("Lỗi xác thực, đang dọn dẹp hệ thống...");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Nếu không phải trang login thì mới redirect về login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;