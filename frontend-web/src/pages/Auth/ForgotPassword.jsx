import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ShieldCheck, KeyRound, ArrowRight, ArrowLeft, CheckCircle2, RefreshCcw } from "lucide-react";
import api from "../../api/axios";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState('email'); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const stats = [
        { value: "15k+", label: "Happy Clients" },
        { value: "30m", label: "Fast Delivery" },
    ];

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            // Trim email để tránh lỗi khoảng trắng đầu/cuối
            await api.post("/auth/forgot-password", { email: email.trim() });
            setStep('otp');
        } catch (err) {
            setError(err.response?.data?.message || "Email không tồn tại!");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        // Loại bỏ khoảng trắng trong mã OTP trước khi gửi
        const cleanOtp = otp.trim();
        console.log("Đang verify mã:", cleanOtp); // Demi check trong F12 xem mã có bị thừa gì không

        try {
            await api.post("/auth/verify-otp", { 
                email: email.trim(), 
                otp: cleanOtp 
            });
            setStep('reset');
        } catch (err) {
            setError(err.response?.data?.message || "Mã OTP không chính xác hoặc hết hạn!");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return setError("Mật khẩu không khớp!");
        setLoading(true);
        try {
            await api.post("/auth/reset-password", { 
                email: email.trim(), 
                otp: otp.trim(), 
                newPassword 
            });
            setStep('success');
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi đặt lại mật khẩu!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 h-screen w-screen flex bg-white overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] z-[9999]">
            
            {/* TRÁI: HERO SECTION */}
            <section className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 xl:p-16 text-white border-none shrink-0 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000" 
                        className="w-full h-full object-cover" 
                        alt="Fresh" 
                    />
                    <div className="absolute inset-0 bg-[#006c49]/80 mix-blend-multiply"></div>
                </div>

                <div className="relative z-10 space-y-6 max-w-xl">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#006c49] shadow-xl">
                        <ShieldCheck size={28} />
                    </div>
                    <h1 className="text-5xl xl:text-7xl font-black leading-[1.1] tracking-tighter">
                        Security <br /> 
                        <span className="text-white/90">First.</span>
                    </h1>
                    <p className="text-sm xl:text-lg opacity-90 leading-relaxed font-medium max-w-md">
                        Don't worry, we'll help you get back to your groceries in no time.
                    </p>
                </div>

                <div className="relative z-10 flex gap-4 w-full max-w-sm">
                    {stats.map((item, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 p-4 xl:p-5 rounded-2xl flex-1 text-center">
                            <div className="text-xl xl:text-3xl font-bold">{item.value}</div>
                            <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">{item.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* PHẢI: FORM SECTION */}
            <section className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-6 xl:p-20 bg-white shrink-0 overflow-hidden relative">
                
                <Link 
                    to="/login" 
                    className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-[#006c49] transition-all group font-bold text-[10px] uppercase tracking-widest"
                >
                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-[#006c49]/10 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    <span>Back to login</span>
                </Link>

                <div className="w-full max-w-[400px] xl:max-w-[480px] space-y-8 animate-fadeIn">
                    <header className="space-y-1 text-left">
                        <h2 className="text-3xl xl:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
                            {step === 'email' && "Reset Code"}
                            {step === 'otp' && "Verify Code"}
                            {step === 'reset' && "New Password"}
                            {step === 'success' && "All set!"}
                        </h2>
                        <p className="text-slate-500 font-medium text-xs xl:text-sm">
                            {step === 'email' && "Enter your email to receive an OTP"}
                            {step === 'otp' && `Code sent to ${email}`}
                            {step === 'reset' && "Enter your new secure password"}
                            {step === 'success' && "Redirecting you back to login..."}
                        </p>
                    </header>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold text-center animate-pulse">
                            ⚠️ {error}
                        </div>
                    )}

                    {step === 'email' && (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div className="space-y-1.5 relative text-left">
                                <label className="text-[10px] xl:text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#006c49] z-10 transition-colors" size={18} />
                                    <input type="email" placeholder="name@fresh.com" className="demi-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                            </div>
                            <button disabled={loading} className="w-full bg-[#006c49] hover:bg-[#004d34] text-white py-3.5 xl:py-4.5 rounded-xl font-black text-sm xl:text-lg shadow-lg active:scale-[0.98] transition-all uppercase flex items-center justify-center gap-2">
                                {loading ? "..." : <>Send OTP <ArrowRight size={20} /></>}
                            </button>
                        </form>
                    )}

                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="space-y-1.5 relative text-left">
                                <label className="text-[10px] xl:text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Enter 6-Digit OTP</label>
                                <div className="relative group">
                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#006c49] z-10 transition-colors" size={18} />
                                    <input 
                                        type="text" 
                                        maxLength="6" 
                                        placeholder="000000" 
                                        autoComplete="one-time-code"
                                        className="demi-input tracking-[1em] text-center font-black" 
                                        value={otp} 
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Chỉ cho phép nhập số
                                        required 
                                    />
                                </div>
                            </div>
                            <button disabled={loading} className="w-full bg-[#006c49] hover:bg-[#004d34] text-white py-3.5 xl:py-4.5 rounded-xl font-black text-sm xl:text-lg shadow-lg uppercase">
                                {loading ? "..." : "Verify OTP"}
                            </button>
                            <button type="button" onClick={() => setStep('email')} className="w-full text-[10px] font-bold text-slate-400 uppercase hover:text-[#006c49] flex items-center justify-center gap-1">
                                <RefreshCcw size={12} /> Resend Email
                            </button>
                        </form>
                    )}

                    {step === 'reset' && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-1.5 relative text-left">
                                <label className="text-[10px] xl:text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#006c49] z-10 transition-colors" size={18} />
                                    <input type="password" placeholder="••••••••" className="demi-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-1.5 relative text-left">
                                <label className="text-[10px] xl:text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Confirm New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#006c49] z-10 transition-colors" size={18} />
                                    <input type="password" placeholder="••••••••" className="demi-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                </div>
                            </div>
                            <button disabled={loading} className="w-full bg-[#006c49] hover:bg-[#004d34] text-white py-3.5 xl:py-4.5 rounded-xl font-black text-sm xl:text-lg shadow-lg uppercase">
                                {loading ? "..." : "Update Password"}
                            </button>
                        </form>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center space-y-4 py-8 animate-fadeIn">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-[#006c49]">
                                <CheckCircle2 size={48} />
                            </div>
                            <p className="font-bold text-slate-600">Password reset successful!</p>
                        </div>
                    )}
                </div>
            </section>

            <style dangerouslySetInnerHTML={{ __html: `
                .demi-input { 
                    width: 100%; 
                    padding-left: 3rem; 
                    padding-right: 1rem; 
                    padding-top: 0.8rem; 
                    padding-bottom: 0.8rem; 
                    background-color: white; 
                    border: 1px solid #e2e8f0; 
                    border-radius: 0.8rem; 
                    outline: none; 
                    transition: all 0.3s; 
                    font-size: 0.875rem; 
                    color: #0f172a;
                }
                .demi-input::placeholder { color: #94a3b8; opacity: 1; }
                .demi-input:focus { border-color: #006c49; box-shadow: 0 0 0 4px rgba(0, 108, 73, 0.05); }
                @media (min-width: 1280px) { 
                    .demi-input { padding-top: 1.1rem; padding-bottom: 1.1rem; font-size: 1rem; padding-left: 3.5rem; border-radius: 1rem; } 
                }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
            `}} />
        </div>
    );
}