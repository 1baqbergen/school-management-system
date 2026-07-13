const pool = require("../config/db");

const DashboardModel = {

  // 🔹 1. Жалпы статистика
  getStats: async () => {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM students) AS students,
        (SELECT COUNT(*) FROM teachers) AS teachers,
        (SELECT COUNT(*) FROM classes) AS classes,
        COALESCE((SELECT ROUND(AVG(grade_value), 2) FROM grades), 0) AS "avgGrade"
    `);

    return result.rows[0];
  },

  // 🔹 2. ТОП студенттер
  getTopStudents: async () => {
    const result = await pool.query(`
      SELECT 
        u.full_name,
        c.name AS class,
        ROUND(AVG(g.grade_value), 2) AS avg
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN classes c ON s.class_id = c.id
      JOIN grades g ON g.student_id = s.id
      GROUP BY u.full_name, c.name
      ORDER BY avg DESC
      LIMIT 5
    `);

    return result.rows;
  },

  // 🔹 3. Әлсіз студенттер
  getWeakStudents: async () => {
    const result = await pool.query(`
      SELECT 
        u.full_name,
        c.name AS class,
        ROUND(AVG(g.grade_value), 2) AS avg
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN classes c ON s.class_id = c.id
      JOIN grades g ON g.student_id = s.id
      GROUP BY u.full_name, c.name
      HAVING AVG(g.grade_value) <= 4
      ORDER BY avg ASC
      LIMIT 5
    `);

    return result.rows;
  },

  // 🔹 4. Баға динамикасы (соңғы 30 күн)
  getGradeDynamics: async () => {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(grade_date, 'YYYY-MM-DD') AS date,
        ROUND(AVG(grade_value), 2) AS value
      FROM grades
      WHERE grade_date >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(grade_date)
      ORDER BY grade_date
    `);

    return result.rows;
  },

  // 🔹 5. Пән бойынша статистика
  getSubjectStats: async () => {
    const result = await pool.query(`
      SELECT 
        sub.name AS subject,
        ROUND(AVG(g.grade_value), 2) AS value
      FROM grades g
      JOIN subjects sub ON g.subject_id = sub.id
      GROUP BY sub.name
      ORDER BY value DESC
    `);

    return result.rows;
  }

};

module.exports = DashboardModel;