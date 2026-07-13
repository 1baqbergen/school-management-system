
// C:\school-system\backend\src\models\class.model.js
const pool = require("../config/db");

const ClassModel = {
  createClass: async (name, grade, letter, class_teacher_id = null) => {
    const result = await pool.query(
      `INSERT INTO classes (name, grade, letter, class_teacher_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, grade, letter, class_teacher_id]
    );
    return result.rows[0];
  },

  getAllClasses: async () => {
    const result = await pool.query(`
      SELECT 
        c.*,
        u.full_name AS class_teacher,
        COUNT(s.id) AS students_count
      FROM classes c
      LEFT JOIN teachers t ON c.class_teacher_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN students s ON s.class_id = c.id
      GROUP BY c.id, u.full_name
      ORDER BY c.grade, c.letter
    `);

    return result.rows;
  },

  // 🔥 Мұғалім ID бойынша сыныпты алу
  getClassByTeacherId: async (teacherUserId) => {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.grade,
        c.letter,
        c.class_teacher_id,
        u.full_name AS class_teacher,
        COUNT(s.id) AS students_count
      FROM classes c
      JOIN teachers t ON c.class_teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      LEFT JOIN students s ON s.class_id = c.id
      WHERE t.user_id = $1
      GROUP BY c.id, u.full_name
    `, [teacherUserId]);

    return result.rows[0];
  },

  updateClass: async (id, grade, letter, class_teacher_id = null) => {
    const name = `${grade}${letter}`;

    const result = await pool.query(
      `UPDATE classes
       SET name = $1,
           grade = $2,
           letter = $3,
           class_teacher_id = $4
       WHERE id = $5
       RETURNING *`,
      [name, grade, letter, class_teacher_id, id]
    );

    return result.rows[0];
  },

  deleteClass: async (id) => {
    await pool.query(
      `DELETE FROM classes WHERE id = $1`,
      [id]
    );
  },

  getClassById: async (id) => {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.grade,
        c.letter,
        u.full_name AS class_teacher,
        COUNT(s.id) AS students_count
      FROM classes c
      LEFT JOIN teachers t ON c.class_teacher_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN students s ON s.class_id = c.id
      WHERE c.id = $1
      GROUP BY c.id, u.full_name
    `, [id]);

    return result.rows[0];
  }
};

module.exports = ClassModel;
