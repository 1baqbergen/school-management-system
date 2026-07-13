// C:\school-system\backend\src\models\submissionModel.js
const pool = require("../config/db");

const SubmissionModel = {
  // ✅ SUBMIT
  submitHomework: async (homework_id, student_id, content, file_url) => {
    const result = await pool.query(
      `INSERT INTO homework_submissions
       (homework_id, student_id, content, file_url)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [homework_id, student_id, content, file_url]
    );
    return result.rows[0];
  },

  // ✅ TEACHER — submissions көру
  getSubmissionsByHomework: async (homework_id) => {
    const result = await pool.query(`
      SELECT
        hs.id,
        hs.homework_id,
        hs.content,
        hs.file_url,
        hs.grade,
        hs.comment,
        hs.submitted_at,
        u.full_name AS student_name
      FROM homework_submissions hs
      JOIN students s ON hs.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE hs.homework_id = $1
      ORDER BY hs.submitted_at DESC
    `, [homework_id]);
    return result.rows;
  },

  // ✅ STUDENT — өз submissions (homework_id қосылды)
  getMySubmissions: async (student_id) => {
    const result = await pool.query(`
      SELECT
        hs.id,
        hs.homework_id,
        h.title,
        hs.content,
        hs.file_url,
        hs.grade,
        hs.comment,
        hs.submitted_at
      FROM homework_submissions hs
      JOIN homeworks h ON hs.homework_id = h.id
      WHERE hs.student_id = $1
      ORDER BY hs.submitted_at DESC
    `, [student_id]);
    return result.rows;
  },

  // ✅ GRADE
  gradeSubmission: async (id, grade, comment) => {
    const result = await pool.query(
      `UPDATE homework_submissions
       SET grade = $2, comment = $3
       WHERE id = $1
       RETURNING *`,
      [id, grade, comment]
    );
    return result.rows[0];
  },

  getSubmissionById: async (id) => {
    const result = await pool.query(`
      SELECT 
        hs.*,
        h.subject_id
      FROM homework_submissions hs
      JOIN homeworks h ON hs.homework_id = h.id
      WHERE hs.id = $1
    `, [id]);
    return result.rows[0] || null;
  }
};

module.exports = SubmissionModel;