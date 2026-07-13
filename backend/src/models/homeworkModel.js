const pool = require("../config/db");

const HomeworkModel = {
  // ✅ CREATE
  createHomework: async (title, description, class_id, subject_id, teacher_id, due_date) => {
    const result = await pool.query(
      `INSERT INTO homeworks 
       (title, description, class_id, subject_id, teacher_id, due_date)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [title, description, class_id, subject_id, teacher_id, due_date]
    );
    return result.rows[0];
  },

  // ✅ GET ALL (admin/director)
  getAllHomeworks: async () => {
    const result = await pool.query(`
      SELECT
        h.id,
        h.title,
        h.description,
        h.class_id,
        (c.grade::text || c.letter::text) AS class_name,
        h.subject_id,
        sub.name AS subject_name,
        h.teacher_id,
        u.full_name AS teacher_name,
        h.due_date,
        h.created_at
      FROM homeworks h
      JOIN classes c ON h.class_id = c.id
      JOIN subjects sub ON h.subject_id = sub.id
      JOIN teachers t ON h.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      ORDER BY h.created_at DESC
    `);

    return result.rows;
  },

  // ✅ TEACHER OWN
  getHomeworksByTeacher: async (teacher_id) => {
    const result = await pool.query(`
      SELECT
        h.id,
        h.title,
        h.description,
        (c.grade::text || c.letter::text) AS class_name,
        sub.name AS subject_name,
        h.due_date,
        h.created_at
      FROM homeworks h
      JOIN classes c ON h.class_id = c.id
      JOIN subjects sub ON h.subject_id = sub.id
      WHERE h.teacher_id = $1
      ORDER BY h.created_at DESC
    `, [teacher_id]);

    return result.rows;
  },

  // ✅ STUDENT (class бойынша)
  getHomeworksByClass: async (class_id) => {
    const result = await pool.query(`
      SELECT
        h.id,
        h.title,
        h.description,
        sub.name AS subject_name,
        h.due_date
      FROM homeworks h
      JOIN subjects sub ON h.subject_id = sub.id
      WHERE h.class_id = $1
      ORDER BY h.due_date ASC
    `, [class_id]);

    return result.rows;
  },

  getHomeworkById: async (id) => {
    const res = await pool.query(`SELECT * FROM homeworks WHERE id = $1`, [id]);
    return res.rows[0] || null;
  },

  deleteHomework: async (id) => {
    await pool.query(`DELETE FROM homeworks WHERE id = $1`, [id]);
    return true;
  }
};

module.exports = HomeworkModel;