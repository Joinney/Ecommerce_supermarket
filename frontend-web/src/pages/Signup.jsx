import { useState, useContext, useId } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Phone, MapPin, Calendar, ArrowRight, CheckCircle2, Users } from "lucide-react";

export default function Signup() {
    const baseId = useId();
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        username: "", password: "", email: "", full_name: "", phone: "", gender: "Nam", birth_date: "", address: "", confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (formData.password !== formData.confirmPassword) return setError("Mật khẩu xác nhận không khớp!");
        setLoading(true);
        const result = await register(formData);
        if (result.success) { navigate("/login"); } 
        else { setError(result.message); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 h-screen w-screen flex bg-white overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] z-[9999]">
            
            {/* TRÁI: HERO SECTION */}
            <section className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 xl:p-16 text-white border-none shrink-0 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000" 
                        className="w-full h-full object-cover" 
                        alt="Fresh Vegetables" 
                    />
                    <div className="absolute inset-0 bg-[#006c49]/80 mix-blend-multiply"></div>
                </div>

                <div className="relative z-10 space-y-6 max-w-xl">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#006c49] shadow-xl">
                        <Users size={28} />
                    </div>
                    <h1 className="text-5xl xl:text-7xl font-black leading-[1.1] tracking-tighter">
                        Join our community <br /> 
                        <span className="text-white/90">of food lovers.</span>
                    </h1>
                </div>

                <div className="relative z-10 flex gap-4 w-full max-w-lg font-bold">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex-1 text-center">
                        <div className="text-xl xl:text-3xl">15k+</div>
                        <div className="text-[10px] opacity-60 uppercase tracking-widest mt-1">Happy Clients</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex-1 text-center">
                        <div className="text-xl xl:text-3xl">4.9/5</div>
                        <div className="text-[10px] opacity-60 uppercase tracking-widest mt-1">Ratings</div>
                    </div>
                </div>
            </section>

            {/* PHẢI: SIGNUP FORM */}
            <section className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-6 xl:p-20 bg-white shrink-0 overflow-hidden">
                <div className="w-full max-w-[400px] xl:max-w-[460px] space-y-6 xl:space-y-8 animate-fadeIn">
                    <header className="space-y-1">
                        <h2 className="text-3xl xl:text-4xl font-extrabold text-slate-900 tracking-tight leading-none uppercase text-left">Create Account</h2>
                        <p className="text-slate-500 font-medium text-xs xl:text-sm text-left">Thành viên hệ thống Demi Mart</p>
                    </header>

                    {error && <div className="p-2 bg-red-50 text-red-600 rounded-xl text-center text-xs font-bold">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-3 xl:space-y-4">
                        <div className="grid grid-cols-2 gap-3 xl:gap-4">
                            <InputGroup label="Họ và tên" icon={<User size={16}/>}>
                                <input name="full_name" type="text" placeholder="Nguyễn Văn A" value={formData.full_name} onChange={handleChange} required className="demi-input" />
                            </InputGroup>
                            <InputGroup label="Tên đăng nhập" icon={<User size={16}/>}>
                                <input name="username" type="text" placeholder="demi_pro" value={formData.username} onChange={handleChange} required className="demi-input" />
                            </InputGroup>
                        </div>

                        <div className="grid grid-cols-2 gap-3 xl:gap-4">
                            <InputGroup label="Email" icon={<Mail size={16}/>}>
                                <input name="email" type="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} required className="demi-input" />
                            </InputGroup>
                            <InputGroup label="Số điện thoại" icon={<Phone size={16}/>}>
                                <input name="phone" type="tel" placeholder="0901 234 567" value={formData.phone} onChange={handleChange} required className="demi-input" />
                            </InputGroup>
                        </div>

                        <InputGroup label="Địa chỉ" icon={<MapPin size={16}/>}>
                            <input name="address" type="text" placeholder="Quận 12, TP.HCM" value={formData.address} onChange={handleChange} required className="demi-input" />
                        </InputGroup>
                        
                        <div className="grid grid-cols-2 gap-3 xl:gap-4">
                            <InputGroup label="Ngày sinh" icon={<Calendar size={16}/>}>
                                <input name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} required className="demi-input" />
                            </InputGroup>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">Giới tính</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 xl:py-3 bg-[#f8f9ff] border border-slate-200 rounded-xl outline-none focus:border-[#006c49] text-sm xl:text-base appearance-none cursor-pointer text-slate-900">
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 xl:gap-4">
                            <InputGroup label="Mật khẩu" icon={<Lock size={16}/>}>
                                <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className="demi-input" />
                            </InputGroup>
                            <InputGroup label="Xác nhận" icon={<Lock size={16}/>}>
                                <input name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required className="demi-input" />
                            </InputGroup>
                        </div>

                        <button disabled={loading} className="w-full bg-[#006c49] hover:bg-[#004d34] text-white py-3.5 xl:py-4.5 rounded-xl font-bold text-sm xl:text-lg shadow-lg active:scale-[0.98] transition-all uppercase mt-2">
                            {loading ? "..." : "Đăng ký ngay"}
                        </button>
                    </form>
                    <p className="text-center text-xs xl:text-sm text-slate-400 font-medium">Already have account? <Link to="/login" className="text-[#006c49] font-black hover:underline">Sign In</Link></p>
                </div>
            </section>

            <style dangerouslySetInnerHTML={{ __html: `
                .demi-input { 
                    width: 100%; 
                    padding-left: 2.8rem; 
                    padding-right: 1rem; 
                    padding-top: 0.65rem; 
                    padding-bottom: 0.65rem; 
                    background-color: #f8f9ff; 
                    border: 1px solid #e2e8f0; 
                    border-radius: 0.8rem; 
                    outline: none; 
                    transition: all 0.3s; 
                    font-size: 0.85rem; 
                    color: #0f172a; /* Màu chữ khi nhập */
                }
                /* Sửa lỗi chữ placeholder bị mờ */
                .demi-input::placeholder {
                    color: #94a3b8 !important; /* Màu slate-400 */
                    opacity: 1;
                }
                .demi-input:focus { 
                    border-color: #006c49; 
                    background-color: white; 
                    box-shadow: 0 0 0 4px rgba(0, 108, 73, 0.05); 
                }
                @media (min-width: 1280px) { 
                    .demi-input { 
                        padding-top: 1.1rem; 
                        padding-bottom: 1.1rem; 
                        font-size: 1rem; 
                        padding-left: 3.5rem; 
                        border-radius: 1rem; 
                    } 
                }
            `}} />
        </div>
    );
}

function InputGroup({ label, icon, children }) {
    return (
        <div className="space-y-1 relative text-left">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1 block">{label}</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#006c49] z-10 transition-colors">
                    {icon}
                </div>
                {children}
            </div>
        </div>
    );
}