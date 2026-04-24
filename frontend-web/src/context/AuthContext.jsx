import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // loading này dùng để đợi React kiểm tra LocalStorage xong mới cho Render Router
    const [loading, setLoading] = useState(true); 
    // authActionLoading dùng để hiện loading khi đang bấm nút Login/Register
    const [authActionLoading, setAuthActionLoading] = useState(false);

    // KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP KHI MỞ APP/F5
    useEffect(() => {
        const checkAuth = () => {
            const savedUser = localStorage.getItem("user");
            const token = localStorage.getItem("accessToken");

            if (savedUser && token) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    localStorage.removeItem("user");
                }
            } else {
                setUser(null);
            }
            // Quan trọng nhất: Báo cho App biết đã check xong, có thể đứng yên tại trang hiện tại
            setLoading(false); 
        };

        checkAuth();
    }, []);

    // 1. Logic Đăng nhập
    const login = async (username, password) => {
        setAuthActionLoading(true);
        try {
            const res = await api.post("/auth/signin", { username, password });
            const { user: userData, accessToken } = res.data;

            setUser(userData);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("user", JSON.stringify(userData));
            
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Sai tài khoản hoặc mật khẩu!" 
            };
        } finally {
            setAuthActionLoading(false);
        }
    };

    // 2. Logic Đăng ký
    const register = async (userData) => {
        setAuthActionLoading(true);
        try {
            const res = await api.post("/auth/signup", userData);
            return { success: true, message: res.data.message };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Đăng ký thất bại!" 
            };
        } finally {
            setAuthActionLoading(false);
        }
    };

    // 3. Logic Đăng xuất
    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            // Điều hướng về login
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            register, 
            loading, // Dùng để chặn Route khi đang F5
            authActionLoading // Dùng để hiện icon loading ở nút bấm
        }}>
            {children}
        </AuthContext.Provider>
    );
};