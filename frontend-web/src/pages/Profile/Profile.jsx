import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { 
  User, Mail, Phone, MapPin, Camera, Edit2, CheckCircle2, Lock, Heart, 
  ChevronRight, Clock, Package, ShoppingBag, ShieldCheck, CreditCard, 
  Star, Wallet, Ticket, Bell, Settings, Eye, History, Zap, Award, Trash2
} from "lucide-react";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");

  const menuGroups = [
    {
      title: "Quản lý cá nhân",
      items: [
        { id: "profile", label: "Hồ sơ của tôi", icon: <User size={18}/> },
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
    /* 🚀 Đã chỉnh pt-[58px] cho sát Header */
    <div className="w-full bg-[#f0f2f5] pt-[50px] pb-12 font-sans text-slate-700 min-h-screen transition-all">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-10">
        
        <div className="flex flex-col lg:flex-row gap-8 pt-6">
          
          {/* --- LEFT SIDEBAR --- */}
          <aside className="w-full lg:w-72 shrink-0 space-y-5">
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex items-center gap-4">
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
              <div className="overflow-hidden text-left">
                <h4 className="font-black text-slate-900 truncate tracking-tight">{user?.full_name || "Demi"}</h4>
                <p className="text-[10px] font-black text-[#006c49] uppercase tracking-widest flex items-center gap-1">
                  <Zap size={10} fill="currentColor"/> Platinum
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-3 shadow-sm border border-slate-100 space-y-6">
              {menuGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 text-left">{group.title}</p>
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
          <div className="flex-1 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-[#006c49] rounded-[40px] p-10 text-white relative overflow-hidden shadow-xl shadow-[#006c49]/20 group h-52">
                <div className="relative z-10 flex flex-col justify-between h-full text-left">
                  <div>
                    <div className="flex items-center gap-2 mb-1 opacity-70">
                      <Wallet size={16}/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Ví Demi Pay</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <h2 className="text-4xl font-black tracking-tight">2.450.000đ</h2>
                      <button className="bg-white/20 p-2 rounded-xl backdrop-blur-md hover:bg-white/30 transition-all">
                        <Eye size={18}/>
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="bg-white text-[#006c49] px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Nạp tiền</button>
                    <button className="bg-white/20 text-white px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Rút tiền</button>
                  </div>
                </div>
                <CreditCard className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              </div>
              
              <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 flex flex-col justify-between h-52 text-center items-center">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Điểm tích lũy</p>
                   <div className="flex items-center justify-center gap-2 text-[#fea619]">
                      <Star size={24} fill="currentColor"/>
                      <span className="text-4xl font-black tracking-tighter">1.250</span>
                   </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 text-xs font-black text-slate-900 group">
                   Đổi quà ngay <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden min-h-[600px]">
              <div className="bg-[#fcfdfd] border-b border-slate-100 p-8 flex flex-wrap justify-around items-center gap-6">
                 {orderSteps.map((step, i) => (
                   <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer relative">
                      <div className="w-14 h-14 bg-white rounded-[20px] shadow-sm border border-slate-50 flex items-center justify-center text-slate-300 group-hover:text-[#006c49] group-hover:border-[#006c49]/30 transition-all">
                        {step.icon}
                      </div>
                      {step.count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-sm">{step.count}</span>
                      )}
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{step.label}</p>
                   </div>
                 ))}
              </div>

              <div className="p-10 lg:p-12 animate-fadeIn text-left">
                {activeTab === "profile" && (
                  <div className="space-y-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">Hồ sơ cá nhân</h2>
                        <p className="text-sm font-medium text-slate-400 mt-1">Cập nhật thông tin định danh của bạn tại Demi Mart</p>
                      </div>
                      <button className="bg-[#006c49] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#006c49]/20 hover:bg-[#004d34] transition-all">Lưu hồ sơ</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                          <input type="text" defaultValue={user?.full_name} className="w-full bg-[#f8fafc] p-4 rounded-2xl border border-slate-100 font-bold text-slate-800 focus:bg-white focus:border-[#006c49] outline-none transition-all shadow-sm shadow-slate-100/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email liên hệ</label>
                          <input type="email" defaultValue={user?.email} className="w-full bg-[#f8fafc] p-4 rounded-2xl border border-slate-100 font-bold text-slate-800 outline-none opacity-60 cursor-not-allowed" readOnly />
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-[#f8fafc] rounded-[32px] p-8 border border-slate-100 border-dashed">
                          <div className="relative mb-4">
                            <img 
                              src={user?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"} 
                              className="w-24 h-24 rounded-[32px] object-cover border-4 border-white shadow-xl"
                              alt="Avatar Big"
                            />
                            <label htmlFor="avatar-up" className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-[#006c49] cursor-pointer hover:scale-110 transition-transform">
                              <Camera size={18} />
                            </label>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400">Tối đa 2MB. JPG, PNG.</p>
                          <input type="file" id="avatar-up" className="hidden" />
                      </div>
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
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #006c49; border-radius: 10px; }
      `}} />
    </div>
  );
}