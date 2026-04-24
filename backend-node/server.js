import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import os from 'os';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'; // Nhớ nạp biến môi trường ngay từ đầu

// Nạp config .env
dotenv.config();

// Import cấu hình & routes
import './configs/Auth/passport.js'; 
import authRoutes from "./routes/Auth/authRoutes.js"; 
import forgotRoutes from "./routes/Auth/ForgotRoutes.js";
import googleRoutes from './routes/GoogleRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000; 

// 1. CẤU HÌNH CORS (Bản fix mạnh tay cho Demi)
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Nên chỉ định rõ để an toàn
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// 2. MIDDLEWARE CƠ BẢN
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Thêm cái này để xử lý form data
app.use(cookieParser()); 

// 3. CẤU HÌNH SESSION (Cực kỳ quan trọng để Google Auth hoạt động)
// Khi chạy trên Render hoặc có Proxy, phải set proxy: true
app.set('trust proxy', 1); 

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false, // Để false để tránh tạo session trống liên tục
    proxy: true, // Cho phép session đi qua proxy (Render/Cloudflare)
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Cần thiết cho Cross-site redirect
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

// 4. KHỞI TẠO PASSPORT (Phải nằm SAU session)
app.use(passport.initialize());
app.use(passport.session());

// 5. LOGGING ĐỂ DEBUG
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} -> ${req.url}`);
    next();
});

// 6. PHỤC VỤ FILE TĨNH (PUBLIC)
app.use(express.static(path.join(__dirname, 'public')));

// 7. CÁC ROUTE API
app.use('/api/auth', authRoutes);
app.use('/api/auth', forgotRoutes);
app.use('/api/auth', googleRoutes);

// 8. XỬ LÝ SPA & 404 API
app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ message: "API endpoint không tồn tại!" });
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 9. KHỞI CHẠY SERVER
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