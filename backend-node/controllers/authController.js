import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../configs/database.js';

// --- ĐĂNG KÝ (SIGNUP) ---
export const signup = async (req, res) => {
    const { username, password, email, full_name, phone_number, address } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const query = `
            INSERT INTO users (username, password_hash, email, full_name, phone_number, address, role, status) 
            VALUES ($1, $2, $3, $4, $5, $6, 'Buyer', 'active') 
            RETURNING user_id, username, email, full_name;
        `;
        
        const values = [username, passwordHash, email, full_name, phone_number, address];
        const newUser = await pool.query(query, values);

        res.status(201).json({ message: "Đăng ký thành công!", user: newUser.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Lỗi đăng ký: " + error.message });
    }
};

// --- ĐĂNG NHẬP (SIGNIN) ---
export const signin = async (req, res) => {
    const { username, password } = req.body;
    try {
        // 1. Lấy dữ liệu user từ DB
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0) return res.status(404).json({ message: "User không tồn tại!" });

        const user = userResult.rows[0];

        // 2. So sánh mật khẩu (hashedPassword trong db vs password input)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: "Mật khẩu sai rồi Demi ơi!" });

        // 3. Nếu khớp, tạo Access Token với JWT (thời gian ngắn - ví dụ 15 phút)
        const accessToken = jwt.sign(
            { id: user.user_id, role: user.role },
            process.env.JWT_ACCESS_SECRET || 'access_secret_demi', 
            { expiresIn: '15m' }
        );

        // 4. Tạo Refresh Token (thời gian dài - ví dụ 7 ngày)
        const refreshToken = jwt.sign(
            { id: user.user_id },
            process.env.JWT_REFRESH_SECRET || 'refresh_secret_demi', 
            { expiresIn: '7d' }
        );

        // 5. Cập nhật DB lưu Refresh Token (Tạo session mới)
        await pool.query('UPDATE users SET refresh_token = $1, last_login = NOW() WHERE user_id = $2', [refreshToken, user.user_id]);

        // 6. Trả Refresh Token về trong Cookie (HttpOnly để chống hack)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Frontend không đọc được bằng JS, rất an toàn
            secure: false,  // Đổi thành true khi Demi deploy lên web thật (HTTPS)
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });

        // 7. Trả Access Token về trong Response body
        res.json({ 
            message: "Đăng nhập thành công!", 
            accessToken, 
            user: { 
                id: user.user_id,
                username: user.username, 
                role: user.role, 
                full_name: user.full_name 
            } 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- ĐĂNG XUẤT (LOGOUT) ---
export const logout = async (req, res) => {
    try {
        // 1. Xóa cookie refreshToken ở trình duyệt
        res.clearCookie("refreshToken");
        
        // 2. (Tùy chọn) Xóa refresh_token trong DB để vô hiệu hóa hoàn toàn session này
        // Nếu Demi có lưu user_id trong session/body thì dùng, không thì chỉ cần xóa cookie là đủ cho bản demo
        
        res.status(200).json({ message: "Đã đăng xuất thành công. Hẹn gặp lại Demi!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};