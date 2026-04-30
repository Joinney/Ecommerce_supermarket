import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../../configs/database.js';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt'; // Cần để so sánh mật khẩu hiện tại

dotenv.config();

const router = express.Router();

/**
 * 1. CẤU HÌNH MULTER - TỐI ƯU HÓA
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'public/uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

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
    limits: { fileSize: 2 * 1024 * 1024 } 
});

/**
 * 2. MIDDLEWARE XÁC THỰC TOKEN (BẢN SỬA LỖI INVALID SIGNATURE)
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Không tìm thấy Token!" });
    }

    const keysToTry = [
        process.env.JWT_ACCESS_SECRET,
        process.env.JWT_SECRET,
        "vdt_secret_2026" 
    ].filter(Boolean); 

    let decodedToken = null;
    let verifyError = null;

    for (const key of keysToTry) {
        try {
            decodedToken = jwt.verify(token, key);
            if (decodedToken) break; 
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
 * [POST] /api/profile/verify-password
 * MỚI: Dành cho bước 1 của Tab Bảo mật (Demi Mart)
 */
router.post('/verify-password', verifyToken, async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;

        const query = `SELECT password_hash FROM users WHERE user_id = $1`;
        const user = await pool.query(query, [userId]);

        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại!" });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
        
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Mật khẩu hiện tại không chính xác!" });
        }

        res.json({ success: true, message: "Xác thực thành công!" });
    } catch (error) {
        console.error("Lỗi Verify Password:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server khi xác thực" });
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
        const avatarUrl = `/uploads/${req.file.filename}`; 

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
        const { full_name, gender, birthday, phone_number, avatar_url, address, email } = req.body;
        const userId = req.user.id;

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

        const values = [full_name, gender, birthday, phone_number, avatar_url, address, email, userId];
        const result = await pool.query(updateQuery, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng!" });
        }

        res.status(200).json({
            success: true,
            message: "Cập nhật thành công!",
            data: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: "Email này đã được sử dụng!" });
        }
        console.error("Lỗi Update Profile:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
});

/**
 * [PUT] /api/profile/change-password
 * DÀNH RIÊNG CHO: Đổi mật khẩu trực tiếp từ trang Profile
 */
router.put('/change-password', verifyToken, async (req, res) => {
    try {
        const { newPassword } = req.body;
        const userId = req.user.id;

        // 1. Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 2. Cập nhật vào Database
        const query = `UPDATE users SET password_hash = $1 WHERE user_id = $2`;
        const result = await pool.query(query, [hashedPassword, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng!" });
        }

        res.json({ success: true, message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        console.error("Lỗi Change Password:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server khi đổi mật khẩu" });
    }
});

export default router;