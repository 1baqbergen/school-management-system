const pool = require("../config/db");

const TeacherModel = {
  createTeacher: async (user_id) => {
    const result = await pool.query(
      `INSERT INTO teachers (user_id)
       VALUES ($1)
       RETURNING *`,
      [user_id]
    );
    return result.rows[0];
  },

  // ✅ Тізім шығару (select үшін)
  getAllTeachers: async () => {
  const result = await pool.query(`
    SELECT
      t.id,
      u.full_name,
      u.email,
      u.is_active,
      t.hire_date,
      t.created_at
    FROM teachers t
    JOIN users u ON t.user_id = u.id
    ORDER BY u.full_name
  `);

  return result.rows;
},
};

module.exports = TeacherModel;