import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Lấy token từ header "Authorization"
    const authHeader = req.headers.token;
    
    if (authHeader) {
        // Token thường có dạng "Bearer abcxyz...", mình lấy phần sau chữ Bearer
        const token = authHeader.split(" ")[1];
        
        jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access_secret_demi', (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Token đã hết hạn hoặc không hợp lệ rồi Demi!" });
            }
            // Nếu ok, lưu thông tin user vào request để các hàm sau sử dụng
            req.user = user;
            next(); // Cho phép đi tiếp vào API
        });
    } else {
        return res.status(401).json({ message: "Bạn chưa đăng nhập, vui lòng đăng nhập để thanh toán nhé!" });
    }
};