const pool = require("../config/db");

const StudentModel = {
  createStudent: async (user_id, class_id, admission_year) => {
    const result = await pool.query(
      `INSERT INTO students (user_id, class_id, admission_year)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, class_id, admission_year]
    );
    return result.rows[0];
  },

  getAllStudents: async (class_id) => {
  let query = `
    SELECT 
      s.id,
      s.user_id,
      s.class_id,
      u.full_name,
      u.email,
      u.is_active,
      s.admission_year,
      s.created_at,
      c.name AS class_name
    FROM students s
    JOIN users u ON s.user_id = u.id
    JOIN classes c ON s.class_id = c.id
  `;

  const values = [];

  if (class_id) {
    query += ` WHERE s.class_id = $1`;
    values.push(class_id);
  }

  query += ` ORDER BY c.grade, u.full_name`;

  const result = await pool.query(query, values);
  return result.rows;
},

  getStudentsByClass: async (classId, startDate, endDate) => {
  const result = await pool.query(
    `
    SELECT 
      s.id,
      u.full_name,
      u.email,
      c.name AS class_name,
      s.admission_year,
      COALESCE(
      json_agg(
      json_build_object(
      'id', g.id,
      'subject_id', g.subject_id,
      'subject_name', sub.name,
      'grade_value', g.grade_value,
      'grade_date', g.grade_date,
      'comment', g.comment
    )
  ) FILTER (WHERE g.id IS NOT NULL), '[]'
) AS grades
    FROM students s
    JOIN users u ON s.user_id = u.id
    JOIN classes c ON s.class_id = c.id
    LEFT JOIN grades g ON g.student_id = s.id
      AND ($2::date IS NULL OR g.grade_date >= $2::date)
      AND ($3::date IS NULL OR g.grade_date <= $3::date)
    LEFT JOIN subjects sub ON g.subject_id = sub.id
    WHERE s.class_id = $1
    GROUP BY s.id, u.full_name, u.email, c.name, s.admission_year
    ORDER BY u.full_name
    `,
    [classId, startDate || null, endDate || null]
  );

  return result.rows;
}
};

module.exports = StudentModel;