import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Cổng 1: Kích hoạt chọn tài khoản Google
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' 
}));

// Cổng 2: Xử lý dữ liệu trả về
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login', session: true }),
    (req, res) => {
        try {
            const user = req.user;

            // 1. Tạo Token JWT
            const token = jwt.sign(
                { id: user.user_id, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'your_secret_key',
                { expiresIn: '7d' }
            );

            // 2. Chuẩn bị thông tin User
            const userData = {
                user_id: user.user_id,
                full_name: user.full_name || user.username,
                avatar_url: user.avatar_url,
                role: user.role
            };

            // 3. XỬ LÝ REDIRECT THÔNG MINH (Chống lỗi Not Found)
            // Lấy URL Frontend, ưu tiên Render, nếu không có thì dùng localhost
            let frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            
            // Xóa dấu gạch chéo '/' ở cuối nếu có để tránh lỗi double slash (//)
            frontendUrl = frontendUrl.replace(/\/$/, "");

            // Tạo chuỗi Redirect chuẩn
            const queryParams = `token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
            const redirectUrl = `${frontendUrl}/?${queryParams}`;
            
            console.log("==> ✅ Auth Success! Redirecting to:", redirectUrl);
            
            // Chốt hạ: Vút về trang chủ
            res.redirect(redirectUrl);

        } catch (error) {
            console.error("❌ Lỗi Redirect sau Google Login:", error);
            // Link fail cũng phải linh động môi trường
            const fallbackUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, "");
            res.redirect(`${fallbackUrl}/login?error=auth_failed`);
        }
    }
);

export default router;