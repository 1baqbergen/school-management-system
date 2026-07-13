const pool = require('../config/db');
const bcrypt = require('bcrypt');
const UserModel = require("../models/user.model");

const AdminController = {

  // =============================
  // CREATE USER (OLD)
  // =============================
  createUser: async (req, res) => {
    try {
      const { full_name, email, password, role } = req.body;

      if (!full_name || !email || !password || !role) {
        return res.status(400).json({ message: 'Барлық өрістер міндетті' });
      }

      const roleResult = await pool.query(
        'SELECT id FROM roles WHERE name = $1',
        [role]
      );

      if (roleResult.rows.length === 0) {
        return res.status(400).json({ message: 'Роль табылмады' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await pool.query(
        `INSERT INTO users (full_name, email, password, role_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id, full_name, email`,
        [full_name, email, hashedPassword, roleResult.rows[0].id]
      );

      res.status(201).json({
        message: 'Қолданушы сәтті құрылды',
        user: newUser.rows[0]
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'User қосу қатесі' });
    }
  },

  // =============================
  // GET ALL USERS
  // =============================
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getAllUsers();

      res.json({
        count: users.length,
        users,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Қолданушыларды алу кезінде қате шықты",
      });
    }
  },

  // =====================================================
  // 1️⃣ CREATE TEACHER FULL (TRANSACTION)
  // =====================================================
  createTeacherFull: async (req, res) => {
    const client = await pool.connect();

    try {
      const { full_name, email, password, hire_date } = req.body;

      if (!full_name || !email || !password) {
        return res.status(400).json({
          message: "Барлық өрістер міндетті"
        });
      }

      await client.query("BEGIN");

      const roleResult = await client.query(
        "SELECT id FROM roles WHERE name = $1",
        ["teacher"]
      );

      if (roleResult.rows.length === 0) {
        throw new Error("Teacher role табылмады");
      }

      const role_id = roleResult.rows[0].id;

      const hashedPassword = await bcrypt.hash(password, 10);

      const userResult = await client.query(
        `INSERT INTO users (full_name, email, password, role_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id, full_name, email`,
        [full_name, email, hashedPassword, role_id]
      );

      const user_id = userResult.rows[0].id;

      const teacherResult = await client.query(
        `INSERT INTO teachers (user_id, hire_date)
         VALUES ($1, $2)
         RETURNING *`,
        [user_id, hire_date || new Date()]
      );

      await client.query("COMMIT");

      res.status(201).json({
        message: "Мұғалім толық құрылды",
        teacher: {
          ...teacherResult.rows[0],
          full_name,
          email
        }
      });

    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);
      res.status(500).json({
        message: "Teacher құру қатесі"
      });
    } finally {
      client.release();
    }
  },

  // =====================================================
  // 2️⃣ GET ALL TEACHERS FULL
  // =====================================================
  getAllTeachersFull: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          t.id,
          t.hire_date,
          u.id as user_id,
          u.full_name,
          u.email,
          u.is_active,
          u.created_at
        FROM teachers t
        JOIN users u ON t.user_id = u.id
        ORDER BY u.full_name
      `);

      res.json({
        count: result.rows.length,
        teachers: result.rows
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Teacher тізімін алу қатесі"
      });
    }
  },

  // =====================================================
  // 3️⃣ UPDATE TEACHER
  // =====================================================
  updateTeacher: async (req, res) => {
    const { id } = req.params;
    const { full_name, email, hire_date, is_active } = req.body;

    try {
      const teacher = await pool.query(
        "SELECT user_id FROM teachers WHERE id = $1",
        [id]
      );

      if (teacher.rows.length === 0) {
        return res.status(404).json({ message: "Teacher табылмады" });
      }

      const user_id = teacher.rows[0].user_id;

      await pool.query(
        `UPDATE users
         SET full_name = $1,
             email = $2,
             is_active = $3
         WHERE id = $4`,
        [full_name, email, is_active, user_id]
      );

      await pool.query(
        `UPDATE teachers
         SET hire_date = $1
         WHERE id = $2`,
        [hire_date, id]
      );

      res.json({ message: "Teacher жаңартылды" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Teacher update қатесі" });
    }
  },

  // =====================================================
  // 4️⃣ DELETE TEACHER
  // =====================================================
  deleteTeacher: async (req, res) => {
    const { id } = req.params;

    try {
      const teacher = await pool.query(
        "SELECT user_id FROM teachers WHERE id = $1",
        [id]
      );

      if (teacher.rows.length === 0) {
        return res.status(404).json({ message: "Teacher табылмады" });
      }

      const user_id = teacher.rows[0].user_id;

      await pool.query("DELETE FROM teachers WHERE id = $1", [id]);

      await pool.query(
        "UPDATE users SET is_active = false WHERE id = $1",
        [user_id]
      );

      res.json({ message: "Teacher өшірілді" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Teacher delete қатесі" });
    }
  }

};

module.exports = AdminController;