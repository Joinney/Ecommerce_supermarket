import React from 'react';
// Import logo chuẩn (đảm bảo file tồn tại trong thư mục assets)
import Logo from "../assets/Demi Mart.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-12 px-10 mt-20 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        
        {/* Cột 1: Brand & Logo (Chiếm 2 cột để nổi bật) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col items-start">
            <img 
              src={Logo} 
              alt="Demi Mart" 
              className="h-12 object-contain mb-2"
              // Nếu ảnh lỗi đường dẫn, nó sẽ tự ẩn đi chứ không làm trắng màn hình
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            
          </div>
          <p className="text-gray-500 text-[13px] leading-relaxed max-w-sm font-semibold">
            America’s largest online Asian supermarket. <br/>
            Hương vị quê hương, chất lượng quốc tế ngay tại nhà bạn.
          </p>
        </div>

        {/* Cột 2: Về chúng tôi */}
        <div className="space-y-5">
          <h4 className="text-[#161b22] font-black uppercase text-[11px] tracking-[2px]">Về chúng tôi</h4>
          <ul className="text-gray-500 text-[13px] space-y-3 font-semibold">
            <li className="hover:text-[#006c49] cursor-pointer transition-colors">Câu chuyện Demi Mart</li>
            <li className="hover:text-[#006c49] cursor-pointer transition-colors">Tuyển dụng</li>
            <li className="hover:text-[#006c49] cursor-pointer transition-colors">Hệ thống cửa hàng</li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div className="space-y-5">
          <h4 className="text-[#161b22] font-black uppercase text-[11px] tracking-[2px]">Hỗ trợ</h4>
          <ul className="text-gray-500 text-[13px] space-y-3 font-semibold">
            <li className="hover:text-[#006c49] cursor-pointer transition-colors">Chính sách đổi trả</li>
            <li className="hover:text-[#006c49] cursor-pointer transition-colors">Phí vận chuyển</li>
            <li className="hover:text-[#006c49] cursor-pointer transition-colors">Câu hỏi thường gặp</li>
          </ul>
        </div>

        {/* Cột 4: Tải ứng dụng */}
        <div className="space-y-5">
          <h4 className="text-[#161b22] font-black uppercase text-[11px] tracking-[2px]">Tải ứng dụng</h4>
          <div className="space-y-3 max-w-[180px]">
             <div className="bg-[#161b22] p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-black transition-all shadow-md active:scale-95 group">
                <div className="text-white text-xl group-hover:scale-110 transition-transform"></div>
                <div className="leading-none">
                  <p className="text-[8px] font-bold text-white/60 uppercase">Download on the</p>
                  <p className="text-[13px] font-black text-white">App Store</p>
                </div>
             </div>
             <div className="bg-[#161b22] p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-black transition-all shadow-md active:scale-95 group">
                <div className="text-white text-lg group-hover:scale-110 transition-transform">▶</div>
                <div className="leading-none">
                  <p className="text-[8px] font-bold text-white/50 uppercase">Get it on</p>
                  <p className="text-[13px] font-black text-white">Google Play</p>
                </div>
             </div>
          </div>
        </div>

      </div>

      {/* Bản quyền */}
      <div className="max-w-7xl mx-auto border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[1.5px]">
          © {currentYear} Demi Supermarket. Built for ETECHS Internship Project.
        </p>
        
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#006c49] rounded-full animate-pulse shadow-[0_0_8px_#006c49]"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Online</span>
           </div>
           <div className="flex gap-4 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
              <div className="w-8 h-5 bg-gray-200 rounded"></div>
              <div className="w-8 h-5 bg-gray-200 rounded"></div>
           </div>
        </div>
      </div>
    </footer>
  );
}