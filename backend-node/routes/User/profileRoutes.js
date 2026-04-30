import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../../configs/database.js';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const router = express.Router();

/**
 * 1. CẤU HÌNH MULTER - TỐI ƯU HÓA
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'public/uploads/';
        // Tự động tạo thư mục nếu chưa tồn tại để tránh lỗi crash server
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Đặt tên file: profile-[timestamp]-[random].png
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Bộ lọc file: Chỉ cho phép up ảnh
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ được phép tải lên tệp hình ảnh!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // Giới hạn 2MB cho nhẹ database
});

/**
 * 2. MIDDLEWARE XÁC THỰC TOKEN
 */
/**
 * 2. MIDDLEWARE XÁC THỰC TOKEN (BẢN SỬA LỖI INVALID SIGNATURE)
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Không tìm thấy Token!" });
    }

    // THỬ TẤT CẢ CÁC KEY CÓ THỂ CÓ TRONG .ENV ĐỂ TRANH LỆCH PHA
    const keysToTry = [
        process.env.JWT_ACCESS_SECRET,
        process.env.JWT_SECRET,
        "your_fallback_secret_if_any" // Key mặc định nếu cần
    ].filter(Boolean); // Loại bỏ các biến undefined

    let decodedToken = null;
    let verifyError = null;

    // Lặp qua từng key để verify
    for (const key of keysToTry) {
        try {
            decodedToken = jwt.verify(token, key);
            if (decodedToken) break; // Nếu verify thành công thì thoát vòng lặp
        } catch (err) {
            verifyError = err;
        }
    }

    if (!decodedToken) {
        console.error("❌ JWT Verify Failed. Error:", verifyError?.message);
        return res.status(403).json({ 
            success: false, 
            message: "Token không hợp lệ hoặc sai chữ ký (Invalid Signature)!" 
        });
    }

    // Map dữ liệu linh hoạt (Google dùng 'sub', DB dùng 'id')
    req.user = { 
        id: decodedToken.id || decodedToken.sub || decodedToken.user_id 
    };
    
    next();
};
/**
 * [GET] /api/profile/hoso
 */
router.get('/hoso', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; 
        const query = `
            SELECT user_id, username, full_name, email, phone_number, gender, birthday, avatar_url, role, address 
            FROM users 
            WHERE user_id = $1
        `;
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng!" });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error("Lỗi GET Profile:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
});

/**
 * [POST] /api/profile/upload-avatar
 */
router.post('/upload-avatar', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Không có file nào được tải lên!" });
        }

        const userId = req.user.id;
        // Lưu đường dẫn dạng /uploads/filename để frontend dễ gọi
        const avatarUrl = `/uploads/${req.file.filename}`; 

        // Cập nhật Database pgAdmin4
        const updateSql = `UPDATE users SET avatar_url = $1 WHERE user_id = $2 RETURNING avatar_url`;
        const result = await pool.query(updateSql, [avatarUrl, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Cập nhật Database thất bại!" });
        }

        res.json({
            success: true,
            message: "Tải ảnh lên thành công!",
            avatarUrl: avatarUrl 
        });
    } catch (error) {
        console.error("Lỗi Upload:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server khi upload ảnh" });
    }
});

/**
 * [PUT] /api/profile/hoso
 */
router.put('/hoso', verifyToken, async (req, res) => {
    try {
        // 1. Lấy thêm 'email' từ body gửi lên
        const { full_name, gender, birthday, phone_number, avatar_url, address, email } = req.body;
        const userId = req.user.id;

        // 2. Cập nhật câu lệnh SQL: Thêm email = $7 và dịch chuyển userId xuống $8
        const updateQuery = `
            UPDATE users 
            SET full_name = $1, 
                gender = $2, 
                birthday = $3, 
                phone_number = $4, 
                avatar_url = $5, 
                address = $6, 
                email = $7, 
                updated_at = NOW()
            WHERE user_id = $8
            RETURNING user_id, username, full_name, email, phone_number, gender, birthday, avatar_url, address;
        `;

        // 3. Truyền giá trị email vào mảng values
        const values = [full_name, gender, birthday, phone_number, avatar_url, address, email, userId];
        const result = await pool.query(updateQuery, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng để cập nhật!" });
        }

        res.status(200).json({
            success: true,
            message: "Cập nhật thông tin thành công!",
            data: result.rows[0]
        });
    } catch (error) {
        // Xử lý lỗi trùng lặp email (nếu email mới đã có người khác dùng)
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: "Email này đã được sử dụng bởi tài khoản khác!" });
        }
        console.error("Lỗi Update Profile:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server khi cập nhật hồ sơ" });
    }
});

export default router;