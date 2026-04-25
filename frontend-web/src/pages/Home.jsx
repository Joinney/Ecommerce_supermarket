import React, { useRef } from 'react';
import { ChevronRight, ArrowRight, Star, QrCode, Plus } from 'lucide-react';

// --- DATA SẢN PHẨM ---
const products = [
  { id: 1, name: "Bún tươi Ba Cô Gái - Thương hiệu Việt Nam", price: "125.000đ", oldPrice: "150.000đ", img: "https://via.placeholder.com/300", tag: "GIẢM 18%" },
  { id: 2, name: "Chả lụa Vị Hương 350g", price: "115.000đ", oldPrice: "145.000đ", img: "https://via.placeholder.com/300", tag: "GIẢM 19%" },
  { id: 3, name: "Sầu riêng Ri6 nguyên trái đông lạnh", price: "420.000đ", oldPrice: "590.000đ", img: "https://via.placeholder.com/300", tag: "GIẢM 29%" },
  { id: 4, name: "Xoài Thái xuất khẩu, Thùng 4-5kg", price: "950.000đ", oldPrice: "1.450.000đ", img: "https://via.placeholder.com/300", tag: "GIẢM 35%" },
  { id: 5, name: "Vịt nguyên con làm sạch (Đông lạnh)", price: "385.000đ", oldPrice: "480.000đ", img: "https://via.placeholder.com/300", tag: "GIẢM 20%" },
  { id: 6, name: "Nước uống Shiseido The Collagen 50mL", price: "850.000đ", oldPrice: "890.000đ", img: "https://via.placeholder.com/300", tag: "GIẢM 5%" },
  { id: 7, name: "Sầu riêng Musang King thượng hạng 400g", price: "750.000đ", oldPrice: "850.000đ", img: "https://via.placeholder.com/300", tag: "HOT" },
];

// --- COMPONENT CON: THẺ SẢN PHẨM ---
const ProductCard = ({ p }) => (
  <div className="flex-shrink-0 w-[170px] md:w-[210px] group cursor-pointer font-sans">
    <div className="relative aspect-square bg-[#f7f7f7] rounded-2xl overflow-hidden mb-3 border border-transparent group-hover:border-slate-100 transition-all">
      <span className="absolute top-0 left-0 bg-[#ff4d4f] text-white text-[9px] font-black px-2 py-1 rounded-br-xl z-10 uppercase tracking-wider">
        {p.tag}
      </span>
      <img src={p.img} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-500 p-4" alt={p.name} />
      <button className="absolute bottom-3 right-3 w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-lg text-[#006c49] hover:bg-[#006c49] hover:text-white transition-all transform active:scale-90">
        <Plus size={20} strokeWidth={3} />
      </button>
    </div>
    <div className="space-y-1">
      <div className="flex items-baseline gap-2">
        <span className="text-[#ff4d4f] font-black text-lg leading-none">{p.price}</span>
        <span className="text-slate-400 text-[10px] line-through font-bold">{p.oldPrice}</span>
      </div>
      <p className="text-[13px] text-[#161b22] leading-tight line-clamp-2 h-8 font-bold group-hover:text-[#006c49] transition-colors">
        {p.name}
      </p>
      <div className="flex gap-1 items-center pt-0.5">
        <span className="bg-red-50 text-[#ff4d4f] text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Giá hời</span>
        <span className="bg-[#e6f0ed] text-[#006c49] text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Demi Snap</span>
      </div>
      <p className="text-[9px] text-slate-400 font-black mt-1 uppercase tracking-widest">ĐÃ BÁN 1K+</p>
    </div>
  </div>
);

// --- COMPONENT CHÍNH ---
export default function Home() {
  const scrollRef = useRef(null);

  return (
    <div className="space-y-12 pb-20 bg-white font-sans">
      
      {/* 1. HERO SECTION */}
      <div className="px-6 md:px-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <h1 className="text-4xl md:text-[52px] font-black text-[#161b22] tracking-tighter leading-[1.1] text-left">
          Siêu thị trực tuyến <br/> hàng đầu <span className="text-[#006c49]">Á Châu</span>
        </h1>
        <div className="hidden xl:flex items-center gap-5 bg-slate-50/80 p-5 rounded-2xl border border-slate-100 shadow-sm scale-90">
           <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-[#006c49] shadow-inner">
              <QrCode size={40} strokeWidth={1.5} />
           </div>
           <div className="space-y-0.5 text-left">
              <p className="text-[14px] font-black text-[#161b22] uppercase tracking-tight">Quét để tải app</p>
              <div className="flex gap-0.5 text-[#fea619]">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Hơn 1 Triệu Đánh Giá</p>
           </div>
        </div>
      </div>

      {/* 2. KHUYẾN MÃI LỚN */}
      <div className="px-6 md:px-10 flex gap-5 overflow-x-auto scrollbar-hide pb-2">
        {/* Poster 1 */}
        <div className="min-w-[340px] flex-1 h-[260px] bg-[#ffecf1] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between border border-pink-100 shadow-sm group cursor-pointer">
            <div className="relative z-10">
              <span className="bg-[#ff4d6d] text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-sm tracking-widest uppercase">Đăng ký ngay</span>
              <h2 className="text-[56px] font-black text-[#161b22] mt-2 leading-none tracking-tighter">Giảm 500k</h2>
              <p className="text-sm font-black text-[#ff4d6d] uppercase tracking-wide">Cho 2 đơn hàng đầu tiên</p>
            </div>
            <div className="bg-[#fea619] p-4 rounded-2xl text-[11px] font-black text-[#684000] border-2 border-dashed border-white shadow-xl relative z-10 transition-transform group-hover:scale-105">
                MIỄN PHÍ VẬN CHUYỂN CHO 5 ĐƠN ĐẦU TIÊN
            </div>
        </div>
        
        {/* Poster 2 */}
        <div className="min-w-[340px] flex-1 h-[260px] bg-[#fdfc47] rounded-3xl p-8 relative overflow-hidden border border-yellow-200 shadow-sm group cursor-pointer">
            <span className="bg-[#161b22] text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase italic tracking-widest">Tuần lễ hương vị Việt</span>
            <h2 className="text-3xl font-black text-[#161b22] mt-3 leading-tight tracking-tight uppercase">Đại tiệc bùng nổ <br/> ưu đãi tới 50%</h2>
            <img src="https://via.placeholder.com/250" className="absolute right-[-20px] bottom-[-20px] w-2/3 object-contain opacity-90 transition-transform group-hover:rotate-12 duration-500" />
        </div>

        {/* Poster 3 */}
        <div className="min-w-[340px] flex-1 h-[260px] bg-[#2b1e16] rounded-3xl p-8 relative overflow-hidden border border-black/10 shadow-sm group cursor-pointer">
            <span className="bg-[#fea619] text-[#684000] text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">★ NỔI BẬT</span>
            <h2 className="text-3xl font-black text-white mt-3 leading-tight tracking-tight uppercase">Bắp bò hoa <br/> thượng hạng</h2>
            <p className="text-white/60 text-sm font-bold uppercase mt-1 tracking-wide">Thịt mềm, gân giòn</p>
            <div className="absolute right-6 bottom-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white group-hover:bg-[#006c49] transition-all duration-300">
              <ArrowRight size={24} />
            </div>
        </div>
      </div>

      {/* 3. SẢN PHẨM THỊNH HÀNH */}
      <section className="px-6 md:px-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#161b22] tracking-tight uppercase">Sản phẩm yêu thích</h2>
          <button className="flex items-center gap-2 text-xs font-black text-[#006c49] bg-[#e6f0ed] px-6 py-2.5 rounded-2xl hover:bg-[#006c49] hover:text-white transition-all shadow-sm active:scale-95">
            XEM THÊM <ChevronRight size={14} />
          </button>
        </div>

        <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
          {products.map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
          <div className="min-w-[120px] flex items-center justify-center text-[#006c49] font-black text-xs cursor-pointer hover:underline uppercase tracking-widest">
            Xem Tất Cả →
          </div>
        </div>
      </section>

      {/* 4. BANNER NGANG */}
      <div className="mx-6 md:mx-10 h-28 bg-[#006c49] rounded-3xl flex items-center justify-between px-6 md:px-12 border border-[#006c49] group cursor-pointer shadow-xl shadow-[#006c49]/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12 relative z-10">
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase">Tuần lễ Việt Nam Toàn Cầu+</h2>
            <p className="text-xs md:text-sm text-white/70 font-black uppercase tracking-widest hidden md:block">Khám phá hương vị không biên giới!</p>
          </div>
          <button className="w-12 h-12 rounded-2xl bg-white text-[#006c49] flex items-center justify-center group-hover:translate-x-3 transition-all shadow-xl active:scale-90 relative z-10">
            <ArrowRight size={24} strokeWidth={3} />
          </button>
      </div>

      {/* 5. SẢN PHẨM MỚI */}
      <section className="px-6 md:px-10">
        <h2 className="text-2xl font-black text-[#161b22] tracking-tight mb-6 uppercase">Hàng mới về</h2>
        <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4">
          {[...products].reverse().map(p => (
            <ProductCard key={`new-${p.id}`} p={p} />
          ))}
        </div>
      </section>

    </div>
  );
}