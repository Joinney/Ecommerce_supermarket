import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from '../database.js';

// Cấu hình Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const displayName = profile.displayName;
        const avatar = profile.photos[0]?.value || null;

        // 1. Tìm user theo email
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userResult.rows.length > 0) {
            console.log("==> [Google Auth] Đăng nhập user cũ:", email);
            return done(null, userResult.rows[0]);
        }
        
        // 2. Nếu chưa có -> Tạo mới 
        // Lưu ý: Demi kiểm tra cột 'username' hay 'full_name' trong DB để sửa cho khớp nhé
        console.log("==> [Google Auth] Tạo mới user:", email);
        const newUser = await pool.query(
            'INSERT INTO users (email, username, avatar_url, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [email, displayName, avatar, 'Buyer', 'active']
        );
        
        return done(null, newUser.rows[0]);
    } catch (err) {
        console.error('❌ Lỗi tại Google Strategy:', err.message);
        return done(err, null);
    }
}));

/**
 * PHẦN XỬ LÝ SESSION - ĐÃ FIX THEO CỘT user_id
 */

// 1. Serialize: Lưu user_id vào session
passport.serializeUser((user, done) => {
    // Lấy chính xác cột user_id từ object Demi vừa gửi
    const idToStore = user.user_id; 

    if (!idToStore) {
        console.error("❌ LỖI: Object User không có user_id!", user);
        return done(new Error("Failed to serialize: user_id not found"), null);
    }

    console.log("==> ✅ Đã serialize thành công user_id:", idToStore);
    done(null, idToStore);
});

// 2. Deserialize: Tìm user dựa trên user_id từ session
passport.deserializeUser(async (id, done) => {
    try {
        // Demi đảm bảo dùng đúng cột user_id trong câu lệnh WHERE
        const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        
        if (result.rows.length === 0) {
            return done(null, false);
        }
        
        done(null, result.rows[0]);
    } catch (err) {
        console.error("❌ Lỗi DeserializeUser:", err);
        done(err, null);
    }
});

export default passport;