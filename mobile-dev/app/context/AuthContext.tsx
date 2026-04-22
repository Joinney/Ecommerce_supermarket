import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from 'axios'; 

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const [storedUser, storedToken] = await Promise.all([
        AsyncStorage.getItem('@AuthUser'),
        AsyncStorage.getItem('@AuthToken')
      ]);

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error("❌ Lỗi load dữ liệu đăng nhập:", error);
    } finally {
      setLoading(false);
    }
  }

  const login = async (authResponse: any) => {
    try {
      // 1. Kiểm tra log để Demi soi dữ liệu thật từ Backend (Xóa sau khi chạy được)
      console.log("📦 Dữ liệu Login nhận được:", authResponse);

      // 2. Linh hoạt lấy Token (Dù Backend trả về 'token' hay 'accessToken')
      const userData = authResponse?.user;
      const token = authResponse?.token || authResponse?.accessToken;

      // 3. CHẶN LỖI: Nếu không có token thì không lưu để tránh crash AsyncStorage
      if (!token || !userData) {
        console.error("⚠️ Lỗi: Backend trả về thiếu token hoặc user. Kiểm tra lại Backend!");
        return;
      }

      setUser(userData);
      
      // 4. Lưu vào bộ nhớ
      await AsyncStorage.setItem('@AuthUser', JSON.stringify(userData));
      await AsyncStorage.setItem('@AuthToken', token);

      // 5. Gắn vào Axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
    } catch (e) {
      console.error("❌ Lỗi trong hàm login của Context:", e);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.multiRemove(['@AuthUser', '@AuthToken']);
      delete api.defaults.headers.common['Authorization'];
    } catch (e) {
      console.error("❌ Lỗi Logout:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Thêm cái này để hết cái Warning "Missing default export"
export default AuthContext;