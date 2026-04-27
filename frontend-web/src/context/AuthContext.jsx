import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [authActionLoading, setAuthActionLoading] = useState(false);

    // Dùng useCallback để hàm không bị khởi tạo lại dư thừa
    const checkAuth = useCallback(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get("token");
        const userFromUrl = params.get("user");

        if (tokenFromUrl && userFromUrl) {
            try {
                const userData = JSON.parse(decodeURIComponent(userFromUrl));
                localStorage.setItem("accessToken", tokenFromUrl);
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                // Gọt URL mượt mà không load lại trang
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (e) {
                console.error("❌ Lỗi dữ liệu Google:", e);
            }
        } else {
            const savedUser = localStorage.getItem("user");
            const token = localStorage.getItem("accessToken");
            if (savedUser && token) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    localStorage.clear();
                }
            }
        }
        // Tắt loading TRƯỚC KHI kết thúc để App.jsx biết đường mà render
        setLoading(false); 
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (username, password) => {
        setAuthActionLoading(true);
        try {
            const res = await api.post("/auth/signin", { username, password });
            const { user: userData, accessToken } = res.data;
            
            // QUAN TRỌNG: Lưu dữ liệu TRƯỚC khi báo thành công
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Lỗi đăng nhập!" };
        } finally {
            setAuthActionLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            // KHÔNG dùng window.location.href để tránh chớp đen toàn trang
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            // Để logic chuyển hướng cho component xử lý bằng useNavigate
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, setUser, login, logout, register: async (data) => {
                setAuthActionLoading(true);
                try {
                    const res = await api.post("/auth/signup", data);
                    return { success: true, message: res.data.message };
                } catch (e) {
                    return { success: false, message: e.response?.data?.message || "Lỗi!" };
                } finally { setAuthActionLoading(false); }
            }, 
            loading, 
            authActionLoading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};