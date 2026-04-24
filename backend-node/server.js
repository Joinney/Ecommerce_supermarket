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
// Sửa lại danh sách cho phép (Thêm cả link có dấu / và không có dấu / cho chắc)
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://ecommerce-supermarke-fe.onrender.com',
    'https://ecommerce-supermarke-fe.onrender.com/' // Thêm bản có dấu xẹt cuối
];

app.use(cors({
    origin: function (origin, callback) {
        // Nếu không có origin (như Postman hoặc khi server tự gọi mình) thì cho qua
        if (!origin) return callback(null, true);
        
        // Kiểm tra xem origin có nằm trong danh sách không
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Log ra để Demi biết chính xác cái link đang bị chặn là gì
            console.log("CORS bị chặn từ origin:", origin);
            callback(new Error('CORS policy không cho phép truy cập từ origin này!'));
        }
    },
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

// 3. Phục vụ các file tĩnh
app.use(express.static(path.join(__dirname, 'public')));

// 4. CÁC ROUTE API
app.use('/api/auth', authRoutes);

// 5. XỬ LÝ SPA (CÁCH MỚI KHÔNG BỊ LỖI PATH-TO-REGEXP)
app.use((req, res, next) => {
    // Nếu là yêu cầu API thì cho đi tiếp đến các route API hoặc báo 404 API
    if (req.url.startsWith('/api')) {
        return next();
    }
    // Tất cả các trường hợp khác (giao diện web), gửi file index.html
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