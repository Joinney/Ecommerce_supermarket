import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // 1. Thêm dòng này
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = 5000;

// 2. CẤU HÌNH MIDDLEWARE
// Chú ý: Cấu hình CORS phải nằm TRÊN các Routes
app.use(cors({
    origin: 'http://localhost:5173', // Cho phép Frontend của Demi truy cập
    credentials: true,               // Cho phép gửi Cookie và Header Token
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'] // Cho phép các Header này
}));

app.use(express.json()); 
app.use(cookieParser()); 

// 3. ĐĂNG KÝ ROUTES
app.use('/api/auth', authRoutes);

// Route kiểm tra database
app.get('/test-db', async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({
      message: "Kết nối thành công rồi Demi ơi!",
      data: users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});