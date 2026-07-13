const pool = require("../config/db");

const TeacherSubjectModel = {

  assignSubject: async (teacher_id, subject_id) => {
    const result = await pool.query(
      `INSERT INTO teacher_subjects (teacher_id, subject_id)
       VALUES ($1, $2)
       RETURNING *`,
      [teacher_id, subject_id]
    );
    return result.rows[0];
  },
  getSubjectsByTeacher: async (teacher_id) => {
  const result = await pool.query(`
    SELECT 
      ts.id,
      s.id AS subject_id,
      s.name AS subject_name
    FROM teacher_subjects ts
    JOIN subjects s ON ts.subject_id = s.id
    WHERE ts.teacher_id = $1
  `, [teacher_id]);

  return result.rows;
},

  getTeacherSubjects: async () => {
    const result = await pool.query(`
      SELECT 
        ts.id,
        t.id AS teacher_id,
        u.full_name AS teacher_name,
        s.id AS subject_id,
        s.name AS subject_name
      FROM teacher_subjects ts
      JOIN teachers t ON ts.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      JOIN subjects s ON ts.subject_id = s.id
      ORDER BY u.full_name
    `);

    return result.rows;
  },
  checkTeacherSubject: async (teacher_id, subject_id) => {
    const result = await pool.query(
      `SELECT * FROM teacher_subjects
       WHERE teacher_id = $1 AND subject_id = $2`,
      [teacher_id, subject_id]
    );

    return result.rows.length > 0;
  },
  deleteAssignment: async (id) => {
  await pool.query(
    `DELETE FROM teacher_subjects WHERE id = $1`,
    [id]
  );
},
};

module.exports = TeacherSubjectModel;
