import pool from '../../configs/database.js';

// 1. Lấy tất cả sản phẩm (Dùng cho trang Home)
export const getAllProducts = async (req, res) => {
    try {
        const query = `
            SELECT 
                sp.*, 
                dm.ten_danh_muc,
                -- Sử dụng COALESCE để đảm bảo trả về mảng rỗng [] thay vì null nếu không có dữ liệu
                COALESCE((SELECT json_agg(bt) FROM bien_the_san_pham bt WHERE bt.ma_san_pham = sp.ma_san_pham), '[]') as bien_the,
                COALESCE((SELECT json_agg(m) FROM media_san_pham m WHERE m.ma_san_pham = sp.ma_san_pham), '[]') as media
            FROM san_pham sp
            LEFT JOIN danh_muc dm ON sp.ma_danh_muc = dm.ma_danh_muc
            WHERE sp.trang_thai = true
            ORDER BY sp.ngay_tao DESC; -- Sắp xếp sản phẩm mới nhất lên đầu
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Lấy chi tiết 1 sản phẩm (Dùng cho trang ProductDetail) 🚀
export const getProductById = async (req, res) => {
    const { id } = req.params; 
    try {
        const query = `
            SELECT 
                sp.*, 
                dm.ten_danh_muc,
                COALESCE((SELECT json_agg(bt) FROM bien_the_san_pham bt WHERE bt.ma_san_pham = sp.ma_san_pham), '[]') as bien_the,
                COALESCE((SELECT json_agg(m) FROM media_san_pham m WHERE m.ma_san_pham = sp.ma_san_pham), '[]') as media
            FROM san_pham sp
            LEFT JOIN danh_muc dm ON sp.ma_danh_muc = dm.ma_danh_muc
            WHERE sp.ma_san_pham = $1;
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm này Demi ơi!" });
        }

        // Trả về đúng 1 Object duy nhất để khớp với logic ProductDetail.jsx
        res.status(200).json(result.rows[0]); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};