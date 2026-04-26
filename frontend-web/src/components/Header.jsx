import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Logo from "../assets/Demi Mart.png";
import { 
  Globe, ChevronDown, Check, Search, LogOut, MapPin, 
  ShoppingCart, Calendar, User, Gift, Menu // 1. Bổ sung thêm icon Menu ở đây
} from "lucide-react";

// 2. Nhận prop onOpenMenu từ App.jsx
export default function Header({ onOpenMenu }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);
  const [currentDate, setCurrentDate] = useState("");

  // Logic ngày tháng Tiếng Việt
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
    if (saved === 'en') return languages[1];
    if (saved === 'zh-CN') return languages[2];
    return languages[0];
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) setIsLangOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logic Logout triệt để
  const handleLogout = async () => {
    try {
      await logout(); 
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const name = cookies[i].split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      }
      window.location.href = "/";
    } catch (error) { window.location.href = "/"; }
  };

  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(location.pathname);
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "D";

  return (
    <header className="fixed top-0 w-full z-[10000] font-sans shadow-sm bg-white/95 backdrop-blur-md">
      
      {/* TẦNG 1 */}
      <div className="h-[64px] md:h-[72px] px-4 md:px-10 flex items-center justify-between gap-4 md:gap-8 border-b border-slate-50">
        
        {/* 3. BỔ SUNG NÚT MENU Ở ĐÂY (Chỉ hiện trên mobile < 1024px) */}
        <button 
          onClick={onOpenMenu} 
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Menu size={24} />
        </button>

        <Link to="/" className="flex-shrink-0 transition-transform active:scale-95 hover:scale-105 duration-300">
          <img src={Logo} alt="Demi Mart" className="h-7 md:h-9 w-auto object-contain drop-shadow-sm" />
        </Link>

        {!isAuthPage && (
          <div className="flex-1 max-w-2xl relative group hidden md:block">
            <input 
              type="text" 
              placeholder="Tìm sản phẩm tại Demi Mart..." 
              className="w-full bg-[#f3f6f9] border-2 border-transparent py-2.5 pl-6 pr-14 rounded-full outline-none focus:bg-white focus:border-[#006c49] text-sm font-bold text-slate-700 shadow-inner"
            />
            <button className="absolute right-1 top-1 bottom-1 w-12 flex items-center justify-center bg-[#006c49] text-white rounded-full">
              <Search size={18} strokeWidth={3} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
          {/* Ngôn ngữ */}
          <div className="relative" ref={langRef}>
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1.5 text-slate-600 hover:text-[#006c49]">
              <Globe size={18} />
              <span className="text-[11px] font-black uppercase hidden sm:block">{currentLang.code}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLangOpen && (
              <div className="absolute right-0 mt-4 w-52 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-fadeIn border-t-4 border-t-[#006c49]">
                {languages.map((l) => (
                  <button key={l.code} onClick={() => { setCurrentLang(l); setIsLangOpen(false); localStorage.setItem('demi_mart_lang', l.code); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentLang.code === l.code ? 'bg-[#e6f0ed] text-[#006c49]' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-3"><span>{l.flag}</span>{l.name}</div>
                    {currentLang.code === l.code && <Check size={16} strokeWidth={3} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cụm Auth */}
          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <div className="flex items-center gap-2 md:gap-3 bg-[#f8fafc] p-1 md:p-1.5 rounded-full border border-slate-100 md:pr-4 group transition-all">
                <Link to="/profile" className="relative flex-shrink-0">
                  <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name}&background=006c49&color=fff`} className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-white shadow-sm" alt="AVT" />
                </Link>
                <div className="hidden lg:block text-left overflow-hidden">
                  <p className="text-[11px] font-black text-slate-900 leading-tight truncate max-w-[80px]">{user.full_name}</p>
                  <p className="text-[9px] font-bold text-[#006c49] uppercase">Thành viên</p>
                </div>
                <button onClick={handleLogout} className="text-slate-300 hover:text-red-500 transition-all ml-1"><LogOut size={16}/></button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[13px] md:text-[14px]">
                <User size={18} className="text-slate-800" />
                <div className="flex items-center">
                  <Link to="/login" className="hover:text-[#006c49] transition-colors whitespace-nowrap">Đăng nhập</Link>
                  <span className="mx-1 text-slate-300 font-light hidden md:inline">/</span>
                  <Link to="/signup" className="hover:text-[#006c49] transition-colors whitespace-nowrap hidden md:inline">Đăng ký</Link>
                </div>
              </div>
            )}

            {/* Giỏ hàng */}
            <button className="bg-[#006c49] text-white px-5 md:px-7 py-2.5 md:py-3 rounded-full md:rounded-2xl flex items-center gap-3 shadow-lg shadow-[#006c49]/20 hover:bg-[#004d34] active:scale-95 transition-all flex-shrink-0">
              <div className="relative">
                <ShoppingCart size={18} strokeWidth={2.5} />
                <span className="absolute -top-2 -right-2 bg-[#fea619] text-[#161b22] text-[9px] md:text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#006c49]">2</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest hidden lg:block">Giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* TẦNG 2 */}
      <div className="h-9 md:h-10 bg-white border-b border-slate-100 px-4 md:px-10 flex items-center justify-between overflow-x-auto scrollbar-hide">
        <nav className="flex items-center gap-6 md:gap-8 whitespace-nowrap">
          {["Toàn cầu+", "Hàng mới về", "Bán chạy", "Ưu đãi"].map((item) => (
            <Link key={item} to="/" className="text-[10px] md:text-[11px] font-black text-slate-500 hover:text-[#006c49] uppercase tracking-widest">{item}</Link>
          ))}
          <Link to="/" className="text-[10px] md:text-[11px] font-black text-[#a855f7] flex items-center gap-2 animate-pulse">
            <Gift size={14} /> Giới thiệu nhận ngay 20$!
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-6 flex-shrink-0 ml-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#fea619]" />
            <span className="text-[11px] font-black text-slate-700 uppercase">TP. Hồ Chí Minh</span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-100 pl-6 uppercase">
            <Calendar size={15} className="text-slate-400" />
            <span className="text-[11px] font-black text-slate-600">{currentDate}</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}} />
    </header>
  );
}