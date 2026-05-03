import pool from '../../configs/database.js';

// 1. Lấy danh sách sản phẩm (Đã tối ưu cho trang Home)
export const getAllProducts = async (req, res) => {
    try {
        // Phân trang: Mặc định lấy 12 sản phẩm mỗi lần gọi
        const limit = parseInt(req.query.limit) || 12;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                sp.ma_san_pham, 
                sp.ten_san_pham, 
                sp.gia_ban_le,
                dm.ten_danh_muc,
                -- Lấy 1 biến thể duy nhất để hiển thị giá/kho nhanh trên Card
                (
                    SELECT json_build_object(
                        'gia_khuyen_mai', bt.gia_khuyen_mai,
                        'gia_ban_le', bt.gia_ban_le,
                        'la_ban_chay', bt.la_ban_chay,
                        'so_luong_kho', bt.so_luong_kho
                    )
                    FROM bien_the_san_pham bt 
                    WHERE bt.ma_san_pham = sp.ma_san_pham 
                    LIMIT 1
                ) as bien_the_single,
                -- Lấy danh sách ảnh (chỉ lấy URL và trạng thái ảnh chính)
                COALESCE((
                    SELECT json_agg(json_build_object(
                        'duong_dan_url', m.duong_dan_url,
                        'la_anh_chinh', m.la_anh_chinh
                    )) 
                    FROM media_san_pham m 
                    WHERE m.ma_san_pham = sp.ma_san_pham
                ), '[]') as media
            FROM san_pham sp
            LEFT JOIN danh_muc dm ON sp.ma_danh_muc = dm.ma_danh_muc
            WHERE sp.trang_thai = true
            ORDER BY sp.ngay_tao DESC
            LIMIT $1 OFFSET $2;
        `;
        
        const result = await pool.query(query, [limit, offset]);

        // Format lại dữ liệu bien_the thành mảng để giữ nguyên logic Frontend cũ của bạn
        const formattedRows = result.rows.map(row => ({
            ...row,
            bien_the: row.bien_the_single ? [row.bien_the_single] : []
        }));
        
        res.status(200).json(formattedRows);
    } catch (error) {
        console.error("Lỗi getAllProducts:", error.message);
        res.status(500).json({ error: "Không thể tải danh sách sản phẩm" });
    }
};

// 2. Lấy chi tiết 1 sản phẩm (Giữ nguyên sp.* vì cần xem toàn bộ thông tin)
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
            return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
        }

        res.status(200).json(result.rows[0]); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};