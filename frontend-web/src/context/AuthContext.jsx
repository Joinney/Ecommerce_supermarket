import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. KHỞI TẠO TỨC THÌ: Header sẽ có ảnh ngay khi F5, không bị nhảy màu
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (savedUser && token) {
          try {
            return JSON.parse(savedUser);
          } catch (e) {
            return null;
          }
        }
        return null;
    });

    const [loading, setLoading] = useState(true); 
    const [authActionLoading, setAuthActionLoading] = useState(false);

    // 2. CẬP NHẬT NHANH: Dùng khi Demi đổi ảnh đại diện hoặc đổi tên ở trang Profile
    const updateUser = useCallback((newData) => {
        setUser(prevUser => {
            const updatedUser = { ...prevUser, ...newData };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            return updatedUser;
        });
    }, []);

    // 3. XỬ LÝ XÁC THỰC (PHIÊN BẢN CHỐNG VĂNG GOOGLE)
    const checkAuth = useCallback(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get("token");
        const userFromUrl = params.get("user");

        // --- ƯU TIÊN XỬ LÝ GOOGLE AUTH ---
        if (tokenFromUrl && userFromUrl) {
            try {
                const userData = JSON.parse(decodeURIComponent(userFromUrl));
                
                // Lưu vào máy trước khi set state
                localStorage.setItem("token", tokenFromUrl);
                localStorage.setItem("user", JSON.stringify(userData));
                
                setUser(userData);
                
                // FIX LỖI EXTENSION: Đợi Extension xử lý xong mới dọn URL
                setTimeout(() => {
                    window.history.replaceState({}, document.title, "/");
                }, 300);

                setLoading(false);
                return; 
            } catch (e) {
                console.error("❌ Lỗi dữ liệu Google:", e);
            }
        }

        // Logic giữ login khi F5 trang thường
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
        }
        
        setLoading(false); 
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // 4. LOGIC ĐĂNG NHẬP (Đã khớp với Backend trả về avatar_url)
    const login = async (username, password) => {
        setAuthActionLoading(true);
        try {
            const res = await api.post("/auth/signin", { username, password });
            const { user: userData, token } = res.data;
            
            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                return { success: true };
            }
            return { success: false, message: "Không nhận được token!" };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Lỗi đăng nhập!" };
        } finally {
            setAuthActionLoading(false);
        }
    };

    // 5. ĐĂNG XUẤT (An toàn cho bộ nhớ)
    const logout = async () => {
        try {
            await api.post("/auth/logout").catch(() => {}); 
        } finally {
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            // Xóa sạch lịch sử để tránh Extension nhảy về URL cũ có Token lỗi
            window.location.replace("/login");
        }
    };

    // 6. ĐĂNG KÝ
    const register = async (data) => {
        setAuthActionLoading(true);
        try {
            const res = await api.post("/auth/signup", data);
            return { success: true, message: res.data.message };
        } catch (e) {
            return { success: false, message: e.response?.data?.message || "Lỗi đăng ký!" };
        } finally {
            setAuthActionLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser, 
            updateUser, 
            login, 
            logout, 
            register, 
            loading, 
            authActionLoading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};