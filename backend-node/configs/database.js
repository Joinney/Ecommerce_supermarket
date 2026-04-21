import pg from 'pg';
import dotenv from 'dotenv';

// Cấu hình để đọc được các biến từ file .env
dotenv.config();

const { Pool } = pg;

// Tạo một "hồ chứa" kết nối (Pool) để tối ưu hiệu suất
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'supermarket_db',
  password: process.env.DB_PASSWORD || '123456', // Thay bằng mật khẩu Postgres của bạn
  port: process.env.DB_PORT || 5432,
});

// Kiểm tra kết nối khi khởi động
pool.on('connect', () => {
  console.log(' Đã kết nối thành công tới PostgreSQL!');
});

pool.on('error', (err) => {
  console.error(' Lỗi kết nối PostgreSQL:', err);
  process.exit(-1);
});

export default pool;