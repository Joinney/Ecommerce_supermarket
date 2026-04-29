import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Logo from "../assets/Demi Mart.png";
import api from "../api/axios";
import { 
  Globe, ChevronDown, Check, Search, LogOut, MapPin, 
  ShoppingCart, Calendar, Gift, Menu 
} from "lucide-react";

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocalhost ? 'http://localhost:5000' : 'https://ecommerce-supermarket-k691.onrender.com';

export default function Header({ onOpenMenu }) {
  const { user: authUser, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);
  const [currentDate, setCurrentDate] = useState("");

  // --- 1. RENDER MỒI TỨC THÌ (GIỮ ẢNH CỨNG TRÊN HEADER) ---
  const [displayUser, setDisplayUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  // Đồng bộ displayUser khi AuthContext cập nhật xong
  useEffect(() => {
    if (authUser) setDisplayUser(authUser);
  }, [authUser]);

  // --- 2. LOGIC BẢO VỆ GOOGLE AUTH & ĐỒNG BỘ DB ---
  useEffect(() => {
    const checkAuthStatus = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("token")) return; 

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.exp * 1000 < Date.now()) {
              handleLogout();
              return;
            }
          }

          if (!authUser) {
            const res = await api.get("/profile/hoso");
            if (res.data.success) {
              setUser(res.data.data);
              localStorage.setItem('user', JSON.stringify(res.data.data));
            }
          }
        } catch (e) { console.log("Syncing..."); }
      }
    };

    const timer = setTimeout(checkAuthStatus, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname, authUser, setUser]);

  // --- 3. HÀM LẤY ẢNH (TỐI ƯU CỰC MẠNH) ---
  const getAvatarSrc = (userObj) => {
    // Check cả 2 trường avatar_url và avatar để tránh sót dữ liệu từ Backend
    const url = userObj?.avatar_url || userObj?.avatar;
    const name = userObj?.full_name || 'User';

    if (!url || url === "" || url.includes('unsplash.com')) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=006c49&color=fff`;
    }
    
    if (url.startsWith('http')) return url;
    
    // Xử lý dấu gạch chéo để tránh lỗi double slash (//)
    const cleanPath = url.startsWith('/') ? url.substring(1) : url;
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
    
    return `${base}${cleanPath}`;
  };

  const handleLogout = async () => {
    try {
      await logout(); 
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.replace("/login");
    } catch (error) { 
      localStorage.clear();
      window.location.replace("/login"); 
    }
  };

  // --- CÁC LOGIC PHỤ ---
  useEffect(() => {
    const options = { weekday: 'long', day: 'numeric', month: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('vi-VN', options));
  }, []);

  const languages = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  const [currentLang, setCurrentLang] = useState(() => {
    const saved = localStorage.getItem('demi_mart_lang');
    return languages.find(l => l.code === saved) || languages[0];
  });

  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(location.pathname);

  return (
    <header className="fixed top-0 w-full z-[10000] font-sans shadow-sm bg-white/95 backdrop-blur-md min-h-[96px] md:min-h-[112px]">
      <div className="h-[60px] md:h-[72px] px-3 md:px-10 flex items-center justify-between gap-2 border-b border-slate-50">
        
        {/* LOGO */}
        <div className="flex items-center gap-1 md:gap-4 flex-shrink-0">
          <button onClick={onOpenMenu} className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <Menu size={22} />
          </button>
          <Link to="/" className="transition-transform active:scale-95 block">
            <img src={Logo} alt="Demi Mart" width="130" className="h-6 md:h-8 w-auto object-contain drop-shadow-sm" />
          </Link>
        </div>

        {/* SEARCH */}
        {!isAuthPage && (
          <div className="flex-1 max-w-xl relative hidden sm:block">
            <input type="text" placeholder="Tìm sản phẩm..." className="w-full bg-[#f3f6f9] border-2 border-transparent py-2 md:py-2.5 pl-5 pr-12 rounded-full outline-none focus:bg-white focus:border-[#006c49] transition-all text-xs md:text-sm font-bold text-slate-700 shadow-inner" />
            <button className="absolute right-1 top-1 bottom-1 w-10 md:w-12 flex items-center justify-center bg-[#006c49] text-white rounded-full">
              <Search size={16} strokeWidth={3} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-6 flex-shrink-0 justify-end">
          {/* USER SECTION */}
          <div className="flex items-center min-w-[120px] justify-end">
            {displayUser ? (
              <div className="flex items-center gap-2 md:gap-3 bg-[#f8fafc] p-1 md:p-1.5 rounded-full border border-slate-100 md:pr-3 group transition-all">
                {/* SỬA LỖI: Chỉ dùng 1 thẻ Link duy nhất bao quanh Avatar */}
                <Link to="/profile" className="flex-shrink-0 active:scale-90 transition-transform">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-100">
                    <img 
                      key={displayUser?.avatar_url || displayUser?.avatar}
                      src={getAvatarSrc(displayUser)} 
                      className="w-full h-full object-cover" 
                      alt="User"
                      onError={(e) => { 
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUser?.full_name || 'User')}&background=006c49&color=fff`;
                      }} 
                    />
                  </div>
                </Link>
                <div className="hidden lg:block text-left overflow-hidden">
                  <p className="text-[11px] font-black text-slate-900 leading-tight truncate max-w-[80px]">{displayUser.full_name}</p>
                </div>
                <button onClick={handleLogout} className="text-slate-300 hover:text-red-500 transition-all ml-1"><LogOut size={16}/></button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs md:text-sm whitespace-nowrap">
                <Link to="/login" className="hover:text-[#006c49] transition-colors">Đăng nhập</Link>
                <span className="text-slate-300 font-light">/</span>
                <Link to="/signup" className="hover:text-[#006c49] transition-colors">Đăng ký</Link>
              </div>
            )}
          </div>

          <button className="bg-[#006c49] text-white p-2 md:px-5 md:py-2.5 rounded-full md:rounded-2xl flex items-center gap-2 shadow-lg shadow-[#006c49]/20 active:scale-95 transition-all">
            <div className="relative">
              <ShoppingCart size={18} strokeWidth={2.5} />
              <span className="absolute -top-2 -right-2 bg-[#fea619] text-[#161b22] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#006c49]">2</span>
            </div>
            <span className="text-[11px] font-black uppercase hidden lg:block tracking-widest">Giỏ hàng</span>
          </button>
        </div>
      </div>

      <div className="h-9 md:h-10 bg-white border-b border-slate-100 px-3 md:px-10 flex items-center justify-between overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-5 md:gap-8 whitespace-nowrap min-w-max">
          {["Toàn cầu+", "Mới về", "Bán chạy", "Ưu đãi"].map((item) => (
            <Link key={item} to="/" className="text-[10px] md:text-[11px] font-black text-slate-500 hover:text-[#006c49] uppercase tracking-widest transition-colors">{item}</Link>
          ))}
          <Link to="/" className="text-[10px] md:text-[11px] font-black text-[#a855f7] flex items-center gap-2 animate-pulse">
            <Gift size={14} /> Nhận $20!
          </Link>
        </nav>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
      `}} />
    </header>
  );
}