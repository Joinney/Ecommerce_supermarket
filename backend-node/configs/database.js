import pg from 'pg';
import dotenv from 'dotenv';

// Đọc biến từ file .env (chỉ có tác dụng khi chạy ở máy local)
dotenv.config();

const { Pool } = pg;

/**
 * Cấu hình Pool thông minh:
 * - Nếu có DATABASE_URL: Dùng chuỗi kết nối duy nhất (Render/Neon).
 * - Nếu không có: Dùng các biến lẻ (máy Local).
 */
const pool = new Pool({
  // Ưu tiên dùng chuỗi kết nối dài (Connection String)
  connectionString: process.env.DATABASE_URL,

  // Thông số dự phòng cho máy Local (nếu DATABASE_URL không tồn tại)
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'supermarket_db',
  password: process.env.DB_PASSWORD || '123456',
  port: process.env.DB_PORT || 5432,

  // CỰC KỲ QUAN TRỌNG: Bật SSL khi chạy trên Render để kết nối được DB Online
  ssl: process.env.DATABASE_URL 
    ? { rejectUnauthorized: false } 
    : false
});

// Sự kiện khi kết nối thành công
pool.on('connect', () => {
  console.log('✅ [Database]: Đã kết nối thành công tới PostgreSQL!');
});

// Xử lý lỗi kết nối bất ngờ
pool.on('error', (err) => {
  console.error('❌ [Database]: Lỗi kết nối PostgreSQL bất ngờ:', err);
});

export default pool;