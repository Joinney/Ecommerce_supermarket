import express from 'express';
import cookieParser from 'cookie-parser'; // 1. Thêm thư viện quản lý Cookie
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = 5000;

// 2. CẤU HÌNH MIDDLEWARE
app.use(express.json()); 
app.use(cookieParser()); // 2. Kích hoạt Cookie Parser (Phải nằm trên Routes)

// 3. ĐĂNG KÝ ROUTES
app.use('/api/auth', authRoutes);

// Route kiểm tra database của Demi
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