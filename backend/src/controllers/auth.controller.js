const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
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
            return res.status(400).json({ message: 'Мұндай роль жоқ' });
        }

        const role_id = roleResult.rows[0].id;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            `INSERT INTO users (full_name, email, password, role_id)
             VALUES ($1, $2, $3, $4)
             RETURNING id, full_name, email`,
            [full_name, email, hashedPassword, role_id]
        );

        res.status(201).json({
            message: 'Қолданушы сәтті тіркелді',
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Register қатесі' });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await pool.query(
            `SELECT users.*, roles.name AS role
             FROM users
             JOIN roles ON users.role_id = roles.id
             WHERE email = $1`,
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Email немесе пароль қате' });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email немесе пароль қате' });
        }

        // 🔥 ДИНАМИКАЛЫҚ PAYLOAD
        let payload = {
            id: user.id,
            role: user.role
        };

        // 👨‍🏫 Егер teacher болса → teacher_id аламыз
        if (user.role === "teacher") {
            const teacherResult = await pool.query(
                "SELECT id FROM teachers WHERE user_id = $1",
                [user.id]
            );

            if (teacherResult.rows.length > 0) {
                payload.teacher_id = teacherResult.rows[0].id;
            }
        }

        // 👨‍🎓 Егер student болса → student_id аламыз
        if (user.role === "student") {
            const studentResult = await pool.query(
                "SELECT id FROM students WHERE user_id = $1",
                [user.id]
            );

            if (studentResult.rows.length > 0) {
                payload.student_id = studentResult.rows[0].id;
            }
        }

        // 👨‍👩‍👧 Егер parent болса → parent_id аламыз
        if (user.role === "parent") {
            const parentResult = await pool.query(
                "SELECT id FROM parents WHERE user_id = $1",
                [user.id]
            );
            if (parentResult.rows.length > 0) {
                payload.parent_id = parentResult.rows[0].id;
            }
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Сәтті кірдіңіз',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login қатесі' });
    }
};


exports.me = async (req, res) => {
  try {
    const userId = req.user.id;

    // Негізгі user
    const result = await pool.query(
      `SELECT users.id, users.full_name, users.email, roles.name AS role
       FROM users
       JOIN roles ON users.role_id = roles.id
       WHERE users.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Пайдаланушы табылмады" });
    }

    const user = result.rows[0];

    // Егер teacher болса → teacher_id қайтару
    if (user.role === 'teacher') {
      const t = await pool.query(
        `SELECT id FROM teachers WHERE user_id = $1`,
        [userId]
      );
      user.teacher_id = t.rows[0]?.id ?? null;
    }

    // Егер student болса → student_id + class_id қайтару
    if (user.role === 'student') {
      const s = await pool.query(
        `SELECT id, class_id FROM students WHERE user_id = $1`,
        [userId]
      );
      user.student_id = s.rows[0]?.id ?? null;
      user.class_id = s.rows[0]?.class_id ?? null;
    }
    // 👨‍👩‍👧 Егер parent болса → parent_id қайтару
    if (user.role === 'parent') {
        const p = await pool.query(
            `SELECT id FROM parents WHERE user_id = $1`,
            [userId]
        );
        user.parent_id = p.rows[0]?.id ?? null;
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "me қатесі" });
  }
};

