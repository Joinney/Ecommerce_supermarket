import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// import User from './models/User.js'; // Kiểm tra lại nếu Render dùng DB online thì model này phải trỏ đúng link
import authRoutes from './routes/authRoutes.js';
import os from 'os';

const app = express();

// 1. CỔNG (PORT): Render sẽ cấp cổng ngẫu nhiên qua biến môi trường.
// Bạn phải dùng process.env.PORT, không được cố định số 5000.
const PORT = process.env.PORT || 5000; 

// 2. CẤU HÌNH CORS (Bảo mật hơn khi lên Production)
app.use(cors({
    origin: true, // Khi lên Render, 'true' vẫn ổn nhưng tốt nhất sau này là link Web của Demi
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

app.use(express.json()); 
app.use(cookieParser()); 

// 3. LOGGING (Giữ nguyên để debug trên Render Dashboard)
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} -> ${req.url}`);
    next();
});

// 4. ĐĂNG KÝ ROUTES
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("API DemiMart is Running... 🚀");
});

// 5. LẮNG NGHE KẾT NỐI
// Quan trọng: Phải lắng nghe trên '0.0.0.0' để Render có thể định tuyến
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server đang chạy trên port: ${PORT}`);
    if (process.env.NODE_ENV !== 'production') {
        const ip = getLocalIp();
        console.log(`📱 Local IP: http://${ip}:${PORT}`);
    }
});

// Hàm lấy IP chỉ có tác dụng khi chạy ở máy nhà
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) return iface.address;
        }
    }
    return 'localhost';
};
