import pool from '../../configs/database.js';

// 1. Lấy tất cả sản phẩm (Dùng cho trang Home) - Đã thêm phân trang để nhanh hơn
export const getAllProducts = async (req, res) => {
    try {
        // Lấy tham số phân trang từ URL, ví dụ: ?limit=12&page=1
        const limit = parseInt(req.query.limit) || 12; 
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                sp.*, 
                dm.ten_danh_muc,
                COALESCE((SELECT json_agg(bt) FROM bien_the_san_pham bt WHERE bt.ma_san_pham = sp.ma_san_pham), '[]') as bien_the,
                COALESCE((SELECT json_agg(m) FROM media_san_pham m WHERE m.ma_san_pham = sp.ma_san_pham), '[]') as media
            FROM san_pham sp
            LEFT JOIN danh_muc dm ON sp.ma_danh_muc = dm.ma_danh_muc
            WHERE sp.trang_thai = true
            ORDER BY sp.ngay_tao DESC
            LIMIT $1 OFFSET $2; -- Sử dụng tham số để PostgreSQL tối ưu hóa kế hoạch truy vấn
        `;
        
        const result = await pool.query(query, [limit, offset]);
        res.status(200).json(result.rows);
    } catch (error) {
        // Ghi log chi tiết ra console của Render để kiểm tra nếu có lỗi 500
        console.error("Lỗi API getAllProducts:", error.message);
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

        res.status(200).json(result.rows[0]); 
    } catch (error) {
        console.error("Lỗi API getProductById:", error.message);
        res.status(500).json({ error: error.message });
    }
};