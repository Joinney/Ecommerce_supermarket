import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // Thêm state để hiện lỗi ngay trên form
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Xóa lỗi cũ trước khi thử lại
        setLoading(true);
        
        const result = await login(username, password);
        
        if (result.success) {
            // Nhờ cấu trúc Nested Layout ở App.jsx, navigate("/") sẽ tự động 
            // kích hoạt AppLayout và hiện lại Header/Sidebar mà không cần load lại trang.
            navigate("/"); 
        } else {
            setError(result.message); // Hiển thị lỗi trực tiếp lên giao diện
        }
        setLoading(false);
    };

    return (
        <div className="w-full max-w-md animate-fadeIn">
            <form onSubmit={handleSubmit} className="p-10 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-black text-blue-500 tracking-tighter">DEMI LOGIN</h2>
                    <p className="text-gray-400 text-sm mt-2">Chào mừng Demi quay trở lại!</p>
                </div>
                
                {/* Hiển thị lỗi nếu có */}
                {error && (
                    <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 text-red-400 text-sm rounded-xl text-center">
                        {error}
                    </div>
                )}
                
                <div className="space-y-4">
                    <div className="group">
                        <label className="text-xs text-gray-500 ml-4 mb-1 block">Username</label>
                        <input 
                            type="text" 
                            placeholder="Nhập tài khoản..." 
                            required
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 focus:bg-white/10 text-white transition-all shadow-inner"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="group">
                        <label className="text-xs text-gray-500 ml-4 mb-1 block">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            required
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 focus:bg-white/10 text-white transition-all shadow-inner"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button 
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold mt-8 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            ĐANG XÁC THỰC...
                        </span>
                    ) : "ĐĂNG NHẬP NGAY"}
                </button>
                
                <p className="text-center mt-8 text-sm text-gray-400">
                    Chưa có tài khoản?{" "}
                    <Link to="/signup" className="text-blue-400 font-semibold hover:underline transition-all">
                        Tạo tài khoản mới
                    </Link>
                </p>
            </form>
            
            {/* Link quay về trang chủ cho khách */}
            <p className="text-center mt-6">
                <Link to="/" className="text-gray-500 text-sm hover:text-white transition-colors">
                    ← Quay lại trang chủ xem hàng
                </Link>
            </p>
        </div>
    );
}