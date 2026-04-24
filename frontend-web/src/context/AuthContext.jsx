import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [authActionLoading, setAuthActionLoading] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            // 1. "Bẫy" dữ liệu Google từ URL (?token=...&user=...)
            const params = new URLSearchParams(window.location.search);
            const tokenFromUrl = params.get("token");
            const userFromUrl = params.get("user");

            if (tokenFromUrl && userFromUrl) {
                try {
                    const userData = JSON.parse(decodeURIComponent(userFromUrl));
                    
                    // Lưu ngay vào kho
                    localStorage.setItem("accessToken", tokenFromUrl);
                    localStorage.setItem("user", JSON.stringify(userData));
                    
                    // Set state để Header hiện tên luôn
                    setUser(userData);

                    // Gọt sạch URL để thanh địa chỉ đẹp lại (localhost:5173/)
                    window.history.replaceState({}, document.title, window.location.pathname);
                } catch (e) {
                    console.error("❌ Lỗi xử lý dữ liệu Google từ URL:", e);
                }
            } else {
                // 2. Nếu không có trên URL thì mới kiểm tra kho LocalStorage cũ
                const savedUser = localStorage.getItem("user");
                const token = localStorage.getItem("accessToken");

                if (savedUser && token) {
                    try {
                        setUser(JSON.parse(savedUser));
                    } catch (e) {
                        localStorage.removeItem("user");
                        localStorage.removeItem("accessToken");
                    }
                }
            }
            
            // 3. CHỐT HẠ: Tắt loading để hiện giao diện (Hết đen màn hình)
            setLoading(false); 
        };

        checkAuth();
    }, []);

    // Logic Đăng nhập thường
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
            return { success: false, message: error.response?.data?.message || "Lỗi đăng nhập!" };
        } finally {
            setAuthActionLoading(false);
        }
    };

    // Logic Đăng ký
    const register = async (userData) => {
        setAuthActionLoading(true);
        try {
            const res = await api.post("/auth/signup", userData);
            return { success: true, message: res.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Lỗi đăng ký!" };
        } finally {
            setAuthActionLoading(false);
        }
    };

    // Logic Đăng xuất
    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser,
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