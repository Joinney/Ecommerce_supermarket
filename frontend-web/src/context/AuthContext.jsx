import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Khởi tạo user từ LocalStorage
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            return null;
        }
    });

    const [loading, setLoading] = useState(false);

    // Kiểm tra tính hợp lệ của token khi load trang (Tùy chọn nhưng nên có)
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setUser(null);
        }
    }, []);

    // 1. Logic Đăng nhập
    const login = async (username, password) => {
        setLoading(true);
        try {
            const res = await api.post("/auth/signin", { username, password });
            
            const userData = res.data.user;
            const token = res.data.accessToken;

            setUser(userData);
            localStorage.setItem("accessToken", token);
            localStorage.setItem("user", JSON.stringify(userData));
            
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error.response?.data);
            return { 
                success: false, 
                message: error.response?.data?.message || "Sai tài khoản hoặc mật khẩu!" 
            };
        } finally {
            setLoading(false);
        }
    };

    // 2. Logic Đăng ký (Đã tối ưu để khớp với dữ liệu đầy đủ)
    const register = async (userData) => {
        setLoading(true);
        try {
            // Đảm bảo các trường dữ liệu phone, gender, birth_date luôn có mặt
            const res = await api.post("/auth/signup", userData);
            return { 
                success: true, 
                message: res.data.message || "Đăng ký thành công!" 
            };
        } catch (error) {
            console.error("Register Error:", error.response?.data);
            return { 
                success: false, 
                message: error.response?.data?.message || "Đăng ký không thành công, Demi kiểm tra lại nhé!" 
            };
        } finally {
            setLoading(false);
        }
    };

    // 3. Logic Đăng xuất
    const logout = async () => {
        setLoading(true);
        try {
            // Cố gắng gọi backend để hủy session/cookie
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout API error (ignored):", error);
        } finally {
            // Xóa sạch dấu vết ở Frontend
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            // Không nên dùng clear() để tránh xóa nhầm dữ liệu khác của app nếu có
            
            setLoading(false);
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};