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
// 1. CẤU HÌNH CORS
const allowedOrigins = [
    'http://localhost:5173',
    'https://ecommerce-supermarke-fe.onrender.com',
    'https://ecommerce-supermarke-fe.onrender.com/' // Thêm cả bản có gạch chéo
];

app.use(cors({
    origin: (origin, callback) => {
        // Cho phép các request không có origin (như Postman hoặc thiết bị di động)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // DÒNG NÀY CỰC QUAN TRỌNG: Nó sẽ in ra link đang bị lỗi trong Logs Render
            console.error(`=> CORS chặn Origin: "${origin}"`); 
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