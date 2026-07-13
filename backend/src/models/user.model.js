const pool = require("../config/db");

const UserModel = {
  getAllUsers: async () => {
    const result = await pool.query(
      "SELECT id, full_name, email, role, created_at FROM users ORDER BY id"
    );
    return result.rows;
  },
};

module.exports = UserModel;
