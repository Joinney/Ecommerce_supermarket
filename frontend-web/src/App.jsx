import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";

// Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";

/** * 1. LAYOUT CHÍNH (Có Header/Sidebar/Footer)
 */
const AppLayout = () => (
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

/** * 2. LAYOUT AUTH (Trang Login/Signup trắng sạch)
 */
const AuthLayout = () => (
  <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-6">
    <Outlet />
  </div>
);

/** * 3. PROTECTED ROUTE: Chỉ cho người ĐÃ Login
 */
const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-white">Đang tải dữ liệu...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

/** * 4. PUBLIC ROUTE: Chỉ cho người CHƯA Login
 */
const PublicRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          {/* A. NHÓM TRANG CÔNG KHAI: Ai cũng xem được */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* B. TRANG XỬ LÝ GOOGLE CALLBACK: Đặt ở đây để tóm Token */}
          {/* Demi lưu ý: Trang này không bọc trong PublicRoute để tránh bị redirect ngược lại khi đang xử lý */}
       

          {/* C. NHÓM TRANG AUTH: Chỉ dành cho khách chưa Login */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
          </Route>

          {/* D. NHÓM TRANG RIÊNG TƯ: Bắt buộc phải Login */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/profile" element={
                <div className="p-10 bg-white/5 rounded-3xl border border-white/10 text-center">
                  <h2 className="text-2xl font-bold">Chào Demi! 👋</h2>
                  <p className="text-blue-400 mt-2 italic text-sm">Trang hồ sơ cá nhân đã sẵn sàng.</p>
                </div>
              } />
              <Route path="/checkout" element={<div>Trang thanh toán của Demi</div>} />
            </Route>
          </Route>

          {/* E. XỬ LÝ TRANG LỖI 404 */}
          <Route path="*" element={
            <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center text-white">
              <h1 className="text-6xl font-black text-blue-500">404</h1>
              <p className="mt-4 text-gray-400">Trang này không tồn tại rồi Demi ơi!</p>
              <a href="/" className="mt-6 px-6 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition">Về nhà thôi</a>
            </div>
          } />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;