import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="h-20 bg-[#161b22]/80 backdrop-blur-xl border-b border-white/10 fixed top-0 w-full z-50 px-4 md:px-10 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-2xl font-black tracking-tighter text-blue-500">
        DEMI<span className="text-white font-light">WEEE</span>
      </Link>

      {/* Search Bar - Giống mẫu Weee! */}
      <div className="hidden md:flex flex-1 max-w-2xl mx-10">
        <div className="relative w-full">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm cực tươi tại Demi Mart..." 
            className="w-full bg-white/5 border border-white/10 py-2.5 px-5 rounded-full outline-none focus:border-blue-500 focus:bg-white/10 transition text-sm"
          />
          <button className="absolute right-4 top-2 text-gray-400">🔍</button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <div className="hidden sm:block text-right">
          <p className="text-xs text-gray-400">Giao hàng tại</p>
          <p className="text-sm font-bold text-blue-400">TP. Hồ Chí Minh 📍</p>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Hi, {user.full_name || 'Demi'}</span>
            <button onClick={logout} className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-lg border border-red-500/20">Đăng xuất</button>
          </div>
        ) : (
          <button 
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-blue-500/20"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}