import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; 
import { 
  User, Mail, Phone, MapPin, Camera, Edit2, CheckCircle2, Lock, Heart, 
  ChevronRight, Clock, Package, ShoppingBag, ShieldCheck, CreditCard, 
  Star, Wallet, Ticket, Bell, Settings, Eye, History, Zap, Award, Trash2, X, Plus, Info, Menu, Search, Filter
} from "lucide-react";

// --- CẤU HÌNH API ---
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocalhost ? 'http://localhost:5000' : 'https://ecommerce-supermarket-k691.onrender.com';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default function App() {
  const { user: authUser, updateUser } = useContext(AuthContext);

  const [profile, setProfile] = useState(null); 
  const [addresses, setAddresses] = useState([]); // State lưu danh sách địa chỉ thật
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [loading, setLoading] = useState(true);

  // 1. TỰ ĐỘNG LẤY DỮ LIỆU HỒ SƠ TỪ DATABASE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/profile/hoso");
        if (response.data.success) {
          setProfile(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi xác thực:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. TỰ ĐỘNG LẤY ĐỊA CHỈ KHI CHUYỂN SANG TAB ĐỊA CHỈ
  useEffect(() => {
    if (activeTab === "addresses") {
      fetchAddresses();
    }
  }, [activeTab]);

  const fetchAddresses = async () => {
    try {
      const response = await api.get("/addresses");
      if (response.data.success) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải địa chỉ:", error);
    }
  };

  // 3. HÀM LƯU THÔNG TIN HỒ SƠ
  const handleSaveProfile = async () => {
    try {
      const response = await api.put("/profile/hoso", profile);
      if (response.data.success) {
        if (updateUser) {
           updateUser(profile); 
        }
        showToast("Đã lưu hồ sơ vào Database!");
      }
    } catch (error) {
      showToast("Lỗi khi lưu dữ liệu!", "error");
    }
  };

  // 4. HÀM UPLOAD ẢNH ĐẠI DIỆN
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
        const response = await api.post("/profile/upload-avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        if (response.data.success) {
            const newUrl = response.data.avatarUrl;
            setProfile(prev => ({ ...prev, avatar_url: newUrl }));
            const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
            savedUser.avatar_url = newUrl; 
            localStorage.setItem('user', JSON.stringify(savedUser));
            if (updateUser) {
                updateUser({ avatar_url: newUrl });
            }
            showToast("Đã cập nhật ảnh đại diện!");
        }
    } catch (error) {
        console.error(error);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const getAvatarSrc = (url) => {
    if (!url || url === "" || url.includes('unsplash.com')) {
       return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=006c49&color=fff`;
    }
    if (url.startsWith('http')) return `${url}?t=${new Date().getTime()}`; 
    return `${API_BASE_URL}${url.startsWith('/') ? url : '/' + url}?t=${new Date().getTime()}`; 
  };

  // --- DỮ LIỆU MẪU CÁC TAB CHƯA CÓ API ---
  const notifications = [
    { id: 1, title: "Ưu đãi Platinum độc quyền", desc: "Giảm ngay 100k cho đơn hàng từ 500k.", time: "10 phút trước", type: "promo", unread: true },
    { id: 2, title: "Đơn hàng #DM9922 thành công", desc: "Kiện hàng của bạn đã được giao.", time: "2 giờ trước", type: "order", unread: false },
  ];

  const orders = [
    { id: "DM1002", date: "22/10/2023", total: "450.000đ", status: "Đã giao", items: ["Táo Envy Mỹ", "Sữa tươi TH"], img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=100" },
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-[#006c49] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <p className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Đang kết nối Database...</p>
    </div>
  );

  return (
    <div className="w-full bg-[#f0f2f5] font-sans text-slate-700 min-h-screen transition-all relative selection:bg-[#006c49] selection:text-white pb-8 text-left">
      
      {/* 1. MOBILE HEADER */}
      <div className="md:hidden sticky top-0 z-[100] bg-white border-b border-slate-100 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img src={getAvatarSrc(profile.avatar_url)} className="w-10 h-10 rounded-2xl object-cover border-2" alt="avt" />
            <div className="absolute -top-1 -right-1 bg-amber-400 text-white p-0.5 rounded-md border border-white shadow-sm"><Award size={8} fill="currentColor" /></div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 text-sm tracking-tight leading-none">{profile.full_name}</span>
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
          <div className={`bg-white border-l-4 ${toast.type === 'success' || toast.type === 'info' ? 'border-[#006c49]' : 'border-red-500'} shadow-2xl rounded-xl p-3 flex items-center gap-3`}>
            {toast.type === 'error' ? <X size={18} className="text-red-500" /> : <CheckCircle2 size={18} className="text-[#006c49]" />}
            <p className="text-xs font-bold">{toast.message}</p>
          </div>
        </div>
      )}

      {/* --- DESKTOP STRUCTURE --- */}
      <div className="max-w-[1600px] mx-auto px-0 md:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row gap-6 pt-0 md:pt-6 items-start">
          
          {/* SIDEBAR */}
          <aside className="hidden md:block w-64 lg:w-72 shrink-0 space-y-4 sticky top-6">
            <div className="bg-white rounded-[32px] p-5 shadow-sm border border-slate-100 flex items-center gap-4 h-[90px]">
              <div className="relative shrink-0">
                <img src={getAvatarSrc(profile.avatar_url)} className="w-14 h-14 rounded-2xl object-cover border-4 border-[#f0f9f6]" alt="Avatar" />
                <div className="absolute -top-1 -right-1 bg-amber-400 text-white p-1 rounded-lg border-2 border-white shadow-sm"><Award size={10} fill="currentColor" /></div>
              </div>
              <div className="overflow-hidden">
                <h4 className="font-black text-slate-900 truncate tracking-tight text-sm">{profile.full_name}</h4>
                <p className="text-[9px] font-black text-[#006c49] uppercase tracking-widest flex items-center gap-1"><Zap size={9} fill="currentColor"/> Platinum</p>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-2 shadow-sm border border-slate-100 space-y-4">
              {menuGroups.map((group, idx) => (
                <div key={idx} className="space-y-0.5">
                  <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{group.title}</p>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? "bg-[#006c49] text-white shadow-lg" : "text-slate-500 hover:bg-slate-50 hover:text-[#006c49]"}`}
                    >
                      <span className={activeTab === item.id ? "text-white" : "text-slate-300"}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </aside>

          <div className="flex-1 w-full space-y-4">
            {/* WIDGETS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4">
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
                    </div>
                  </div>
                </div>
                <CreditCard className="absolute -right-4 -bottom-4 w-20 h-20 opacity-10 -rotate-12" />
              </div>
              
              {/* WIDGET THƯỞNG - NÚT ĐỔI NGAY NẰM BÊN PHẢI */}
              <div className="bg-white rounded-none md:rounded-[28px] p-4 shadow-sm border border-slate-100 flex items-center h-auto md:h-[100px]">
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex flex-col justify-center">
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 whitespace-nowrap">
                      <Star size={12} fill="#fea619" className="text-[#fea619]"/> Thưởng
                    </p>
                    <div className="mt-1">
                      <span className="text-lg md:text-xl font-black tabular-nums leading-none whitespace-nowrap">
                        1.250 <span className="text-[8px] font-bold text-slate-400 uppercase">Xu</span>
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => showToast("Hệ thống đang bảo trì")}
                    className="text-[8px] font-black text-[#006c49] border border-[#006c49]/20 px-3 py-1.5 rounded-lg uppercase hover:bg-[#006c49] hover:text-white transition-all active:scale-95"
                  >
                    Đổi ngay
                  </button>
                </div>
              </div>
            </div>

            <div className="md:hidden bg-[#f0f2f5] py-2 px-4 flex overflow-x-auto no-scrollbar gap-2 sticky top-[73px] z-[90]">
              {mobileTabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-[10px] font-black uppercase transition-all border shadow-sm ${activeTab === item.id ? "bg-[#006c49] text-white border-[#006c49]" : "bg-white text-slate-500 border-slate-200"}`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-none md:rounded-[32px] shadow-sm border-none md:border border-slate-100 overflow-hidden flex flex-col min-h-screen md:min-h-[550px]">
              
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

              <div className="px-5 md:px-8 lg:px-12 pb-10 pt-6 md:pt-8 animate-fadeIn flex-1">
                
                {/* --- TAB HỒ SƠ --- */}
                {activeTab === "profile" && (
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-4 text-left">
                      <h2 className="text-xl font-black text-slate-900 leading-tight tracking-tight">Hồ sơ cá nhân</h2>
                      <button onClick={handleSaveProfile} className="hidden md:block bg-[#006c49] text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase shadow-lg hover:scale-[1.02] active:scale-95 transition-all">Lưu thay đổi</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      <div className="lg:col-span-2 space-y-6 text-left">
                        <div className="grid grid-cols-3 items-center gap-4 border-b border-slate-50 pb-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tên đăng nhập</label>
                          <div className="col-span-2 font-bold text-slate-800 text-sm py-2">{profile.username}</div>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-4">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Họ và tên</label>
                          <input type="text" value={profile.full_name || ""} onChange={(e) => setProfile({...profile, full_name: e.target.value})} className="col-span-2 bg-[#f8fafc] p-3.5 rounded-xl border border-slate-100 font-bold text-slate-800 text-sm focus:bg-white focus:border-[#006c49] outline-none" />
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                          <input type="email" value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="col-span-2 bg-[#f8fafc] p-3.5 rounded-xl border border-slate-100 font-bold text-slate-800 text-sm focus:bg-white focus:border-[#006c49] outline-none" />
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</label>
                          <input type="text" value={profile.phone_number || ""} onChange={(e) => setProfile({...profile, phone_number: e.target.value})} className="col-span-2 bg-[#f8fafc] p-3.5 rounded-xl border border-slate-100 font-bold text-slate-800 text-sm focus:bg-white focus:border-[#006c49] outline-none" />
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4 pt-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Giới tính</label>
                          <div className="col-span-2 flex gap-6">
                            {["Nam", "Nữ", "Khác"].map((gender) => (
                              <label key={gender} className="flex items-center gap-2 cursor-pointer group text-xs font-bold text-slate-600">
                                <input type="radio" name="gender" checked={profile.gender === gender} onChange={() => setProfile({...profile, gender: gender})} className="w-4 h-4 accent-[#006c49]" /> {gender}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4 pt-1 text-xs font-bold">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ngày sinh</label>
                          <input type="date" value={profile.birthday ? profile.birthday.split('T')[0] : ""} onChange={(e) => setProfile({...profile, birthday: e.target.value})} className="col-span-2 bg-[#f8fafc] p-3.5 rounded-xl border border-slate-100 font-bold text-slate-800 text-sm outline-none focus:border-[#006c49]" />
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-start pt-2 order-first lg:order-last">
                        <div className="bg-[#f8fafc] rounded-[32px] p-8 border-2 border-slate-100 border-dashed w-full flex flex-col items-center text-center">
                          <div className="relative mb-4 group">
                            <img src={getAvatarSrc(profile.avatar_url)} className="w-28 h-28 rounded-[36px] object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-all" alt="Avatar" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=User&background=006c49&color=fff`; }} />
                            <label htmlFor="avatar-up" className="absolute -bottom-1 -right-1 bg-white p-2.5 rounded-xl shadow-lg border border-slate-100 text-[#006c49] cursor-pointer hover:scale-110 transition-all"><Camera size={16} /></label>
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase">Ảnh đại diện</p>
                          <input type="file" id="avatar-up" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB ĐỊA CHỈ: HIỂN THỊ DỮ LIỆU THẬT --- */}
                {activeTab === "addresses" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-4 text-left">
                      <h2 className="text-xl font-black text-slate-900 leading-tight tracking-tight">Địa chỉ của tôi</h2>
                      <button 
                        onClick={() => showToast("Tính năng thêm địa chỉ đang được cập nhật", "info")}
                        className="bg-[#006c49] text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 shadow-lg shadow-[#006c49]/20"
                      >
                        <Plus size={14} /> Thêm địa chỉ mới
                      </button>
                    </div>

                    <div className="space-y-4">
                      {addresses.length > 0 ? (
                        addresses.map((addr) => (
                          <div key={addr.address_id} className="p-5 rounded-3xl bg-white border border-slate-100 flex justify-between items-start hover:shadow-md transition-all text-left">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <span className="font-black text-slate-900 text-sm">{addr.receiver_name}</span>
                                <span className="text-slate-300">|</span>
                                <span className="text-slate-500 text-xs font-bold">{addr.receiver_phone}</span>
                                {addr.is_default && (
                                  <span className="text-[8px] bg-red-50 text-red-500 px-2 py-0.5 rounded border border-red-100 font-black uppercase">Mặc định</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 font-medium">{addr.detail_address}</p>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                                {`${addr.ward_name}, ${addr.district_name}, ${addr.province_name}`}
                              </p>
                            </div>
                            <div className="flex gap-4">
                              <button className="text-[10px] font-black text-[#006c49] uppercase hover:underline">Cập nhật</button>
                              {!addr.is_default && (
                                <button className="text-[10px] font-black text-red-500 uppercase hover:underline">Xóa</button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-300">
                          <MapPin size={40}/>
                          <p className="text-xs font-black uppercase tracking-widest text-center">Bạn chưa có địa chỉ nào</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* --- TAB THÔNG BÁO --- */}
                {activeTab === "notifications" && (
                  <div className="space-y-6 text-left">
                    <h2 className="text-xl font-black text-slate-900 border-b border-slate-50 pb-4">Thông báo mới nhất</h2>
                    <div className="space-y-3">
                       {notifications.map(noti => (
                         <div key={noti.id} className={`flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${noti.unread ? 'bg-[#f0f9f6] border-[#006c49]/10' : 'bg-white border-slate-100'}`}>
                           <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center ${noti.type === 'order' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'}`}>
                              {noti.type === 'order' ? <Package size={20}/> : <Ticket size={20}/>}
                           </div>
                           <div className="flex-1">
                              <div className="flex justify-between items-start">
                                 <h5 className="font-bold text-slate-900 text-sm truncate pr-4">{noti.title}</h5>
                                 <span className="text-[10px] text-slate-400 font-bold">{noti.time}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{noti.desc}</p>
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {/* TAB ĐƠN HÀNG */}
                {activeTab === "orders" && (
                  <div className="space-y-6 text-left">
                    <h2 className="text-xl font-black text-slate-900 border-b border-slate-50 pb-4">Lịch sử đơn hàng</h2>
                    <div className="space-y-4">
                       {orders.map(order => (
                         <div key={order.id} className="p-4 rounded-3xl bg-white border border-slate-100 flex gap-4 items-center hover:shadow-md transition-all group">
                           <img src={order.img} className="w-16 h-16 rounded-2xl object-cover border border-slate-100" alt="prod" />
                           <div className="flex-1">
                              <div className="flex justify-between">
                                 <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Mã: #{order.id}</span>
                                 <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase bg-emerald-50 text-emerald-600`}>{order.status}</span>
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 mt-1">{order.date}</p>
                              <p className="text-base font-black text-[#006c49]">{order.total}</p>
                           </div>
                           <ChevronRight size={20} className="text-slate-300 group-hover:text-[#006c49] transition-all"/>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {/* CÁC TAB KHÁC CHƯA CÓ GIAO DIỆN CHI TIẾT */}
                {["security", "vouchers", "favorites"].includes(activeTab) && (
                  <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-300">
                    <Package size={40}/>
                    <p className="text-sm font-bold uppercase tracking-widest text-center">Dữ liệu cho {activeTab} đang cập nhật</p>
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
      `}} />
    </div>
  );
}