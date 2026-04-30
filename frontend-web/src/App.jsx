import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext"; 
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Profile from "./pages/Profile/Profile";

/**
 * 1. MAIN LAYOUT
 */
const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onOpenMenu={() => setIsSidebarOpen(true)} />
      
      <div className="flex flex-1 pt-[112px] w-full relative bg-white"> 
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <div className="flex-1 flex flex-col min-w-0 border-l border-gray-100 bg-white"> 
          <main className="flex-1 overflow-x-hidden bg-white">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

/**
 * 2. AUTH LAYOUT
 */
const AuthLayout = () => (
  <div className="min-h-screen w-full bg-white flex items-center justify-center">
    <Outlet />
  </div>
);

/**
 * 3. APP ROUTES (Sử dụng màn hình chờ màu trắng)
 */
const AppRoutes = () => {
  const { loading, user } = useContext(AuthContext); // Giả sử AuthContext có biến user

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Protected Routes: Nếu không có user thì có thể bọc thêm logic Redirect ở đây */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </Router>
  );
};

/**
 * 4. FINAL APP
 */
function App() {
  return (
    <AuthProvider>
       <AppRoutes />
    </AuthProvider>
  );
}

export default App;