const pool = require("../config/db");
const bcrypt = require("bcrypt");

const ParentController = {

  // ➕ Create Parent (user + parent)
  createParent: async (req, res) => {
    const client = await pool.connect();

    try {
      const { full_name, email, password, phone } = req.body;

      if (!full_name || !email || !password) {
        return res.status(400).json({
          message: "Барлық өрістер міндетті"
        });
      }

      await client.query("BEGIN");

      // 1️⃣ Email тексеру
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
        `INSERT INTO users (full_name, email, password, role_id, phone, is_active, created_at)
         VALUES ($1, $2, $3, 6, $4, true, NOW())
         RETURNING id`,
        [full_name, email, hashedPassword, phone || null]
      );

      const user_id = userResult.rows[0].id;

      // 4️⃣ Parent жасау
      const parentResult = await client.query(
        `INSERT INTO parents (user_id, created_at)
         VALUES ($1, NOW())
         RETURNING *`,
        [user_id]
      );

      await client.query("COMMIT");

      res.status(201).json({
        message: "Ата-ана сәтті қосылды",
        parent: parentResult.rows[0]
      });

    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);
      res.status(500).json({ message: "Parent қосу қатесі" });
    } finally {
      client.release();
    }
  },
  // 👨‍👩‍👧 Admin үшін parent → children
getChildrenByParentId: async (req, res) => {
  try {
    const { parentId } = req.params;

    const children = await pool.query(`
      SELECT 
        s.id,
        u.full_name,
        CONCAT(c.grade, c.letter) AS class_name
      FROM parent_students ps
      JOIN students s ON ps.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN classes c ON s.class_id = c.id
      WHERE ps.parent_id = $1
    `, [parentId]);

    res.json(children.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Children fetch error" });
  }
},
  // 🗑 Delete Parent (parent + user)
  deleteParent: async (req, res) => {
    try {
      const parentId = req.params.id;

      const parentResult = await pool.query(
        `SELECT user_id FROM parents WHERE id = $1`,
        [parentId]
      );

      if (parentResult.rows.length === 0) {
        return res.status(404).json({
          message: "Parent табылмады"
        });
      }

      const userId = parentResult.rows[0].user_id;

      await pool.query(`DELETE FROM parent_students WHERE parent_id = $1`, [parentId]);
      await pool.query(`DELETE FROM parents WHERE id = $1`, [parentId]);
      await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);

      res.json({ message: "Parent deleted successfully" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Delete error" });
    }
  },

  // 📋 Барлық Parent
  getAllParents: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          p.id,
          u.full_name,
          u.email,
          u.phone,
          u.is_active,
          p.created_at
        FROM parents p
        JOIN users u ON p.user_id = u.id
        ORDER BY u.full_name
      `);

      res.json(result.rows);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Parents алу қатесі" });
    }
  },

  // 🔗 Parent → Students
  assignStudent: async (req, res) => {
    try {
      const { parentId } = req.params;
      const { student_id } = req.body;

      const exists = await pool.query(
        `SELECT id FROM parent_students WHERE parent_id=$1 AND student_id=$2`,
        [parentId, student_id]
      );

      if (exists.rows.length > 0) {
        return res.status(400).json({
          message: "Бұл оқушы бұрыннан қосылған"
        });
      }

      await pool.query(
        `INSERT INTO parent_students (parent_id, student_id)
         VALUES ($1, $2)`,
        [parentId, student_id]
      );

      res.json({ message: "Student қосылды" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Assign error" });
    }
  },

  // ❌ Remove Student
  removeStudent: async (req, res) => {
    try {
      const { parentId, studentId } = req.params;

      await pool.query(
        `DELETE FROM parent_students
         WHERE parent_id=$1 AND student_id=$2`,
        [parentId, studentId]
      );

      res.json({ message: "Student removed" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Remove error" });
    }
  },

  // 👨‍👩‍👧 Parent өз балалары
  getMyChildren: async (req, res) => {
    try {
      const parent = await pool.query(
        `SELECT id FROM parents WHERE user_id = $1`,
        [req.user.id]
      );

      const parentId = parent.rows[0].id;
      

      const children = await pool.query(`
        SELECT s.id, u.full_name, CONCAT(c.grade, c.letter) AS class_name
        FROM parent_students ps
        JOIN students s ON ps.student_id = s.id
        JOIN users u ON s.user_id = u.id
        JOIN classes c ON s.class_id = c.id
        WHERE ps.parent_id = $1
      `, [parentId]);

      res.json(children.rows);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Children error" });
    }
  },

  // 📊 Grades
  getChildGrades: async (req, res) => {
    try {
      const { studentId } = req.params;

      const parent = await pool.query(
        `SELECT id FROM parents WHERE user_id = $1`,
        [req.user.id]
      );

      const parentId = parent.rows[0].id;

      const check = await pool.query(
        `SELECT id FROM parent_students WHERE parent_id=$1 AND student_id=$2`,
        [parentId, studentId]
      );

      if (!check.rows.length) {
        return res.status(403).json({ message: "Рұқсат жоқ" });
      }

      const grades = await pool.query(`
  SELECT 
    g.id,
    g.grade_value,
    g.grade_date,
    g.comment,
    sub.name AS subject_name,
    u.full_name AS teacher_name
  FROM grades g
  JOIN subjects sub ON g.subject_id = sub.id
  LEFT JOIN teachers t ON g.teacher_id = t.id
  LEFT JOIN users u ON t.user_id = u.id
  WHERE g.student_id = $1
  ORDER BY g.grade_date DESC
`, [studentId]);

      res.json(grades.rows);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Grades error" });
    }
  },

  // 📅 Schedule
  getChildSchedule: async (req, res) => {
    try {
      const { studentId } = req.params;

      const parent = await pool.query(
        `SELECT id FROM parents WHERE user_id = $1`,
        [req.user.id]
      );

      const parentId = parent.rows[0].id;

      const check = await pool.query(
        `SELECT id FROM parent_students WHERE parent_id=$1 AND student_id=$2`,
        [parentId, studentId]
      );

      if (!check.rows.length) {
        return res.status(403).json({ message: "Рұқсат жоқ" });
      }

      const schedule = await pool.query(`
  SELECT 
    sch.id,
    sch.day_of_week,
    sch.lesson_number,
    sch.start_time,
    sch.end_time,
    sub.name AS subject_name,
    u.full_name AS teacher_name,
    CONCAT(c.grade, c.letter) AS class_name
  FROM students s
  JOIN classes c ON s.class_id = c.id
  JOIN schedules sch ON sch.class_id = c.id
  JOIN subjects sub ON sch.subject_id = sub.id
  LEFT JOIN teachers t ON sch.teacher_id = t.id
  LEFT JOIN users u ON t.user_id = u.id
  WHERE s.id = $1
`, [studentId]);

      res.json(schedule.rows);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Schedule error" });
    }
  }

};

module.exports = ParentController;