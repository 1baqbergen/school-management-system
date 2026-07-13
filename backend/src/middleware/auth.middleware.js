// backend/src/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Токен жоқ" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (req.user.role === "teacher" && !req.user.teacher_id) {
      const t = await pool.query(`SELECT id FROM teachers WHERE user_id = $1`, [req.user.id]);
      req.user.teacher_id = t.rows[0]?.id ?? null;
    }

    if (req.user.role === "student" && (!req.user.student_id || !req.user.class_id)) {
      const s = await pool.query(`SELECT id, class_id FROM students WHERE user_id = $1`, [req.user.id]);
      req.user.student_id = s.rows[0]?.id ?? null;
      req.user.class_id = s.rows[0]?.class_id ?? null;
    }

    return next();
  } catch (err) {
    return res.status(403).json({ message: "Жарамсыз токен" });
  }
};