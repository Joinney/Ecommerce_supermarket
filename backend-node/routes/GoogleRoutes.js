import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Cổng 1: Kích hoạt chọn tài khoản Google
// THÊM: prompt: 'select_account' để luôn hiện bảng chọn tài khoản
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

            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            
            // 3. Redirect thẳng về TRANG CHỦ kèm data
            const redirectUrl = `${frontendUrl}/?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
            
            console.log("==> ✅ Google Auth Success! Đã ép hiện bảng chọn tài khoản.");
            res.redirect(redirectUrl);

        } catch (error) {
            console.error("❌ Lỗi Redirect sau Google Login:", error);
            res.redirect('http://localhost:5173/login?error=auth_failed');
        }
    }
);

export default router;