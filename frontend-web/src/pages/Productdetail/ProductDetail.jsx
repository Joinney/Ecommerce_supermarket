import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, ShoppingCart, ShieldCheck, Truck, 
  Minus, Plus, ChevronRight, CreditCard, Share2
} from 'lucide-react';
import { 
  FacebookShareButton, 
  FacebookMessengerShareButton, 
  FacebookIcon, 
  FacebookMessengerIcon 
} from 'react-share';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainMedia, setMainMedia] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        const productData = Array.isArray(data) ? data[0] : data;
        if (productData) {
          setProduct(productData);
          const defaultVariant = productData.bien_the?.find(v => v.la_ban_chay) || productData.bien_the?.[0];
          setSelectedVariant(defaultVariant);
          const defaultMedia = productData.media?.find(m => m.la_anh_chinh) || productData.media?.[0];
          setMainMedia(defaultMedia);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id]);

  const currentPrice = selectedVariant?.gia_khuyen_mai || selectedVariant?.gia_ban_le || 0;
  const originalPrice = selectedVariant?.gia_khuyen_mai ? selectedVariant?.gia_ban_le : null;
  const shareUrl = window.location.href;

  const handleBuyNow = () => {
    if (!product || !selectedVariant) return;
    navigate('/checkout', { 
      state: { 
        buyNow: true, 
        product: { ...product, selectedVariant, quantity, currentPrice } 
      } 
    });
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    alert("Đã thêm sản phẩm vào giỏ hàng!");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#006c49] border-t-transparent rounded-full animate-spin"></div>
            <div className="font-black text-[#006c49] animate-pulse uppercase tracking-[0.2em]">Demi Mart Loading...</div>
        </div>
    </div>
  );

  if (!product) return <div className="text-center py-20 font-bold text-slate-400 underline"><Link to="/">Sản phẩm không tồn tại. Quay lại cửa hàng</Link></div>;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#006c49] selection:text-white pb-8">
      {/* Cấu hình SEO & Social Card động */}
      <Helmet>
        <title>{product.ten_san_pham} | Demi Mart</title>
        <meta property="og:title" content={product.ten_san_pham} />
        <meta property="og:description" content={product.mo_ta_ngan || "Sản phẩm sạch từ Demi Mart"} />
        <meta property="og:image" content={mainMedia?.duong_dan_url} />
        <meta property="og:url" content={shareUrl} />
      </Helmet>

      <div className="w-full max-w-[1150px] 2xl:max-w-[1400px] mx-auto px-2 sm:px-6 lg:px-10 pt-4 lg:pt-10 transition-all duration-300">
        <nav className="flex items-center gap-2 text-[10px] 2xl:text-[11px] font-bold text-slate-400 mb-3 lg:mb-6 uppercase tracking-wider overflow-hidden px-1">
          <Link to="/" className="hover:text-slate-900 flex-shrink-0">Home</Link>
          <ChevronRight size={10} className="text-slate-300" />
          <span className="text-slate-400 truncate">{product.ten_danh_muc}</span>
          <ChevronRight size={10} className="text-slate-300" />
          <span className="text-[#006c49] truncate font-black italic">{product.ten_san_pham}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 2xl:gap-16 items-start">
          {/* TRÁI: GALLERY */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col-reverse sm:flex-row gap-2 lg:gap-4">
            <div className="flex sm:flex-col gap-2 w-full sm:w-16 2xl:w-20 flex-shrink-0 overflow-x-auto sm:overflow-y-auto scrollbar-hide py-1">
              {product.media?.map((m, i) => (
                <button 
                  key={i} 
                  onClick={() => setMainMedia(m)}
                  className={`aspect-square w-12 sm:w-full rounded-lg border-2 transition-all p-0.5 bg-white flex-shrink-0 ${
                    mainMedia?.ma_media === m.ma_media ? 'border-[#006c49] shadow-sm' : 'border-slate-100 opacity-60'
                  }`}
                >
                  <img src={m.duong_dan_url} className="w-full h-full object-cover rounded-md" alt="thumb" />
                </button>
              ))}
            </div>
            <div className="flex-1 relative aspect-square sm:aspect-[4/5] max-h-[45vh] lg:max-h-[65vh] rounded-[16px] lg:rounded-[32px] bg-[#f9f9f9] border border-slate-50 overflow-hidden flex items-center justify-center shadow-sm">
              <img src={mainMedia?.duong_dan_url} className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105" alt={product.ten_san_pham} />
            </div>
          </div>

          {/* PHẢI: CHI TIẾT */}
          <div className="lg:col-span-6 xl:col-span-5 text-left space-y-4 lg:space-y-5 lg:sticky lg:top-4 px-1">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#006c49] text-white text-[7px] 2xl:text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter italic">Demi Fresh</span>
                <p className="text-[9px] 2xl:text-[11px] text-slate-400 font-bold uppercase tracking-widest pt-1">SKU: {selectedVariant?.sku || 'DM-001'}</p>
              </div>
              <h1 className="text-xl lg:text-2xl 2xl:text-4xl font-black text-[#1a1a1a] leading-tight tracking-tight uppercase italic">{product.ten_san_pham}</h1>
            </div>

            <div className="flex items-baseline gap-3 border-b border-slate-100 pb-3">
              <span className="text-2xl lg:text-3xl 2xl:text-5xl font-black text-[#006c49] tracking-tighter">{currentPrice.toLocaleString()}đ</span>
              {originalPrice && <span className="text-xs 2xl:text-lg text-slate-300 line-through font-bold">{originalPrice.toLocaleString()}đ</span>}
            </div>

            {/* MÔ TẢ & CHIA SẺ */}
            <div className="space-y-3">
              <p className="text-[10px] lg:text-[11px] 2xl:text-[13px] text-slate-500 leading-relaxed italic border-l-4 border-[#006c49] pl-3">
                "{product.mo_ta_ngan || "Sản phẩm tươi sạch từ Demi Mart."}"
              </p>
              
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Share2 size={12}/> Chia sẻ:</span>
                <div className="flex gap-2">
                  <FacebookShareButton url={shareUrl} quote={product.ten_san_pham}><FacebookIcon size={28} round /></FacebookShareButton>
                  <FacebookMessengerShareButton url={shareUrl} appId="YOUR_FB_APP_ID"><FacebookMessengerIcon size={28} round /></FacebookMessengerShareButton>
                  <button onClick={() => window.open(`https://zalo.me/s/share?link=${encodeURIComponent(shareUrl)}`, '_blank')} className="hover:scale-110 transition-transform">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_Zalo.svg" alt="Zalo" className="w-7 h-7" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {product.bien_the?.map((v, i) => (
                  <button key={i} onClick={() => setSelectedVariant(v)} className={`px-3 py-1.5 rounded-lg text-[8px] lg:text-[9px] font-black uppercase tracking-widest border-2 ${selectedVariant?.ma_bien_the === v.ma_bien_the ? 'border-[#006c49] bg-[#006c49] text-white shadow-md' : 'border-slate-100 bg-[#fcfcfc] text-slate-400'}`}>{v.ten_bien_the}</button>
                ))}
              </div>
            </div>

            {/* ACTION BOX */}
            <div className="bg-[#fcfcfc] p-4 lg:p-6 rounded-[20px] border border-slate-100 shadow-xl shadow-slate-200/30 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Số lượng</p>
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-lg"><Minus size={14}/></button>
                    <span className="w-8 text-center font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-lg"><Plus size={14}/></button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tạm tính</p>
                  <p className="text-xl lg:text-3xl font-black text-[#1a1a1a] tracking-tighter">{(currentPrice * quantity).toLocaleString()}đ</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleAddToCart} className="flex items-center justify-center gap-2 bg-white text-[#006c49] border-2 border-[#006c49] py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-[#006c49] hover:text-white transition-all text-[10px]">
                  <ShoppingCart size={16} strokeWidth={2.5} /> GIỎ HÀNG
                </button>
                <button onClick={handleBuyNow} className="flex items-center justify-center gap-2 bg-[#ffb800] text-black py-3 rounded-xl font-black uppercase tracking-wider hover:bg-[#e6a600] transition-all text-[10px] shadow-lg shadow-amber-200/50">
                  <CreditCard size={16} strokeWidth={2.5} /> MUA NGAY
                </button>
              </div>
            </div>

            <div className="flex gap-5 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-2 text-[#006c49] font-bold text-[9px] uppercase tracking-tighter"><Truck size={16} /> Giao nhanh 2h</div>
              <div className="flex items-center gap-2 text-[#006c49] font-bold text-[9px] uppercase tracking-tighter"><ShieldCheck size={16} /> Bảo hành Demi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}