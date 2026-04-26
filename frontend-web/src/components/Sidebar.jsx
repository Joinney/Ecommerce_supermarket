import React, { useState, useRef, useEffect } from 'react';
import { Search, Tag, Flame, X } from "lucide-react";

// Demi lưu ý: Truyền prop isOpen và onClose từ App.jsx hoặc Header.jsx vào nhé
export default function Sidebar({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState("Tìm kiếm");
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  const mainMenus = [
    { n: "Tìm kiếm", i: <Search size={20} /> },
    { n: "Khuyến mãi", i: <Tag size={20} /> },
    { n: "Bán chạy", i: <Flame size={20} /> },
  ];

  const categories = [
    { n: "Đồ ăn liền", i: "🍜" }, { n: "Bánh mì", i: "🥐" }, { n: "Đồ ăn vặt", i: "🥨" },
    { n: "Đồ uống", i: "🥤" }, { n: "Sữa & Trứng", i: "🥚" }, { n: "Đồ chay", i: "🥗" },
    { n: "Gia vị", i: "🧴" }, { n: "Đồ đóng hộp", i: "🥫" }, { n: "Gạo & Đồ khô", i: "🥡" },
    { n: "Chăm sóc cá nhân", i: "🧼" }, { n: "Đồ gia dụng", i: "🏠" }, { n: "Rượu bia", i: "🍷" },
    { n: "Sơ chế sẵn", i: "🍱", hot: true }, { n: "Bánh tươi", i: "🥯", hot: true },
    { n: "Sức khỏe", i: "💊" }
  ];

  const footerLinks = [
    "Tải ứng dụng", "Quảng cáo", "Công ty", "Mua sỉ", "Hỗ trợ", "Bảo mật", "Điều khoản"
  ];

  return (
    <>
      {/* 1. OVERLAY (Lớp phủ đen khi mở trên điện thoại) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[10001] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 2. SIDEBAR MAIN */}
      <aside 
        onScroll={handleScroll}
        className={`
          /* Cấu trúc cố định */
          fixed lg:sticky z-[10002] lg:z-[99]
          top-0 lg:top-[112px] 
          h-full lg:h-[calc(100vh-112px)] 
          bg-[#F8FAF9] border-r border-slate-100 overflow-y-auto py-6 px-4 font-sans transition-all duration-300 ease-in-out
          
          /* Logic Ẩn/Hiện trên Mobile */
          w-[280px] sm:w-[300px] lg:w-[260px]
          ${isOpen ? 'left-0' : '-left-[300px] lg:left-0'}
          
          /* Scroll State */
          ${isScrolling ? 'demi-scroll-active' : 'demi-scroll-idle'}
        `}
      >
        {/* NÚT ĐÓNG (Chỉ hiện trên Mobile) */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute right-4 top-4 p-2 bg-white rounded-full shadow-sm text-slate-500 active:scale-90 transition-all"
        >
          <X size={20} strokeWidth={3} />
        </button>

        {/* 1. CHỌN CỬA HÀNG */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] group shadow-sm shrink-0 mt-8 lg:mt-0">
          <p className="text-[10px] font-black text-slate-400 uppercase text-center mb-1 tracking-[2px]">Chọn cửa hàng</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[15px] font-black text-[#161b22] tracking-tight group-hover:text-[#006c49] transition-colors italic">Demi Việt Nam</span>
            <span className="text-[10px] text-slate-400 group-hover:translate-y-0.5 transition-transform">▼</span>
          </div>
        </div>

        {/* 2. MENU CHÍNH */}
        <nav className="space-y-1 mb-4 pb-4 border-b border-slate-200/60 shrink-0">
          {mainMenus.map(m => (
            <div 
              key={m.n} 
              onClick={() => { setActiveCategory(m.n); if(window.innerWidth < 1024) onClose(); }}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300
                ${activeCategory === m.n 
                  ? 'bg-[#006c49] shadow-lg shadow-[#006c49]/20 text-white' 
                  : 'text-slate-900 hover:bg-[#e6f0ed] hover:text-[#006c49]'}`}
            >
              <span className={`transition-transform ${activeCategory === m.n ? 'scale-110 text-white' : 'text-black'}`}>
                {m.i}
              </span>
              <span className="text-[14px] font-black tracking-tight uppercase">{m.n}</span>
            </div>
          ))}
        </nav>

        {/* 3. DANH MỤC SẢN PHẨM */}
        <div className="space-y-1 flex-1 pb-6">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-3 ml-1">Danh mục sản phẩm</p>
          {categories.map(c => (
            <div 
              key={c.n} 
              onClick={() => { setActiveCategory(c.n); if(window.innerWidth < 1024) onClose(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all group
                ${activeCategory === c.n ? 'bg-white shadow-sm' : 'hover:bg-white/60'}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-sm transition-all duration-300
                ${activeCategory === c.n ? 'bg-[#006c49] text-white scale-105 shadow-[#006c49]/20' : 'bg-white group-hover:bg-[#e6f0ed] group-hover:text-[#006c49]'}`}>
                {c.i}
              </div>
              <span className={`text-[13.5px] flex-1 transition-colors ${activeCategory === c.n ? 'font-black text-[#161b22]' : 'font-bold text-slate-500 group-hover:text-slate-700'}`}>
                {c.n}
              </span>
              {c.hot && (
                <span className="bg-[#fea619] text-[8px] text-[#684000] px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter shadow-sm">HOT</span>
              )}
            </div>
          ))}
        </div>

        {/* 4. LIÊN KẾT PHỤ */}
        <div className="pt-6 border-t border-slate-200/60 space-y-3 px-3 shrink-0">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {footerLinks.map(link => (
              <a key={link} href="#" className="text-[10px] text-slate-400 font-black uppercase tracking-widest hover:text-[#006c49] transition-colors leading-tight">
                {link}
              </a>
            ))}
          </div>
          <p className="text-[9px] text-slate-300 font-black mt-4 uppercase tracking-[3px]">© 2026 DEMI MART</p>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          aside::-webkit-scrollbar { width: 6px; }
          aside::-webkit-scrollbar-track { background: transparent; }
          aside::-webkit-scrollbar-thumb {
            background-color: transparent;
            border-radius: 20px;
            background-clip: padding-box;
            transition: background-color 0.3s ease;
          }
          .demi-scroll-active::-webkit-scrollbar-thumb {
            background-color: #006c49 !important;
          }
        `}} />
      </aside>
    </>
  );
}