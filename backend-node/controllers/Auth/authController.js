import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../configs/database.js';

// --- ĐĂNG KÝ (SIGNUP) ---
export const signup = async (req, res) => {
    // BƯỚC 1: KIỂM TRA DỮ LIỆU ĐẦU VÀO
    // Demi hãy nhìn vào màn hình Terminal (CMD) xem nó có hiện đủ các trường không
    console.log("--- 1. Dữ liệu từ Postman/React gửi tới: ---", req.body);

    const { 
        username, password, email, full_name, 
        phone,       // Hứng 'phone' từ Postman
        gender,      // Hứng 'gender' từ Postman
        birth_date,  // Hứng 'birth_date' từ Postman
        address 
    } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // BƯỚC 2: CÂU LỆNH SQL (PHẢI KHỚP VỚI HÌNH ẢNH DB CỦA DEMI)
        // Cột trong DB: phone_number, address, gender, birthday
        const query = `
            INSERT INTO users (
                username, 
                password_hash, 
                email, 
                full_name, 
                phone_number, 
                address, 
                gender, 
                birthday, 
                role, 
                status
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Buyer', 'active') 
            RETURNING *;
        `;
        
        // BƯỚC 3: MẢNG VALUES (KIỂM TRA CỰC KỲ KỸ THỨ TỰ)
        const values = [
            username,      // $1
            passwordHash,  // $2
            email,         // $3
            full_name,     // $4
            phone,         // $5 -> map vào phone_number
            address,       // $6 -> map vào address
            gender,        // $7 -> map vào gender
            birth_date     // $8 -> map vào birthday
        ];

        console.log("--- 2. Mảng values chuẩn bị gửi vào DB: ---", values);

        const result = await pool.query(query, values);
        
        console.log("--- 3. Dữ liệu thực tế DB trả về sau khi lưu: ---", result.rows[0]);

        res.status(201).json({ 
            message: "Đăng ký thành công!", 
            user: result.rows[0] 
        });

    } catch (error) {
        console.error("❌ LỖI TẠI TERMINAL:", error.message);
        res.status(500).json({ error: error.message });
    }
};
// --- ĐĂNG NHẬP (SIGNIN) ---
export const signin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0) return res.status(404).json({ message: "User không tồn tại!" });

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: "Mật khẩu sai rồi Demi ơi!" });

        const accessToken = jwt.sign(
            { id: user.user_id, role: user.role },
            process.env.JWT_ACCESS_SECRET || 'access_secret_demi', 
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user.user_id },
            process.env.JWT_REFRESH_SECRET || 'refresh_secret_demi', 
            { expiresIn: '7d' }
        );

        await pool.query('UPDATE users SET refresh_token = $1, last_login = NOW() WHERE user_id = $2', [refreshToken, user.user_id]);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,  
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        // --- ĐOẠN SỬA QUAN TRỌNG NHẤT ---
        res.json({ 
            message: "Đăng nhập thành công!", 
            token: accessToken, // Đổi tên thành 'token' để khớp với AuthContext trên Mobile
            user: { 
                id: user.user_id,
                username: user.username, 
                email: user.email, // Thêm email để hiển thị ở Profile
                role: user.role, 
                full_name: user.full_name 
            } 
        });
        // ------------------------------
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- ĐĂNG XUẤT (LOGOUT) ---
export const logout = async (req, res) => {
    try {
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Đã đăng xuất thành công. Hẹn gặp lại Demi!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};