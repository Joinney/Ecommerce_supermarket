import React, { useState } from 'react';

export default function Sidebar() {
  const [activeCategory, setActiveCategory] = useState("Tìm kiếm");

  const mainMenus = [
    { n: "Tìm kiếm", i: "🔍" },
    { n: "Khuyến mãi", i: "🏷️" },
    { n: "Bán chạy", i: "⭐" },
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
    "Tải ứng dụng", "Quảng cáo", "Công ty", "Mua sỉ doanh nghiệp", 
    "Trung tâm hỗ trợ", "Bảo mật", "Điều khoản"
  ];

  return (
    <aside className="w-[260px] hidden lg:flex flex-col sticky top-20 h-[calc(100vh-80px)] bg-[#F8FAF9] border-r border-slate-100 overflow-y-auto scrollbar-hide py-6 px-4 font-sans transition-all">
      
      {/* 1. CHỌN CỬA HÀNG - Style đồng bộ Header */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-8 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] group shadow-sm">
        <p className="text-[10px] font-black text-slate-400 uppercase text-center mb-1 tracking-[2px]">Chọn cửa hàng</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-[15px] font-black text-[#161b22] tracking-tight group-hover:text-[#006c49] transition-colors italic">Demi Việt Nam</span>
          <span className="text-[10px] text-slate-400 group-hover:translate-y-0.5 transition-transform">▼</span>
        </div>
      </div>

      {/* 2. MENU CHÍNH - Màu Active Xanh #006c49 chuẩn Login */}
      <nav className="space-y-1.5 mb-8 pb-8 border-b border-slate-200/60">
        {mainMenus.map(m => (
          <div 
            key={m.n} 
            onClick={() => setActiveCategory(m.n)}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300
              ${activeCategory === m.n 
                ? 'bg-[#006c49] shadow-lg shadow-[#006c49]/20 text-white' 
                : 'text-slate-500 hover:bg-[#e6f0ed] hover:text-[#006c49]'}`}
          >
            <span className={`text-xl transition-transform ${activeCategory === m.n ? 'scale-110' : 'opacity-70'}`}>{m.i}</span>
            <span className="text-[14px] font-black tracking-tight uppercase">{m.n}</span>
          </div>
        ))}
      </nav>

      {/* 3. DANH MỤC SẢN PHẨM */}
      <div className="space-y-1 flex-1 pb-8">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4 ml-1">Danh mục sản phẩm</p>
        {categories.map(c => (
          <div 
            key={c.n} 
            onClick={() => setActiveCategory(c.n)}
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
      <div className="pt-8 border-t border-slate-200/60 space-y-3 px-3">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {footerLinks.map(link => (
            <a key={link} href="#" className="text-[10px] text-slate-400 font-black uppercase tracking-widest hover:text-[#006c49] transition-colors leading-tight">
              {link}
            </a>
          ))}
        </div>
        <p className="text-[9px] text-slate-300 font-black mt-6 uppercase tracking-[3px]">© 2026 DEMI MART</p>
      </div>

    </aside>
  );
}