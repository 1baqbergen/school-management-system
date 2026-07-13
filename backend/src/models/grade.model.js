// backend/src/models/grade.model.js
const pool = require("../config/db");

const GradeModel = {
  createGrade: async (student_id, subject_id, teacher_id, grade_value, grade_date, comment) => {
    const result = await pool.query(
      `INSERT INTO grades (student_id, subject_id, teacher_id, grade_value, grade_date, comment)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [student_id, subject_id, teacher_id, grade_value, grade_date, comment]
    );
    return result.rows[0];
  },

  // ✅ Admin/Teacher list (JOIN)
  getAllGrades: async () => {
    const result = await pool.query(`
      SELECT
        g.id,
        g.student_id,
        u.full_name AS student_name,
        s.class_id,
        (c.grade::text || c.letter::text) AS class_name,
        g.subject_id,
        sub.name AS subject_name,
        g.teacher_id,
        tu.full_name AS teacher_name,
        g.grade_value,
        g.grade_date,
        g.comment
      FROM grades g
      JOIN students s ON g.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN classes c ON s.class_id = c.id
      JOIN subjects sub ON g.subject_id = sub.id
      JOIN teachers t ON g.teacher_id = t.id
      JOIN users tu ON t.user_id = tu.id
      ORDER BY g.grade_date DESC, g.id DESC
    `);
    return result.rows;
  },

  getGradesByStudent: async (student_id) => {
  const result = await pool.query(`
    SELECT
      g.id,
      g.student_id,
      g.subject_id,
      sub.name AS subject_name,
      g.teacher_id,
      tu.full_name AS teacher_name,
      g.grade_value,
      g.grade_date,
      g.comment
    FROM grades g
    JOIN subjects sub ON g.subject_id = sub.id
    JOIN teachers t ON g.teacher_id = t.id
    JOIN users tu ON t.user_id = tu.id
    WHERE g.student_id = $1
    ORDER BY g.grade_date DESC, g.id DESC
  `, [student_id]);

  return result.rows;
},

  getGradesByTeacher: async (teacher_id, limit) => {
  let query = `
    SELECT
      g.id,
      u.full_name AS student_name,
      sub.name AS subject_name,
      g.grade_value,
      g.grade_date,
      g.comment
    FROM grades g
    JOIN students s ON g.student_id = s.id
    JOIN users u ON s.user_id = u.id
    JOIN subjects sub ON g.subject_id = sub.id
    WHERE g.teacher_id = $1
    ORDER BY g.grade_date DESC
  `;

  const params = [teacher_id];

  if (limit) {
    query += ` LIMIT $2`;
    params.push(limit);
  }

  const result = await pool.query(query, params);
  return result.rows;
},

  // =========================
  // ✅ META helpers (NEW)
  // =========================

  // Студенттер тізімі (барлық teacher/admin үшін)
  getStudentsForMeta: async () => {
    const res = await pool.query(`
      SELECT
        s.id,
        u.full_name AS name,
        s.class_id,
        (c.grade::text || c.letter::text) AS class_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN classes c ON s.class_id = c.id
      ORDER BY c.grade ASC, c.letter ASC, u.full_name ASC
    `);
    return res.rows;
  },

  // Admin үшін teacher list
  getTeachersForMeta: async () => {
    const res = await pool.query(`
      SELECT
        t.id,
        u.full_name AS name
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      ORDER BY u.full_name ASC
    `);
    return res.rows;
  },

  // Барлық пәндер (admin үшін)
  getAllSubjectsForMeta: async () => {
    const res = await pool.query(`
      SELECT id, name
      FROM subjects
      ORDER BY name ASC
    `);
    return res.rows;
  },

  // ✅ Teacher-ге бекітілген пәндер ғана
  // Мұнда teacher_subjects (немесе сендегі linking table) бар деп есептеймін.
  // Егер сенің таблица атауы басқа болса — соны жаз.
  getSubjectsByTeacher: async (teacher_id) => {
    const res = await pool.query(`
      SELECT sub.id, sub.name
      FROM teacher_subjects ts
      JOIN subjects sub ON ts.subject_id = sub.id
      WHERE ts.teacher_id = $1
      ORDER BY sub.name ASC
    `, [teacher_id]);
    return res.rows;
  },

  getSubjectsByTeacherMeta: async (teacher_id) => {
    const subjects = await GradeModel.getSubjectsByTeacher(teacher_id);
    return { subjects };
  },

  // =========================

  getGradeById: async (id) => {
    const result = await pool.query(`SELECT * FROM grades WHERE id = $1`, [id]);
    return result.rows[0] || null;
  },

  updateGrade: async (id, grade_value, grade_date, comment) => {
    const result = await pool.query(
      `
      UPDATE grades
      SET grade_value = $2,
          grade_date  = $3,
          comment     = $4
      WHERE id = $1
      RETURNING *
      `,
      [id, grade_value, grade_date, comment]
    );
    return result.rows[0] || null;
  },

  deleteGrade: async (id) => {
    await pool.query(`DELETE FROM grades WHERE id = $1`, [id]);
    return true;
  },
};

module.exports = GradeModel;