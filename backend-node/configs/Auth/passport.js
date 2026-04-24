import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from '../database.js';

// Cấu hình Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Sửa link mặc định có dấu / ở cuối để khớp với Log của Render
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback/",
    proxy: true 
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const displayName = profile.displayName;
        const avatar = profile.photos[0]?.value || null;

        // 1. Tìm user theo email
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user = userResult.rows[0];
        
        if (!user) {
            // 2. FIX QUAN TRỌNG: Đổi 'username' thành 'full_name' để khớp với Database của Demi
            console.log("==> [Google Auth] Tạo mới user:", email);
            const newUser = await pool.query(
                'INSERT INTO users (email, full_name, avatar_url, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [email, displayName, avatar, 'Buyer', 'active']
            );
            user = newUser.rows[0];
        }

        // 3. Kiểm tra trạng thái tài khoản
        if (user.status !== 'active') {
            console.warn(`⚠️ [Google Auth] Chặn đăng nhập: ${email} (status: ${user.status})`);
            return done(null, false, { message: 'Tài khoản của bạn đã bị khóa.' });
        }

        // 4. Cập nhật ngày đăng nhập gần nhất (Dùng đúng cột last_login trong ảnh DB của Demi)
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1',
            [user.user_id]
        );

        console.log(`==> ✅ [Google Auth] Chào mừng ${user.full_name} (${email})`);
        return done(null, user);

    } catch (err) {
        console.error('❌ Lỗi 500 tại Passport Strategy:', err.message);
        return done(err, null);
    }
}));

/**
 * XỬ LÝ SESSION
 */
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        done(null, result.rows[0] || false);
    } catch (err) {
        console.error("❌ Lỗi DeserializeUser:", err);
        done(err, null);
    }
});

export default passport;