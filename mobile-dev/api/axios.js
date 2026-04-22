import axios from 'axios';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  // Tự động lấy IP của máy tính Demi đang chạy server
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return 'http://10.0.2.2:5000/api'; // Dành cho máy ảo Android

  const ip = hostUri.split(':').shift();
  const url = `http://${ip}:5000/api`;
  
  console.log("📡 Kết nối tới:", url);
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

export default api;