import express from 'express';
import jwt from 'jsonwebtoken'; // Bổ sung import jwt
import pool from '../../configs/database.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * MIDDLEWARE XÁC THỰC TOKEN
 * Được sửa để hoạt động độc lập trên Backend
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Không tìm thấy Token xác thực!" });
    }

    // Sử dụng Secret Key từ .env
    const secretKey = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn!" });
        }
        // Map thông tin user từ token vào req.user
        req.user = { id: decoded.id || decoded.sub || decoded.user_id };
        next();
    });
};

// --- 1. LẤY DANH SÁCH ĐỊA CHỈ ---
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT * FROM user_addresses 
            WHERE user_id = $1 
            ORDER BY is_default DESC, created_at DESC`;
        const result = await pool.query(query, [userId]);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Error fetching addresses:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server khi lấy danh sách địa chỉ" });
    }
});

// --- 2. THÊM ĐỊA CHỈ MỚI ---
router.post('/', verifyToken, async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const { 
            receiver_name, receiver_phone, province_id, province_name, 
            district_id, district_name, ward_code, ward_name, 
            detail_address, is_default, address_type 
        } = req.body;

        await client.query('BEGIN');

        // Nếu đặt làm mặc định, hủy tất cả mặc định cũ của user này
        if (is_default) {
            await client.query('UPDATE user_addresses SET is_default = false WHERE user_id = $1', [userId]);
        }

        const insertQuery = `
            INSERT INTO user_addresses 
            (user_id, receiver_name, receiver_phone, province_id, province_name, 
             district_id, district_name, ward_code, ward_name, detail_address, is_default, address_type)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`;
        
        const result = await client.query(insertQuery, [
            userId, receiver_name, receiver_phone, province_id, province_name,
            district_id, district_name, ward_code, ward_name, detail_address, is_default, address_type
        ]);

        await client.query('COMMIT');
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error adding address:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server khi thêm địa chỉ" });
    } finally {
        client.release();
    }
});

// --- 3. CẬP NHẬT ĐỊA CHỈ ---
router.put('/:id', verifyToken, async (req, res) => {
    const client = await pool.connect();
    try {
        const addressId = req.params.id;
        const userId = req.user.id;
        const { 
            receiver_name, receiver_phone, province_id, province_name, 
            district_id, district_name, ward_code, ward_name, 
            detail_address, is_default, address_type 
        } = req.body;

        await client.query('BEGIN');

        if (is_default) {
            await client.query('UPDATE user_addresses SET is_default = false WHERE user_id = $1', [userId]);
        }

        const updateQuery = `
            UPDATE user_addresses 
            SET receiver_name = $1, receiver_phone = $2, province_id = $3, province_name = $4, 
                district_id = $5, district_name = $6, ward_code = $7, ward_name = $8, 
                detail_address = $9, is_default = $10, address_type = $11, created_at = NOW()
            WHERE address_id = $12 AND user_id = $13
            RETURNING *`;
        
        const result = await client.query(updateQuery, [
            receiver_name, receiver_phone, province_id, province_name,
            district_id, district_name, ward_code, ward_name, detail_address, 
            is_default, address_type, address_id, userId
        ]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, message: "Không tìm thấy địa chỉ của bạn!" });
        }

        await client.query('COMMIT');
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error updating address:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server khi cập nhật địa chỉ" });
    } finally {
        client.release();
    }
});

// --- 4. XÓA ĐỊA CHỈ ---
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const addressId = req.params.id;
        const userId = req.user.id;

        const result = await pool.query(
            'DELETE FROM user_addresses WHERE address_id = $1 AND user_id = $2 RETURNING is_default', 
            [addressId, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy địa chỉ!" });
        }

        // Nếu vừa xóa địa chỉ mặc định, set địa chỉ khác (nếu có) làm mặc định
        if (result.rows[0].is_default) {
            await pool.query(`
                UPDATE user_addresses 
                SET is_default = true 
                WHERE address_id = (SELECT address_id FROM user_addresses WHERE user_id = $1 LIMIT 1)
            `, [userId]);
        }

        res.json({ success: true, message: "Đã xóa địa chỉ thành công!" });
    } catch (error) {
        console.error("Error deleting address:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server khi xóa địa chỉ" });
    }
});

export default router;