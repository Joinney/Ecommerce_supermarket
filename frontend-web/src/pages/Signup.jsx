import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    const [formData, setFormData] = useState({
        username: "", 
        password: "", 
        email: "", 
        full_name: "",
        phone: "",       // Frontend dùng 'phone'
        gender: "Nam",   
        birth_date: "",  // Frontend dùng 'birth_date'
        address: "",
        confirmPassword: ""
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (formData.password !== formData.confirmPassword) {
            return setError("Mật khẩu xác nhận không khớp!");
        }

        setLoading(true);
        // Gửi toàn bộ formData sang Backend
        const result = await register(formData);
        
        if (result.success) {
            alert("Đăng ký thành công rực rỡ! Đăng nhập thôi Demi.");
            navigate("/login");
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="relative w-full max-w-3xl my-10 animate-fadeIn font-sans">
            {/* Hiệu ứng Glow nền */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]"></div>

            <form onSubmit={handleSubmit} className="relative p-[2px] rounded-[40px] bg-gradient-to-br from-white/20 to-transparent shadow-2xl">
                <div className="bg-[#0b0e14]/90 backdrop-blur-3xl rounded-[38px] p-10 flex flex-col gap-8">
                    
                    <div className="text-center space-y-2">
                        <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tighter uppercase">
                            Create Account
                        </h2>
                        <p className="text-gray-500 text-xs font-medium tracking-[0.2em] uppercase">Thành viên hệ thống Demi Mart</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl text-center backdrop-blur-md animate-pulse">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-left">
                        {/* Group: Thông tin cá nhân */}
                        <div className="space-y-4">
                            <InputField label="Họ và tên" name="full_name" value={formData.full_name} type="text" placeholder="Võ Duy Toàn" onChange={handleChange} />
                            <InputField label="Email" name="email" value={formData.email} type="email" placeholder="demi@example.com" onChange={handleChange} />
                            <InputField label="Số điện thoại" name="phone" value={formData.phone} type="text" placeholder="0901 234 567" onChange={handleChange} />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Ngày sinh" name="birth_date" value={formData.birth_date} type="date" onChange={handleChange} />
                                <div className="space-y-1.5 text-left">
                                    <label className="text-[10px] text-gray-500 ml-4 font-bold uppercase tracking-widest">Giới tính</label>
                                    <select 
                                        name="gender" 
                                        value={formData.gender}
                                        className="w-full p-4 bg-[#1a1f26] border border-white/10 rounded-2xl outline-none focus:border-blue-500 text-white transition-all appearance-none cursor-pointer text-sm shadow-inner" 
                                        onChange={handleChange}
                                    >
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Group: Thông tin tài khoản */}
                        <div className="space-y-4 text-left">
                            <InputField label="Tên đăng nhập" name="username" value={formData.username} type="text" placeholder="demi_pro" onChange={handleChange} />
                            <InputField label="Địa chỉ" name="address" value={formData.address} type="text" placeholder="Quận 12, TP.HCM" onChange={handleChange} />
                            <InputField label="Mật khẩu" name="password" value={formData.password} type="password" placeholder="••••••••" onChange={handleChange} />
                            <InputField label="Xác nhận mật khẩu" name="confirmPassword" value={formData.confirmPassword} type="password" placeholder="••••••••" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col items-center gap-6">
                        <button disabled={loading} className="group relative w-full h-14 bg-blue-600 rounded-2xl font-bold text-white overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            {loading ? "PROCESSING..." : "REGISTER NOW"}
                        </button>
                        
                        <p className="text-sm text-gray-500">
                            Đã có tài khoản? <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors underline underline-offset-4">Đăng nhập</Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}

// Chú ý thêm prop value={value} để input đồng bộ hoàn toàn với state
function InputField({ label, name, type, placeholder, onChange, value }) {
    return (
        <div className="space-y-1.5 text-left">
            <label className="text-[10px] text-gray-500 ml-4 font-bold uppercase tracking-widest">{label}</label>
            <input 
                name={name} 
                type={type} 
                value={value}
                placeholder={placeholder} 
                required 
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 focus:bg-white/[0.08] text-white transition-all placeholder:text-gray-700 text-sm shadow-inner"
                onChange={onChange} 
            />
        </div>
    );
}