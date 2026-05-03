import pool from '../../configs/database.js';

// 1. Lấy tất cả sản phẩm (Phục vụ Render Link ở Trang Home)
export const getAllProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 12; 
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                sp.*, 
                dm.ten_danh_muc,
                dm.duong_dan_seo AS slug_danh_muc,
                LOWER(vm.ma_quoc_gia) AS country_code, -- vn, jp, kr...
                COALESCE((SELECT json_agg(bt) FROM bien_the_san_pham bt WHERE bt.ma_san_pham = sp.ma_san_pham), '[]') as bien_the,
                COALESCE((SELECT json_agg(m) FROM media_san_pham m WHERE m.ma_san_pham = sp.ma_san_pham), '[]') as media
            FROM san_pham sp
            LEFT JOIN danh_muc dm ON sp.ma_danh_muc = dm.ma_danh_muc
            LEFT JOIN vung_mien vm ON sp.ma_vung = vm.ma_vung
            WHERE sp.trang_thai = true
            ORDER BY sp.ngay_tao DESC
            LIMIT $1 OFFSET $2;
        `;
        
        const result = await pool.query(query, [limit, offset]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Lỗi API getAllProducts:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// 2. Lấy chi tiết 1 sản phẩm
export const getProductById = async (req, res) => {
    const { id } = req.params; 
    try {
        const query = `
            SELECT 
                sp.*, 
                dm.ten_danh_muc,
                dm.duong_dan_seo AS slug_danh_muc,
                LOWER(vm.ma_quoc_gia) AS country_code,
                COALESCE((SELECT json_agg(bt) FROM bien_the_san_pham bt WHERE bt.ma_san_pham = sp.ma_san_pham), '[]') as bien_the,
                COALESCE((SELECT json_agg(m) FROM media_san_pham m WHERE m.ma_san_pham = sp.ma_san_pham), '[]') as media
            FROM san_pham sp
            LEFT JOIN danh_muc dm ON sp.ma_danh_muc = dm.ma_danh_muc
            LEFT JOIN vung_mien vm ON sp.ma_vung = vm.ma_vung
            WHERE sp.ma_san_pham = $1;
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại Demi ơi!" });
        }

        res.status(200).json(result.rows[0]); 
    } catch (error) {
        console.error("Lỗi API getProductById:", error.message);
        res.status(500).json({ error: error.message });
    }
};