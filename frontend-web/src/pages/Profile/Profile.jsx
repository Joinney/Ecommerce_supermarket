import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { 
  User, Mail, Phone, MapPin, Camera, Edit2, CheckCircle2, Lock, Heart, 
  ChevronRight, Clock, Package, ShoppingBag, ShieldCheck, CreditCard, 
  Star, Wallet, Ticket, Bell, Settings, Eye, History, Zap, Award, Trash2, X, Plus, Info
} from "lucide-react";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const menuGroups = [
    {
      title: "Quản lý cá nhân",
      items: [
        { id: "profile", label: "Hồ sơ của tôi", icon: <User size={18}/> },
        { id: "notifications", label: "Thông báo của tôi", icon: <Bell size={18}/> },
        { id: "addresses", label: "Địa chỉ nhận hàng", icon: <MapPin size={18}/> },
        { id: "security", label: "Đổi mật khẩu", icon: <Lock size={18}/> },
      ]
    },
    {
      title: "Mua sắm & Ưu đãi",
      items: [
        { id: "orders", label: "Lịch sử mua hàng", icon: <Package size={18}/> },
        { id: "vouchers", label: "Kho Voucher", icon: <Ticket size={18}/> },
        { id: "favorites", label: "Sản phẩm đã thích", icon: <Heart size={18}/> },
      ]
    }
  ];

  const orderSteps = [
    { label: "Chờ xác nhận", icon: <History size={20}/>, count: 2 },
    { label: "Chờ lấy hàng", icon: <Package size={20}/>, count: 0 },
    { label: "Đang giao", icon: <Clock size={20}/>, count: 1 },
    { label: "Đã giao", icon: <CheckCircle2 size={20}/>, count: 85 },
  ];

  return (
    <div className="w-full bg-[#f0f2f5] pt-[0px] pb-12 font-sans text-slate-700 min-h-screen transition-all relative selection:bg-[#006c49] selection:text-white">
      
      {/* TOAST NOTIFICATION UI */}
      {toast.show && (
        <div className="fixed top-24 right-6 z-[10001] animate-toastIn">
          <div className="bg-white border-l-4 border-[#006c49] shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[300px]">
            <div className="bg-[#e6f0ed] p-2 rounded-xl text-[#006c49]">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-xs font-black text-slate-900">{toast.message}</p>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-auto text-slate-300 hover:text-slate-500">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-4 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-8 pt-6 items-start">
          
          {/* --- LEFT SIDEBAR --- */}
          <aside className="w-full lg:w-72 shrink-0 space-y-5 text-left">
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex items-center gap-4 h-[100px]"> {/* Cố định h-[100px] để làm mốc */}
              <div className="relative shrink-0">
                <img 
                  src={user?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"} 
                  className="w-16 h-16 rounded-2xl object-cover border-4 border-[#f0f9f6]"
                  alt="Avatar"
                />
                <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-1 rounded-lg border-2 border-white shadow-sm">
                  <Award size={12} fill="currentColor" />
                </div>
              </div>
              <div className="overflow-hidden">
                <h4 className="font-black text-slate-900 truncate tracking-tight">{user?.full_name || "Demi"}</h4>
                <p className="text-[10px] font-black text-[#006c49] uppercase tracking-widest flex items-center gap-1">
                  <Zap size={10} fill="currentColor"/> Platinum
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-3 shadow-sm border border-slate-100 space-y-6">
              {menuGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{group.title}</p>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                        activeTab === item.id 
                        ? "bg-[#006c49] text-white shadow-lg shadow-[#006c49]/20" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-[#006c49]"
                      }`}
                    >
                      <span className={activeTab === item.id ? "text-white" : "text-slate-300"}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </aside>

          {/* --- RIGHT CONTENT --- */}
          <div className="flex-1 space-y-6">
            
            {/* 1. Dashboard Cards - ĐÃ CÂN BẰNG CHIỀU CAO VỚI SIDEBAR INFO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card Ví Demi Pay - Cao h-[100px] bằng với Sidebar Avatar box */}
              <div className="md:col-span-2 bg-[#006c49] rounded-[28px] p-5 text-white relative overflow-hidden shadow-lg group h-[100px] text-left">
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 opacity-80">
                      <Wallet size={14}/>
                      <span className="text-[8px] font-black uppercase tracking-widest">Ví Demi Pay</span>
                    </div>
                    <button className="bg-white/20 p-1 rounded-lg backdrop-blur-md hover:bg-white/30 transition-all">
                      <Eye size={14}/>
                    </button>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <h2 className="text-2xl font-black tracking-tight tabular-nums leading-none">2.450.000đ</h2>
                    <div className="flex gap-2">
                      <button onClick={() => showToast("Đang bảo trì")} className="bg-white text-[#006c49] px-4 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all shadow-sm">Nạp tiền</button>
                      <button className="bg-white/20 text-white px-4 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all">Rút tiền</button>
                    </div>
                  </div>
                </div>
                <CreditCard className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              </div>
              
              {/* Card Điểm tích lũy - Cao h-[100px] */}
              <div className="bg-white rounded-[28px] p-4 shadow-sm border border-slate-100 flex flex-col justify-between h-[100px] text-center">
                <div className="flex justify-between items-center w-full">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Điểm thưởng</p>
                   <Star size={14} fill="#fea619" className="text-[#fea619]"/>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                   <span className="text-2xl font-black tracking-tighter tabular-nums">1.250</span>
                   <span className="text-[9px] font-bold text-slate-400 uppercase">Xu</span>
                </div>
                <button onClick={() => showToast("Voucher 20k!")} className="w-full text-[9px] font-black text-[#006c49] uppercase tracking-widest border-t border-slate-50 pt-1.5 flex items-center justify-center gap-1">
                   Đổi ngay <ChevronRight size={10}/>
                </button>
              </div>
            </div>

            {/* 2. Main Tab Content */}
            <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden text-left transition-all duration-500">
              <div className="bg-[#fcfdfd] border-b border-slate-100 p-6 flex flex-wrap justify-around items-center gap-6">
                 {orderSteps.map((step, i) => (
                   <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer relative">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center text-slate-300 group-hover:text-[#006c49] group-hover:border-[#006c49]/30 transition-all">
                        {step.icon}
                      </div>
                      {step.count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">{step.count}</span>
                      )}
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{step.label}</p>
                   </div>
                 ))}
              </div>

              <div className="p-10 lg:p-12 animate-fadeIn">
                {activeTab === "profile" && (
                  <div className="space-y-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">Hồ sơ cá nhân</h2>
                        <p className="text-sm font-medium text-slate-400 mt-1">Quản lý định danh và bảo mật tài khoản</p>
                      </div>
                      <button onClick={() => showToast("Đã lưu!")} className="bg-[#006c49] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#006c49]/20 hover:bg-[#004d34] transition-all">Lưu hồ sơ</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                          <input type="text" defaultValue={user?.full_name} className="w-full bg-[#f8fafc] p-4 rounded-2xl border border-slate-100 font-bold text-slate-800 focus:bg-white focus:border-[#006c49] outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email liên hệ</label>
                          <input type="email" defaultValue={user?.email} className="w-full bg-[#f8fafc] p-4 rounded-2xl border border-slate-100 font-bold text-slate-800 outline-none opacity-60 cursor-not-allowed" readOnly />
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-[#f8fafc] rounded-[32px] p-8 border border-slate-100 border-dashed group cursor-pointer hover:bg-white transition-all">
                          <div className="relative mb-4">
                            <img 
                              src={user?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"} 
                              className="w-24 h-24 rounded-[32px] object-cover border-4 border-white shadow-xl"
                              alt="Avatar Big"
                            />
                            <label htmlFor="avatar-up" className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-[#006c49] cursor-pointer">
                              <Camera size={18} />
                            </label>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400">Thay đổi ảnh</p>
                          <input type="file" id="avatar-up" className="hidden" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">Thông báo mới</h2>
                    <div className="space-y-4 text-left">
                      {[
                        { title: "Đơn hàng đang đến!", desc: "Đơn hàng #DM12345 đã bắt đầu giao.", time: "2 giờ trước", type: "order" },
                        { title: "Khuyến mãi cực hời", desc: "Giảm 50% cho ngành hàng rau củ quả hôm nay.", time: "1 ngày trước", type: "promo" }
                      ].map((noti, i) => (
                        <div key={i} className="flex gap-4 p-5 bg-[#fcfdfd] border border-slate-100 rounded-3xl hover:bg-white hover:shadow-md transition-all cursor-pointer">
                          <div className={`p-3 rounded-2xl ${noti.type === 'order' ? 'bg-emerald-50 text-[#006c49]' : 'bg-amber-50 text-amber-500'}`}>
                            {noti.type === 'order' ? <Package size={20}/> : <Ticket size={20}/>}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-slate-900 text-sm">{noti.title}</h5>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">{noti.desc}</p>
                            <span className="text-[10px] text-slate-400 mt-2 block font-bold">{noti.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "addresses" && (
                   <div className="space-y-8">
                      <div className="flex justify-between items-center text-left">
                        <h2 className="text-2xl font-black text-slate-900">Địa chỉ của tôi</h2>
                        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                           <Plus size={16}/> Thêm mới
                        </button>
                      </div>
                      <div className="p-6 border border-slate-100 rounded-[32px] bg-[#fcfdfd] flex justify-between items-center text-left group hover:border-[#006c49]/30 transition-all">
                        <div className="flex gap-4">
                           <div className="bg-emerald-50 p-3 rounded-2xl text-[#006c49]"><MapPin size={24}/></div>
                           <div>
                              <div className="flex items-center gap-3">
                                 <p className="font-bold text-slate-900">Demi</p>
                                 <span className="bg-[#e6f0ed] text-[#006c49] text-[9px] font-black px-2 py-0.5 rounded uppercase">Mặc định</span>
                              </div>
                              <p className="text-sm text-slate-500 mt-1">123 Đường Nguyễn Tất Thành, Quận 4, TP. HCM</p>
                           </div>
                        </div>
                        <button className="text-[#006c49] text-xs font-black uppercase hover:underline">Sửa</button>
                      </div>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-toastIn { animation: toastIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #006c49; border-radius: 10px; }
      `}} />
    </div>
  );
}