import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup"; // Import trang đăng ký
import ForgotPassword from "./pages/Auth/ForgotPassword"; // Import trang quên mật khẩu
import Profile from "./pages/Profile/Profile"; // Import trang Profile
/**
 * 1. MAIN LAYOUT: Cho trang chủ và mua sắm
 * (Có Header + Sidebar khít chuẩn Weee!)
 */
const MainLayout = () => (
  <div className="min-h-screen flex flex-col bg-white">
    <Header />
    <div className="flex flex-1 pt-16 w-full"> 
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 border-l border-gray-100"> 
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  </div>
);

/**
 * 2. AUTH LAYOUT: Cho Login, Signup, Forgot Password
 * (Tràn viền hoàn toàn, không Header/Sidebar)
 */
const AuthLayout = () => (
  <div className="min-h-screen w-full bg-white flex items-center justify-center">
    <Outlet />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Nhóm trang mua sắm chính */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Nhóm trang xác thực tài khoản */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Bạn có thể thêm trang 404 ở đây */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;