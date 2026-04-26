import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Profile from "./pages/Profile/Profile";

/**
 * 1. MAIN LAYOUT: Cập nhật logic ẩn/hiện Sidebar
 */
const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Truyền hàm mở vào Header */}
      <Header onOpenMenu={() => setIsSidebarOpen(true)} />
      
      {/* Tăng pt-16 lên pt-[112px] để không bị Header 2 tầng đè lên nội dung */}
      <div className="flex flex-1 pt-[112px] w-full relative"> 
        
        {/* Truyền state và hàm đóng vào Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <div className="flex-1 flex flex-col min-w-0 border-l border-gray-100"> 
          <main className="flex-1 overflow-x-hidden">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

/**
 * 2. AUTH LAYOUT: Giữ nguyên logic tràn viền
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;