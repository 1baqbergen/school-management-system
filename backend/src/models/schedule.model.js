const pool = require("../config/db");

const ScheduleModel = {
  createSchedule: async (
    class_id,
    teacher_id,
    subject_id,
    day_of_week,
    lesson_number,
    start_time,
    end_time
  ) => {
    const result = await pool.query(
      `INSERT INTO schedules
       (class_id, teacher_id, subject_id, day_of_week, lesson_number, start_time, end_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        class_id,
        teacher_id,
        subject_id,
        day_of_week,
        lesson_number,
        start_time,
        end_time,
      ]
    );

    return result.rows[0];
  },

  // ✅ ЕҢ МАҢЫЗДЫ: ids + names бірге қайтуы керек
  getAllSchedules: async () => {
    const result = await pool.query(`
      SELECT
        s.id,
        s.class_id,
        s.teacher_id,
        s.subject_id,
        c.name AS class_name,
        u.full_name AS teacher_name,
        sub.name AS subject_name,
        t.user_id AS teacher_user_id,
        s.day_of_week,
        s.lesson_number,
        s.start_time,
        s.end_time
      FROM schedules s
      JOIN classes c ON s.class_id = c.id
      JOIN teachers t ON s.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      JOIN subjects sub ON s.subject_id = sub.id
      ORDER BY c.name, s.day_of_week, s.lesson_number
    `);

    return result.rows;
  },

  // ✅ UPDATE
  updateSchedule: async (
    id,
    class_id,
    teacher_id,
    subject_id,
    day_of_week,
    lesson_number,
    start_time,
    end_time
  ) => {
    const result = await pool.query(
      `UPDATE schedules
       SET class_id = $2,
           teacher_id = $3,
           subject_id = $4,
           day_of_week = $5,
           lesson_number = $6,
           start_time = $7,
           end_time = $8
       WHERE id = $1
       RETURNING *`,
      [
        id,
        class_id,
        teacher_id,
        subject_id,
        day_of_week,
        lesson_number,
        start_time,
        end_time,
      ]
    );
    return result.rows[0] || null;
  },

  // ✅ DELETE
  deleteSchedule: async (id) => {
    await pool.query(`DELETE FROM schedules WHERE id = $1`, [id]);
    return true;
  },

  getStudentSchedule: async (student_id, day) => {
  let query = `
    SELECT
      s.id,
      c.name AS class_name,
      sub.name AS subject_name,
      u.full_name AS teacher_name,
      s.day_of_week,
      s.lesson_number,
      s.start_time,
      s.end_time
    FROM schedules s
    JOIN classes c ON s.class_id = c.id
    JOIN students st ON st.class_id = c.id
    JOIN teachers t ON s.teacher_id = t.id
    JOIN users u ON t.user_id = u.id
    JOIN subjects sub ON s.subject_id = sub.id
    WHERE st.id = $1
  `;

  const params = [student_id];

  if (day) {
    query += ` AND s.day_of_week = $2`;
    params.push(day);
  }

  query += ` ORDER BY s.lesson_number`;

  const result = await pool.query(query, params);
  return result.rows;
},
  getTeacherSchedule: async (teacher_id, day) => {
  let query = `
    SELECT
      s.id,
      c.name AS class_name,
      sub.name AS subject_name,
      s.day_of_week,
      s.lesson_number,
      s.start_time,
      s.end_time
    FROM schedules s
    JOIN classes c ON s.class_id = c.id
    JOIN subjects sub ON s.subject_id = sub.id
    WHERE s.teacher_id = $1
  `;

  const params = [teacher_id];

  if (day) {
    query += ` AND s.day_of_week = $2`;
    params.push(day);
  }

  query += ` ORDER BY s.day_of_week, s.lesson_number`;

  const result = await pool.query(query, params);
  return result.rows;
}
};

module.exports = ScheduleModel;