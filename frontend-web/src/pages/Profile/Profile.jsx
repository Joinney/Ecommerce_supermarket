import React, { useState } from "react";
import { 
  User, Mail, Phone, MapPin, Camera, Edit2, CheckCircle2, Lock, Heart, 
  ChevronRight, Clock, Package, ShoppingBag, ShieldCheck, CreditCard, 
  Star, Wallet, Ticket, Bell, Settings, Eye, History, Zap, Award, Trash2, X, Plus, Info, Menu, Search, Filter
} from "lucide-react";

export default function App() {
  const user = {
    full_name: "Võ Duy Toàn",
    email: "voduytoan.dev@gmail.com",
    phone: "090****844",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
  };

  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // --- DỮ LIỆU MẪU ---
  const notifications = [
    { id: 1, title: "Ưu đãi Platinum độc quyền", desc: "Giảm ngay 100k cho đơn hàng từ 500k dành riêng cho bạn.", time: "10 phút trước", type: "promo", unread: true },
    { id: 2, title: "Đơn hàng #DM9922 thành công", desc: "Kiện hàng của bạn đã được giao tới địa chỉ Nhà riêng.", time: "2 giờ trước", type: "order", unread: false },
    { id: 3, title: "Cảnh báo bảo mật", desc: "Tài khoản của bạn vừa đăng nhập trên trình duyệt Chrome tại TP.HCM.", time: "1 ngày trước", type: "security", unread: false },
  ];

  const addresses = [
    { id: 1, name: "Võ Duy Toàn (Nhà riêng)", phone: "090****844", addr: "123 Đường Nguyễn Tất Thành, Phường 13, Quận 4, TP. Hồ Chí Minh", isDefault: true },
    { id: 2, name: "Văn phòng Demi Mart", phone: "028 33** 88", addr: "Số 10 Mai Chí Thọ, Phường An Lợi Đông, Thủ Đức, TP. Hồ Chí Minh", isDefault: false },
  ];

  const orders = [
    { id: "DM1002", date: "22/10/2023", total: "450.000đ", status: "Đã giao", items: ["Táo Envy Mỹ", "Sữa tươi TH True Milk"], img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=100" },
    { id: "DM1005", date: "25/10/2023", total: "1.200.000đ", status: "Đang giao", items: ["Thịt bò Mỹ bắp hoa", "Rượu vang đỏ"], img: "https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80&w=100" }
  ];

  const vouchers = [
    { id: 1, code: "DEMIFREESHIP", title: "Miễn phí vận chuyển", min: "50k", expiry: "30/11/2023", type: 'ship' },
    { id: 2, code: "PLATINUM100", title: "Giảm trực tiếp 100k", min: "500k", expiry: "15/11/2023", type: 'discount' },
  ];

  const favorites = [
    { id: 1, name: "Dâu tây Đà Lạt xuất khẩu", price: "150.000đ", img: "https://images.unsplash.com/photo-1464960350473-9e855018991a?auto=format&fit=crop&q=80&w=200" },
    { id: 2, name: "Bơ sáp loại 1 DakLak", price: "85.000đ", img: "https://images.unsplash.com/photo-1523049673857-d18dd3746b62?auto=format&fit=crop&q=80&w=200" },
    { id: 3, name: "Nho mẫu đơn Hàn Quốc", price: "450.000đ", img: "https://images.unsplash.com/photo-1537084642907-629340c7e59c?auto=format&fit=crop&q=80&w=200" },
  ];

  const mobileTabs = [
    { id: "profile", label: "Hồ sơ", icon: <User size={14}/> },
    { id: "notifications", label: "Thông báo", icon: <Bell size={14}/> },
    { id: "addresses", label: "Địa chỉ", icon: <MapPin size={14}/> },
    { id: "security", label: "Bảo mật", icon: <Lock size={14}/> },
    { id: "orders", label: "Đơn hàng", icon: <Package size={14}/> },
    { id: "vouchers", label: "Voucher", icon: <Ticket size={14}/> },
    { id: "favorites", label: "Đã thích", icon: <Heart size={14}/> },
  ];

  const menuGroups = [
    { title: "Cá nhân", items: mobileTabs.slice(0, 4) },
    { title: "Mua sắm", items: mobileTabs.slice(4) }
  ];

  const orderSteps = [
    { label: "Xác nhận", icon: <History size={16}/>, count: 2 },
    { label: "Lấy hàng", icon: <Package size={16}/>, count: 0 },
    { label: "Đang giao", icon: <Clock size={16}/>, count: 1 },
    { label: "Đã giao", icon: <CheckCircle2 size={16}/>, count: 85 },
  ];

  return (
    <div className="w-full bg-[#f0f2f5] font-sans text-slate-700 min-h-screen transition-all relative selection:bg-[#006c49] selection:text-white pb-8">
      
      {/* 1. MOBILE HEADER */}
      <div className="md:hidden sticky top-0 z-[100] bg-white border-b border-slate-100 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 text-left">
          <div className="relative shrink-0">
            <img src={user.avatar_url} className="w-10 h-10 rounded-2xl object-cover border-2 border-[#f0f9f6]" alt="avt" />
            <div className="absolute -top-1 -right-1 bg-amber-400 text-white p-0.5 rounded-md border border-white shadow-sm"><Award size={8} fill="currentColor" /></div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 text-sm tracking-tight leading-none">{user.full_name}</span>
            <p className="text-[8px] font-black text-[#006c49] uppercase tracking-widest flex items-center gap-1 mt-1.5"><Zap size={8} fill="currentColor"/> Platinum Member</p>
          </div>
        </div>
        <div className="bg-[#e6f0ed] px-3 py-1.5 rounded-xl border border-[#006c49]/10 shadow-sm">
           <p className="text-[9px] font-black text-[#006c49] uppercase tracking-tighter">Đang hoạt động</p>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed top-20 md:top-6 right-4 left-4 md:left-auto z-[10002] animate-toastIn">
          <div className="bg-white border-l-4 border-[#006c49] shadow-2xl rounded-xl p-3 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-[#006c49]" />
            <p className="text-xs font-bold">{toast.message}</p>
          </div>
        </div>
      )}

      {/* --- DESKTOP STRUCTURE --- */}
      <div className="max-w-[1600px] mx-auto px-0 md:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row gap-6 pt-0 md:pt-6 items-start">
          
          {/* --- SIDEBAR DESKTOP --- */}
          <aside className="hidden md:block w-64 lg:w-72 shrink-0 space-y-4 sticky top-6">
            <div className="bg-white rounded-[32px] p-5 shadow-sm border border-slate-100 flex items-center gap-4 h-[90px]">
              <div className="relative shrink-0">
                <img src={user.avatar_url} className="w-14 h-14 rounded-2xl object-cover border-4 border-[#f0f9f6]" alt="Avatar" />
                <div className="absolute -top-1 -right-1 bg-amber-400 text-white p-1 rounded-lg border-2 border-white shadow-sm"><Award size={10} fill="currentColor" /></div>
              </div>
              <div className="overflow-hidden text-left">
                <h4 className="font-black text-slate-900 truncate tracking-tight text-sm">{user.full_name}</h4>
                <p className="text-[9px] font-black text-[#006c49] uppercase tracking-widest flex items-center gap-1"><Zap size={9} fill="currentColor"/> Platinum</p>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-2 shadow-sm border border-slate-100 space-y-4 text-left">
              {menuGroups.map((group, idx) => (
                <div key={idx} className="space-y-0.5">
                  <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{group.title}</p>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? "bg-[#006c49] text-white shadow-lg shadow-[#006c49]/20" : "text-slate-500 hover:bg-slate-50 hover:text-[#006c49]"}`}
                    >
                      <span className={activeTab === item.id ? "text-white" : "text-slate-300"}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </aside>

          {/* --- CONTENT AREA --- */}
          <div className="flex-1 w-full space-y-4">
            
            {/* 2. DASHBOARD CARDS (VÍ & XU) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4 text-left">
              <div className="md:col-span-2 bg-[#006c49] rounded-none md:rounded-[28px] p-5 md:p-4 text-white relative overflow-hidden shadow-lg group h-[110px] md:h-[100px]">
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-black uppercase tracking-widest flex items-center gap-2"><Wallet size={12}/> Ví Demi Pay</span>
                    <Eye size={12} className="opacity-50 cursor-pointer hover:opacity-100"/>
                  </div>
                  <div className="flex items-end justify-between">
                    <h2 className="text-2xl md:text-xl font-black tabular-nums tracking-tight">2.450.000đ</h2>
                    <div className="flex gap-2">
                      <button onClick={() => showToast("Hệ thống đang bảo trì")} className="bg-white text-[#006c49] px-4 md:px-3 py-1.5 md:py-1 rounded-xl font-black text-[9px] md:text-[8px] active:scale-95 shadow-sm">Nạp tiền</button>
                      <button className="bg-white/20 text-white px-4 md:px-3 py-1.5 md:py-1 rounded-xl font-black text-[9px] md:text-[8px] active:scale-95">Rút tiền</button>
                    </div>
                  </div>
                </div>
                <CreditCard className="absolute -right-4 -bottom-4 w-20 h-20 opacity-10 -rotate-12" />
              </div>
              
              {/* PHẦN THƯỞNG/XU - ĐÃ SỬA DÀN NGANG TRÊN MOBILE */}
              <div className="bg-white rounded-none md:rounded-[28px] p-4 shadow-sm border border-slate-100 flex flex-row md:flex-col justify-between items-center md:items-stretch h-auto md:h-[100px]">
                <div className="flex items-center justify-between w-full gap-2 md:block">
                  <div className="flex items-center gap-2 md:justify-between">
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 text-left whitespace-nowrap"><Star size={12} fill="#fea619" className="text-[#fea619]"/> Thưởng</p>
                    <span className="hidden md:block text-[8px] font-black text-[#006c49] cursor-pointer hover:underline">Đổi ngay</span>
                  </div>
                  
                  <div className="flex items-center gap-3 md:block md:mt-1">
                    <span className="text-lg md:text-xl font-black tabular-nums leading-none whitespace-nowrap">1.250 <span className="text-[8px] font-bold text-slate-400 uppercase">Xu</span></span>
                    <button onClick={() => showToast("Hệ thống đang bảo trì")} className="md:hidden text-[8px] font-black text-[#006c49] border border-[#006c49]/20 px-3 py-1.5 rounded-lg whitespace-nowrap active:bg-slate-50">Đổi ngay</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. MOBILE PILL TABS - ĐÃ THU HẸP KHOẢNG CÁCH TRÊN DƯỚI (PY-2) */}
            <div className="md:hidden bg-[#f0f2f5] py-0 px-4 flex overflow-x-auto no-scrollbar gap-2.5 sticky top-[73px] z-[90]">
              {mobileTabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${activeTab === item.id ? "bg-[#006c49] text-white border-[#006c49] shadow-[#006c49]/30" : "bg-white text-slate-500 border-slate-200"}`}
                >
                  <span className={activeTab === item.id ? "text-white" : "text-slate-300"}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* 4. MAIN CONTENT CONTAINER */}
            <div className="bg-white rounded-none md:rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-none md:border border-slate-100 overflow-hidden text-left flex flex-col min-h-screen md:min-h-[550px]">
              
              {/* Order Steps Header */}
              <div className="bg-[#fcfdfd] border-b border-slate-100 py-3 px-4 md:px-8 flex justify-around items-center shrink-0 overflow-x-auto no-scrollbar">
                {orderSteps.map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 group cursor-pointer relative min-w-[70px]">
                    <div className="w-9 h-9 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-[#006c49] transition-all">
                      {step.icon}
                    </div>
                    {step.count > 0 && (
                      <span className="absolute top-0 right-3 bg-red-500 text-white text-[7px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white leading-none">{step.count}</span>
                    )}
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{step.label}</p>
                  </div>
                ))}
              </div>

              {/* Tab Content Rendering */}
              <div className="px-5 md:px-8 lg:px-12 pb-10 pt-6 md:pt-8 animate-fadeIn flex-1 text-left">
                
                {/* --- TAB HỒ SƠ --- */}
                {activeTab === "profile" && (
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-4 text-left">
                      <div>
                        <h2 className="text-xl font-black text-slate-900 leading-tight tracking-tight">Hồ sơ cá nhân</h2>
                        <p className="text-[10px] font-medium text-slate-400">Quản lý và thiết lập bảo mật danh tính tài khoản</p>
                      </div>
                      <button onClick={() => showToast("Đã lưu hồ sơ!")} className="hidden md:block bg-[#006c49] text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-[#006c49]/20 hover:scale-[1.02] active:scale-95 transition-all text-center">Lưu thay đổi</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      <div className="lg:col-span-2 space-y-6 text-left">
                        <div className="grid grid-cols-3 items-center gap-4 border-b border-slate-50 pb-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tên đăng nhập</label>
                          <div className="col-span-2 font-bold text-slate-800 text-sm py-2">voduytoan123</div>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4 text-left">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Họ và tên</label>
                          <input type="text" defaultValue="Võ Duy Toàn" className="col-span-2 bg-[#f8fafc] p-3.5 rounded-xl border border-slate-100 font-bold text-slate-800 text-sm focus:bg-white focus:border-[#006c49] outline-none transition-all" />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4 text-left">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                          <div className="col-span-2 flex justify-between items-center bg-[#f8fafc] p-3.5 rounded-xl border border-slate-100">
                            <span className="text-slate-500 font-bold text-xs truncate mr-2">{user.email}</span>
                            <button className="text-[#006c49] text-[9px] font-black uppercase underline shrink-0">Thay đổi</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4 pt-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Giới tính</label>
                          <div className="col-span-2 flex gap-6">
                            {["Nam", "Nữ", "Khác"].map((gender) => (
                              <label key={gender} className="flex items-center gap-2 cursor-pointer group text-[11px] font-bold text-slate-600">
                                <input type="radio" name="gender" defaultChecked={gender === "Nam"} className="w-4 h-4 accent-[#006c49]" /> {gender}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4 pt-1 text-left text-xs font-bold">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ngày sinh</label>
                          <div className="col-span-2 flex justify-between items-center bg-[#f8fafc] p-3.5 rounded-xl border border-slate-100">
                             <span className="text-slate-500">22/10/1995</span>
                             <button className="text-[#006c49] text-[9px] font-black uppercase underline shrink-0">Sửa</button>
                          </div>
                        </div>
                      </div>

                      {/* Avatar Upload */}
                      <div className="flex flex-col items-center justify-start pt-2 order-first lg:order-last">
                        <div className="bg-[#f8fafc] rounded-[32px] p-8 border-2 border-slate-100 border-dashed w-full sm:w-2/3 lg:w-full flex flex-col items-center text-center">
                          <div className="relative mb-4">
                            <img src={user.avatar_url} className="w-28 h-28 rounded-[36px] object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500" alt="Avatar"/>
                            <label htmlFor="avatar-up" className="absolute -bottom-1 -right-1 bg-white p-2.5 rounded-xl shadow-lg border border-slate-100 text-[#006c49] cursor-pointer hover:scale-110 transition-all shadow-md"><Camera size={16} /></label>
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ảnh đại diện</p>
                          <input type="file" id="avatar-up" className="hidden" />
                        </div>
                      </div>
                    </div>

                    <div className="md:hidden pt-6 px-2">
                      <button onClick={() => showToast("Đã lưu hồ sơ!")} className="w-full bg-[#006c49] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[#006c49]/20 active:scale-95 transition-all">Lưu thay đổi hồ sơ</button>
                    </div>
                  </div>
                )}

                {/* --- CÁC TAB KHÁC GIỮ NGUYÊN --- */}
                {activeTab === "notifications" && (
                  <div className="space-y-6 text-left">
                    <h2 className="text-xl font-black text-slate-900 border-b border-slate-50 pb-4">Thông báo mới nhất</h2>
                    <div className="space-y-3">
                       {notifications.map(noti => (
                         <div key={noti.id} className={`flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer relative ${noti.unread ? 'bg-[#f0f9f6] border-[#006c49]/10' : 'bg-white border-slate-100 hover:border-[#006c49]/20'}`}>
                           <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center ${noti.type === 'order' ? 'bg-blue-50 text-blue-500' : noti.type === 'promo' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'}`}>
                              {noti.type === 'order' ? <Package size={20}/> : noti.type === 'promo' ? <Ticket size={20}/> : <ShieldCheck size={20}/>}
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                 <h5 className="font-bold text-slate-900 text-sm truncate pr-4">{noti.title}</h5>
                                 <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{noti.time}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{noti.desc}</p>
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {activeTab === "orders" && (
                  <div className="space-y-6 text-left">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                       <h2 className="text-xl font-black text-slate-900">Lịch sử đơn hàng</h2>
                       <div className="flex gap-2"><Filter size={18} className="text-slate-400 cursor-pointer"/><Search size={18} className="text-slate-400 cursor-pointer"/></div>
                    </div>
                    <div className="space-y-4">
                       {orders.map(order => (
                         <div key={order.id} className="p-4 rounded-3xl bg-white border border-slate-100 flex gap-4 items-center hover:shadow-md transition-all group">
                           <img src={order.img} className="w-16 h-16 rounded-2xl object-cover border border-slate-100" alt="prod" />
                           <div className="flex-1 text-left">
                              <div className="flex justify-between">
                                 <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Mã: #{order.id}</span>
                                 <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase ${order.status === 'Đã giao' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{order.status}</span>
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 mt-1">{order.date} • {order.items.join(", ")}</p>
                              <p className="text-base font-black text-[#006c49] mt-1">{order.total}</p>
                           </div>
                           <ChevronRight size={20} className="text-slate-300 group-hover:text-[#006c49] transition-all"/>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {activeTab === "addresses" && (
                  <div className="space-y-6 text-left">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-4 text-left">
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">Địa chỉ nhận hàng</h2>
                      <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-slate-800 transition-all shrink-0"><Plus size={14}/> Thêm mới</button>
                    </div>
                    <div className="space-y-4">
                      {addresses.map(loc => (
                        <div key={loc.id} className="p-5 border border-slate-100 rounded-3xl bg-[#fcfdfd] flex justify-between items-start group hover:border-[#006c49]/30 transition-all">
                          <div className="flex gap-4 text-left">
                            <div className="bg-[#e6f0ed] p-3 rounded-2xl text-[#006c49] shrink-0 h-fit"><MapPin size={20}/></div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap text-left">
                                <p className="font-bold text-slate-900 text-sm">{loc.name}</p>
                                {loc.isDefault && <span className="bg-[#006c49] text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Mặc định</span>}
                              </div>
                              <p className="text-[11px] font-bold text-slate-400">{loc.phone}</p>
                              <p className="text-xs text-slate-500 leading-relaxed max-w-md">{loc.addr}</p>
                            </div>
                          </div>
                          <button className="text-[#006c49] text-[10px] font-black uppercase underline ml-2 shrink-0">Sửa</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "vouchers" && (
                  <div className="space-y-5 text-left">
                    <h2 className="text-xl font-black text-slate-900 leading-tight border-b border-slate-50 pb-4">Kho Voucher</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                       {vouchers.map(v => (
                         <div key={v.id} className="flex bg-[#fcfdfd] border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                            <div className="bg-[#006c49] p-4 flex flex-col justify-center items-center text-white min-w-[80px]">
                               <Ticket size={24} className="mb-1 opacity-80"/>
                               <span className="text-[8px] font-black uppercase">Demi Mart</span>
                            </div>
                            <div className="p-4 flex-1 text-left relative">
                               <h5 className="font-black text-slate-900 text-sm tracking-tight">{v.title}</h5>
                               <p className="text-[10px] text-slate-400 mt-1">Đơn tối thiểu: {v.min}</p>
                               <div className="flex justify-between items-end mt-4">
                                  <span className="text-[9px] font-black text-[#fea619]">HSD: {v.expiry}</span>
                                  <button onClick={() => {navigator.clipboard.writeText(v.code); showToast("Đã copy mã!");}} className="text-[#006c49] text-[10px] font-black uppercase underline group-hover:scale-110 transition-transform">Dùng ngay</button>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {activeTab === "favorites" && (
                  <div className="space-y-5 text-left">
                    <h2 className="text-xl font-black text-slate-900 leading-tight border-b border-slate-50 pb-4 text-left">Sản phẩm yêu thích</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                       {favorites.map(fav => (
                         <div key={fav.id} className="bg-white rounded-3xl border border-slate-100 p-3 hover:shadow-lg transition-all group relative">
                            <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-md rounded-full text-red-500 shadow-sm z-10"><Heart size={14} fill="currentColor"/></button>
                            <img src={fav.img} className="w-full aspect-square rounded-2xl object-cover mb-3 group-hover:scale-105 transition-transform duration-500" alt="fav" />
                            <div className="text-center">
                               <p className="text-xs font-bold text-slate-800 line-clamp-1 leading-tight">{fav.name}</p>
                               <p className="text-sm font-black text-[#006c49] mt-1">{fav.price}</p>
                               <button className="w-full mt-3 py-1.5 bg-slate-50 text-[9px] font-black uppercase rounded-lg hover:bg-[#006c49] hover:text-white transition-all">Thêm vào giỏ</button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-toastIn { animation: toastIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #006c49; border-radius: 10px; }
      `}} />
    </div>
  );
}