/*const TeacherModel = require("../models/teacher.model");

const TeacherController = {
  
  createTeacher: async (req, res) => {
    
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({
          message: "user_id міндетті"
        });
      }

      const teacher = await TeacherModel.createTeacher(user_id);

      res.status(201).json({
        message: "Мұғалім сәтті қосылды",
        teacher
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Мұғалім қосу қатесі"
      });
    }
  },
  getAllTeachers: async (req, res) => {
  try {
    const teachers = await require("../models/teacher.model").getAllTeachers();
    res.json({ count: teachers.length, teachers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка получения учителей" });
  }
}

  
};

module.exports = TeacherController;*/

const pool = require("../config/db");
const bcrypt = require("bcrypt");

const TeacherController = {

  createTeacher: async (req, res) => {
    const client = await pool.connect();

    try {
      const { full_name, email, password, hire_date } = req.body;

      if (!full_name || !email || !password || !hire_date) {
        return res.status(400).json({
          message: "Барлық өрістер міндетті"
        });
      }

      await client.query("BEGIN");

      // 1️⃣ Проверка email
      const existingUser = await client.query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
      );

      if (existingUser.rows.length > 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: "Бұл email бұрыннан бар"
        });
      }

      // 2️⃣ Пароль хештеу
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3️⃣ User жасау
      const userResult = await client.query(
        `INSERT INTO users (full_name, email, password, role_id, is_active, created_at)
         VALUES ($1, $2, $3, 3, true, NOW())
         RETURNING id`,
        [full_name, email, hashedPassword]
      );

      const user_id = userResult.rows[0].id;

      // 4️⃣ Teacher жасау
      const teacherResult = await client.query(
        `INSERT INTO teachers (user_id, hire_date, created_at)
         VALUES ($1, $2, NOW())
         RETURNING *`,
        [user_id, hire_date]
      );

      await client.query("COMMIT");

      res.status(201).json({
        message: "Мұғалім сәтті қосылды",
        teacher: teacherResult.rows[0]
      });

    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);
      res.status(500).json({
        message: "Мұғалім қосу қатесі"
      });
    } finally {
      client.release();
    }
  },

  deleteTeacher: async (req, res) => {
  try {
    const teacherId = req.params.id;

    const teacherResult = await pool.query(
      `SELECT user_id FROM teachers WHERE id = $1`,
      [teacherId]
    );

    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const userId = teacherResult.rows[0].user_id;

    await pool.query(`DELETE FROM teachers WHERE id = $1`, [teacherId]);
    await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);

    res.json({ message: "Teacher deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete error" });
  }
},

  updateTeacher: async (req, res) => {
  const client = await pool.connect();

  try {
    const teacherId = req.params.id;
    const { full_name, email, hire_date, is_active } = req.body;

    await client.query("BEGIN");

    // 1️⃣ teacher табу
    const teacherResult = await client.query(
      `SELECT * FROM teachers WHERE id = $1`,
      [teacherId]
    );

    if (teacherResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Teacher not found" });
    }

    const teacher = teacherResult.rows[0];

    // 2️⃣ users жаңарту
    await client.query(
      `UPDATE users
       SET full_name = $1,
           email = $2,
           is_active = $3
       WHERE id = $4`,
      [full_name, email, is_active, teacher.user_id]
    );

    // 3️⃣ teachers жаңарту
    await client.query(
      `UPDATE teachers
       SET hire_date = $1
       WHERE id = $2`,
      [hire_date, teacherId]
    );

    await client.query("COMMIT");

    res.json({ message: "Teacher updated successfully" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Update error" });
  } finally {
    client.release();
  }
},


  getAllTeachers: async (req, res) => {
    try {
      const teachers = await require("../models/teacher.model").getAllTeachers();
      res.json({ count: teachers.length, teachers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка получения учителей" });
    }
  },
  // 🔥 Select үшін жеңіл тізім
getTeachersForSelect: async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.id,
        u.full_name
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE u.is_active = true
      ORDER BY u.full_name
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Teacher list error"
    });
  }
},
dashboard: async (req, res) => {
  try {
    const teacher_id = req.user.teacher_id;

    const [grades, schedule] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM grades WHERE teacher_id = $1`, [teacher_id]),
      pool.query(`SELECT COUNT(*) FROM schedules WHERE teacher_id = $1`, [teacher_id])
    ]);

    res.json({
      total_grades: Number(grades.rows[0].count),
      total_lessons: Number(schedule.rows[0].count)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard error" });
  }
},

stats: async (req, res) => {
  try {
    const teacher_id = req.user.teacher_id;

    const result = await pool.query(`
      SELECT
        sub.name AS subject,
        AVG(g.grade_value) as avg_grade
      FROM grades g
      JOIN subjects sub ON g.subject_id = sub.id
      WHERE g.teacher_id = $1
      GROUP BY sub.name
    `, [teacher_id]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Stats error" });
  }
}
};



module.exports = TeacherController;
