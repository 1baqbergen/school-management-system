  const pool = require("../config/db");
  const bcrypt = require("bcrypt");
  const StudentController = {
    createStudent: async (req, res) => {
      const client = await pool.connect();
      try {
        const { full_name, email, password, class_id, admission_year } = req.body;
        if (!full_name || !email || !password || !class_id) {
          return res.status(400).json({
            message: "Барлық өрістер міндетті"
          });
        }
        await client.query("BEGIN");

        const existingUser = await client.query(
          `SELECT id FROM users WHERE email = $1`,
          [email]
        );
        if (existingUser.rows.length > 0) {
          await client.query("ROLLBACK");
          return res.status(400).json({ message: "Бұл email бұрыннан бар" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userResult = await client.query(
          `INSERT INTO users (full_name, email, password, role_id, is_active, created_at)
          VALUES ($1, $2, $3, 5, true, NOW())
          RETURNING id`,
          [full_name, email, hashedPassword]
        );

        const user_id = userResult.rows[0].id;

        // 4️⃣ Student жасау
        const studentResult = await client.query(
          `INSERT INTO students (user_id, class_id, admission_year, created_at)
          VALUES ($1, $2, $3, NOW())
          RETURNING *`,
          [user_id, class_id, admission_year]
        );

        await client.query("COMMIT");

        res.status(201).json({
          message: "Оқушы сәтті қосылды",
          student: studentResult.rows[0]
        });

      } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ message: "Оқушы қосу қатесі" });
      } finally {
        client.release();
      }
    },

    // 🗑 Delete Student (student + user)
    deleteStudent: async (req, res) => {
      try {
        const studentId = req.params.id;

        const studentResult = await pool.query(
          `SELECT user_id FROM students WHERE id = $1`,
          [studentId]
        );

        if (studentResult.rows.length === 0) {
          return res.status(404).json({ message: "Student not found" });
        }

        const userId = studentResult.rows[0].user_id;

        await pool.query(`DELETE FROM students WHERE id = $1`, [studentId]);
        await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);

        res.json({ message: "Student deleted successfully" });

      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Delete error" });
      }
    },

    // ✏ Update Student (user + student)
    updateStudent: async (req, res) => {
      const client = await pool.connect();
      try {
        const studentId = req.params.id;
        const { full_name, email, class_id, admission_year, is_active } = req.body;

        await client.query("BEGIN");

        // 1️⃣ Student табу
        const studentResult = await client.query(
          `SELECT * FROM students WHERE id = $1`,
          [studentId]
        );
        if (studentResult.rows.length === 0) {
          await client.query("ROLLBACK");
          return res.status(404).json({ message: "Student not found" });
        }
        const student = studentResult.rows[0];

        // 2️⃣ User жаңарту
        await client.query(
          `UPDATE users
          SET full_name = $1,
              email = $2,
              is_active = $3
          WHERE id = $4`,
          [full_name, email, is_active, student.user_id]
        );

        // 3️⃣ Student жаңарту
        await client.query(
          `UPDATE students
          SET class_id = $1,
              admission_year = $2
          WHERE id = $3`,
          [class_id, admission_year, studentId]
        );

        await client.query("COMMIT");

        res.json({ message: "Student updated successfully" });

      } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ message: "Update error" });
      } finally {
        client.release();
      }
    },

    // 📋 Барлық Students
    getAllStudents: async (req, res) => {
    try {
      const students = await require("../models/student.model").getAllStudents();
      res.json(students); // <-- ОСЫ
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка получения студентов" });
    }
  },

    // 🔥 Select list үшін жеңіл Students тізім
    getStudentsForSelect: async (req, res) => {
      try {
        const result = await pool.query(`
          SELECT s.id, u.full_name
          FROM students s
          JOIN users u ON s.user_id = u.id
          ORDER BY u.full_name
        `);
        res.json(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Students list error" });
      }
    },
    
    getStudentById: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(`
        SELECT 
          s.id,
          u.full_name,
          CONCAT(c.grade, c.letter) AS class_name
        FROM students s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN classes c ON s.class_id = c.id
        WHERE s.id = $1
      `, [id]);

      if (!result.rows.length) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json(result.rows[0]);

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
  };

  module.exports = StudentController;