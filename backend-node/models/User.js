import pool from '../configs/database.js';

class User {
  // Hàm lấy tất cả người dùng từ Database
  static async getAll() {
    const result = await pool.query('SELECT user_id, username, full_name, role FROM users');
    return result.rows;
  }

  // Hàm tìm người dùng theo username (để sau này làm Login)
  static async findByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }
}

export default User;