import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";

// Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // Đảm bảo Demi đã tạo file này

// 1. Cấu trúc cho trang chính (Có Header/Sidebar/Footer)
const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col text-white">
      <Header />
      <div className="flex flex-1 pt-20">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <main className="flex-1 p-6 lg:p-10">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

// 2. Cấu trúc cho trang Login/Signup (Biệt lập hoàn toàn)
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-6">
      <Outlet />
    </div>
  );
};

// 3. Component bảo vệ: Chỉ cho phép User đã login đi qua
const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);
  // Nếu chưa login thì "đá" ra trang login ngay
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          {/* A. NHÓM TRANG CÔNG KHAI (Có Header/Sidebar nhưng ai cũng xem được) */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            {/* Thêm các trang như: /products, /about... ở đây */}
          </Route>

          {/* B. NHÓM TRANG BẢO MẬT (Phải Login mới vào được) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
               <Route path="/profile" element={
                 <div className="p-10 bg-white/5 rounded-3xl border border-white/10">
                   <h2 className="text-2xl font-bold">Hồ sơ cá nhân</h2>
                   <p className="text-blue-400 mt-2 italic text-sm">Chỉ Demi mới nhìn thấy nội dung này!</p>
                 </div>
               } />
               <Route path="/checkout" element={<div>Trang thanh toán của Demi</div>} />
            </Route>
          </Route>

          {/* C. NHÓM TRANG AUTH (Biệt lập, không có Header/Sidebar) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* D. ĐIỀU HƯỚNG MẶC ĐỊNH */}
          <Route path="*" element={<Navigate to="/" />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;