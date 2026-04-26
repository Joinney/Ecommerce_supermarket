import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Logo from "../assets/Demi Mart.png";
import { 
  Globe, ChevronDown, Check, Search, LogOut, MapPin, 
  ShoppingCart, Calendar, User, Gift 
} from "lucide-react";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);
  const [currentDate, setCurrentDate] = useState("");

  // Logic lấy ngày tháng cũ của bạn
  useEffect(() => {
    const options = { weekday: 'long', day: 'numeric', month: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('vi-VN', options));
  }, []);

  // Logic đa ngôn ngữ cũ của bạn
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

  // Đóng dropdown ngôn ngữ khi bấm ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logic Logout triệt để của bạn
  const handleLogout = async () => {
    try {
      await logout(); 
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname};`;
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/";
    }
  };

  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(location.pathname);
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "D";

  return (
    <header className="fixed top-0 w-full z-[10000] font-sans shadow-sm bg-white/95 backdrop-blur-md">
      
      {/* --- TẦNG 1: MAIN (72px) --- */}
      <div className="h-[72px] px-4 md:px-10 flex items-center justify-between gap-8 border-b border-slate-50">
        
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 transition-transform active:scale-95 hover:scale-105 duration-300">
          <img src={Logo} alt="Demi Mart" className="h-8 md:h-9 w-auto object-contain drop-shadow-sm" />
        </Link>

        {/* Search Bar - Logic Search Bar cũ */}
        {!isAuthPage && (
          <div className="flex-1 max-w-2xl relative group hidden md:block">
            <input 
              type="text" 
              placeholder="Tìm sản phẩm tại Demi Mart..." 
              className="w-full bg-[#f3f6f9] border-2 border-transparent py-2.5 pl-6 pr-14 rounded-full outline-none focus:bg-white focus:border-[#006c49] transition-all text-sm font-bold text-slate-700 shadow-inner"
            />
            <button className="absolute right-1 top-1 bottom-1 w-12 flex items-center justify-center bg-[#006c49] text-white rounded-full hover:bg-[#004d34] transition-all shadow-md">
              <Search size={18} strokeWidth={3} />
            </button>
          </div>
        )}

        {/* Action Group */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Ngôn ngữ */}
          <div className="relative" ref={langRef}>
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-2 text-slate-600 hover:text-[#006c49] transition-all group">
              <Globe size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest hidden sm:block">{currentLang.code}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLangOpen && (
              <div className="absolute right-0 mt-4 w-52 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-fadeIn border-t-4 border-t-[#006c49]">
                <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Chọn ngôn ngữ</p>
                {languages.map((l) => (
                  <button key={l.code} onClick={() => { setCurrentLang(l); setIsLangOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentLang.code === l.code ? 'bg-[#e6f0ed] text-[#006c49]' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'}`}>
                    <div className="flex items-center gap-3"><span>{l.flag}</span>{l.name}</div>
                    {currentLang.code === l.code && <Check size={16} strokeWidth={3} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Auth - Logic Avatar chuẩn của bạn */}
          {user ? (
            <div className="flex items-center gap-3 bg-[#f8fafc] p-1.5 rounded-full border border-slate-100 pr-4 group hover:border-[#006c49]/30 transition-all">
              <Link to="/profile" className="relative">
                {user.avatar_url ? (
                  <img src={user.avatar_url} className="w-9 h-9 rounded-full border-2 border-white shadow-sm group-hover:border-[#006c49] transition-all object-cover" alt="AVT" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#006c49] flex items-center justify-center text-white font-black text-xs border-2 border-white shadow-sm group-hover:scale-105 transition-all">
                    {getInitial(user.full_name)}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
              </Link>
              <div className="hidden lg:block text-left">
                <p className="text-[12px] font-black text-slate-900 leading-tight truncate max-w-[100px]">{user.full_name}</p>
                <p className="text-[10px] font-bold text-[#006c49] uppercase">Thành viên</p>
              </div>
              <button onClick={handleLogout} className="text-slate-300 hover:text-red-500 transition-all ml-1" title="Đăng xuất">
                <LogOut size={16}/>
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="text-xs font-black text-slate-700 hover:text-[#006c49] flex items-center gap-2 uppercase tracking-widest">
              <User size={18} /> Đăng nhập
            </button>
          )}

          {/* Giỏ hàng */}
          <button className="bg-[#006c49] text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-[#006c49]/20 hover:bg-[#004d34] transition-all active:scale-95">
            <div className="relative">
              <ShoppingCart size={20} strokeWidth={2.5} />
              <span className="absolute -top-2 -right-2 bg-[#fea619] text-[#161b22] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">2</span>
            </div>
            <span className="text-xs font-black uppercase tracking-widest hidden lg:block">Giỏ hàng</span>
          </button>
        </div>
      </div>

      {/* --- TẦNG 2: NAV (40px) --- */}
      <div className="h-10 bg-white border-b border-slate-100 px-4 md:px-10 flex items-center justify-between">
        <nav className="flex items-center gap-8">
          {["Toàn cầu+", "Hàng mới về", "Bán chạy nhất", "Ưu đãi"].map((item) => (
            <Link key={item} to="/" className="text-[11px] font-black text-slate-600 hover:text-[#006c49] transition-colors uppercase tracking-widest">
              {item}
            </Link>
          ))}
          <Link to="/" className="text-[11px] font-black text-[#a855f7] flex items-center gap-2 animate-pulse">
            <Gift size={14} /> Giới thiệu bạn bè, nhận ngay 20$!
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#fea619]" />
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">700000 TP.HCM</span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
            <Calendar size={15} className="text-slate-400" />
            <span className="text-[11px] font-black text-slate-600 capitalize">{currentDate}</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}} />
    </header>
  );
}