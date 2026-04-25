import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Logo from "../assets/Demi Mart.png";
import { Globe, ChevronDown, Check, Search, LogOut, MapPin } from "lucide-react";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);

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
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HÀM ĐĂNG XUẤT HOÀN CHỈNH ---
  const handleLogout = async () => {
    try {
      // 1. Gọi hàm logout từ AuthContext để xóa state user & xóa token trong đó
      await logout(); 
      
      // 2. Đảm bảo xóa sạch các dấu vết còn lại trong localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Nếu bạn có lưu user info riêng
      
      // 3. Điều hướng về trang chủ và dùng replace để xóa lịch sử chuyển trang
      // Dùng navigate giúp app mượt mà (SPA), nếu vẫn lỗi đen thì mới dùng window.location.href
      navigate("/", { replace: true });
      
    } catch (error) {
      console.error("Logout failed:", error);
      // Phương án dự phòng cuối cùng nếu React state bị kẹt
      window.location.href = "/";
    }
  };

  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(location.pathname);

  return (
    <header className="h-20 bg-white/95 backdrop-blur-md border-b border-slate-100 fixed top-0 w-full z-[10000] px-4 md:px-10 flex items-center justify-between shadow-sm font-sans transition-all">
      
      <div className="flex items-center gap-8 flex-1">
        {/* LOGO */}
        <Link to="/" className="flex items-center flex-shrink-0 hover:scale-105 transition-all duration-300">
          <img 
            src={Logo} 
            alt="Demi Mart" 
            className="h-8 md:h-9 w-auto object-contain drop-shadow-sm" 
          />
        </Link>

        {/* SEARCH BAR */}
        {!isAuthPage && (
          <div className="hidden md:flex flex-1 max-w-xl relative group">
            <Search 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#006c49] transition-colors z-10" 
              size={18} 
            />
            <input 
              type="text" 
              placeholder="Tìm sản phẩm tại Demi Mart..." 
              className="w-full bg-[#f8fafc] border border-transparent py-3 pl-12 pr-6 rounded-2xl outline-none focus:bg-white focus:border-[#006c49] focus:ring-4 focus:ring-[#006c49]/5 transition-all text-sm font-semibold text-slate-700 placeholder:text-slate-400 shadow-sm"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 md:gap-7 ml-4">
        {/* ĐỔI NGÔN NGỮ */}
        <div className="relative" ref={langRef}>
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2.5 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 transition-all active:scale-95 group shadow-sm"
          >
            <Globe size={18} className="text-slate-500 group-hover:text-[#006c49] transition-colors" />
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest hidden sm:block">
              {currentLang.code}
            </span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-3 w-52 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-fadeIn border-t-4 border-t-[#006c49]">
              <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Chọn ngôn ngữ</p>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    const codeMap = { vi: 'vi', en: 'en', zh: 'zh-CN' };
                    if (window.changeLanguageAuto) window.changeLanguageAuto(codeMap[lang.code]);
                    setCurrentLang(lang);
                    setIsLangOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    currentLang.code === lang.code 
                    ? 'bg-[#e6f0ed] text-[#006c49]' 
                    : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lang.flag}</span>
                    {lang.name}
                  </div>
                  {currentLang.code === lang.code && <Check size={16} strokeWidth={3} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GIAO TẠI */}
        <div className="hidden lg:flex flex-col items-end pr-6 border-r border-slate-100 group cursor-pointer">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 group-hover:text-[#006c49] transition-colors">Giao tại</p>
          <p className="text-[13px] font-black text-[#161b22] flex items-center gap-1.5">
            TP.HCM <MapPin size={15} className="text-[#fea619] fill-[#fea619]/10" />
          </p>
        </div>

        {/* AUTH SECTION */}
        {user ? (
          <div className="flex items-center gap-4 bg-[#f8fafc] pl-4 pr-1.5 py-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Thành viên Demi</p>
              <p className="text-[13px] font-black text-slate-900 leading-none mt-0.5">{user.full_name || 'Khách'}</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="bg-white text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90 border border-slate-100 group"
              title="Đăng xuất"
            >
              <LogOut size={18} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate("/login")}
            className="bg-[#006c49] hover:bg-[#004d34] text-white px-8 py-3 rounded-2xl text-[11px] font-black transition-all shadow-lg shadow-[#006c49]/20 hover:shadow-[#006c49]/40 active:scale-95 uppercase tracking-widest"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}