import pool from '../../configs/database.js';

// 1. Lấy danh sách sản phẩm (Tối ưu cho trang Home)
export const getAllProducts = async (req, res) => {
    try {
        // Tối ưu 1: Phân trang (Pagination) - Mặc định lấy 12 sản phẩm
        const limit = parseInt(req.query.limit) || 12;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        // Tối ưu 2: Chỉ SELECT những trường cần thiết để hiển thị Card (Selection)
        // Loại bỏ các trường nội dung dài như 'mo_ta' (description) để giảm dung lượng JSON
        const query = `
            SELECT 
                sp.ma_san_pham, 
                sp.ten_san_pham, 
                sp.gia_ban_le,
                dm.ten_danh_muc,
                -- Chỉ lấy thông tin tối giản của biến thể (ví dụ: giá khuyến mãi, trạng thái bán chạy)
                COALESCE((
                    SELECT json_agg(json_build_object(
                        'gia_khuyen_mai', bt.gia_khuyen_mai,
                        'gia_ban_le', bt.gia_ban_le,
                        'la_ban_chay', bt.la_ban_chay,
                        'so_luong_kho', bt.so_luong_kho
                    )) 
                    FROM bien_the_san_pham bt 
                    WHERE bt.ma_san_pham = sp.ma_san_pham 
                    LIMIT 1
                ), '[]') as bien_the,
                -- Chỉ lấy ảnh chính hoặc ảnh đầu tiên để hiển thị ở trang chủ
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
        
        // Trả về thêm thông tin meta để Frontend dễ xử lý phân trang
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Lỗi getAllProducts:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi tải sản phẩm" });
    }
};

// 2. Lấy chi tiết 1 sản phẩm (Dùng cho trang ProductDetail)
export const getProductById = async (req, res) => {
    const { id } = req.params; 
    try {
        // Tối ưu 3: Ở trang chi tiết mới dùng sp.* để lấy toàn bộ mô tả (description)
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
            return res.status(404).json({ message: "Không tìm thấy sản phẩm này!" });
        }

        res.status(200).json(result.rows[0]); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};