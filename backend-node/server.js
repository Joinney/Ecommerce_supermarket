import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000; 

// 1. CẤU HÌNH CORS
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

app.use(express.json()); 
app.use(cookieParser()); 

// 2. LOGGING
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} -> ${req.url}`);
    next();
});

// --- TÍCH HỢP FRONTEND ---

// 3. Phục vụ các file tĩnh (css, js, img) từ thư mục public
// (Thư mục này chứa nội dung của folder 'dist' sau khi Demi build React)
app.use(express.static(path.join(__dirname, 'public')));

// 4. CÁC ROUTE API (Phải đặt TRƯỚC route '*')
app.use('/api/auth', authRoutes);

// 5. XỬ LÝ SINGLE PAGE APPLICATION (SPA)
// Chế độ này giúp React Router hoạt động mượt mà ngay cả khi nhấn F5
app.get('*', (req, res) => {
    // Nếu yêu cầu bắt đầu bằng /api mà không khớp cái nào ở trên thì báo lỗi JSON
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ message: "API endpoint not found" });
    }
    // Còn lại, gửi file index.html của React về cho trình duyệt
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- KẾT THÚC FRONTEND ---

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server đang rực rỡ tại port: ${PORT}`);
    if (process.env.NODE_ENV !== 'production') {
        const ip = getLocalIp();
        console.log(`📱 Local IP: http://${ip}:${PORT}`);
    }
});

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) return iface.address;
        }
    }
    return 'localhost';
}