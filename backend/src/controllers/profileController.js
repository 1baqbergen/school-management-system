const db = require('../config/db');
const bcrypt = require('bcrypt');

const ProfileController = {

  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const result = await db.query(
        `SELECT id, full_name, email, role_id, avatar_url, phone, bio
         FROM users WHERE id = $1`,
        [userId]
      );

      if (!result.rows.length) {
        return res.status(404).json({ message: "Қолданушы табылмады" });
      }

      const user = result.rows[0];
      
      res.json({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role_id: user.role_id,
        avatar: user.avatar_url,
        phone: user.phone || '',
        bio: user.bio || ''
      });
    } catch (err) {
      console.error("GET PROFILE ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { full_name, phone, bio } = req.body;

      await db.query(
        `UPDATE users 
         SET full_name=$1, phone=$2, bio=$3
         WHERE id=$4`,
        [full_name, phone, bio, userId]
      );

      const result = await db.query(
        `SELECT id, full_name, email, role_id, avatar_url, phone, bio
         FROM users WHERE id = $1`,
        [userId]
      );

      const updatedUser = result.rows[0];
      
      res.json({
        id: updatedUser.id,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        role_id: updatedUser.role_id,
        avatar: updatedUser.avatar_url,
        phone: updatedUser.phone || '',
        bio: updatedUser.bio || ''
      });
    } catch (err) {
      console.error("UPDATE PROFILE ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const userId = req.user.id;
      const { old_password, new_password } = req.body;

      // 🔥 1. Параметрлерді тексеру
      if (!old_password || !new_password) {
        return res.status(400).json({ message: "Барлық өрістер толтырылуы керек" });
      }

      // 🔥 2. Қолданушыны табу
      const userResult = await db.query(
        `SELECT password FROM users WHERE id = $1`,
        [userId]
      );

      if (!userResult.rows.length) {
        return res.status(404).json({ message: "Қолданушы табылмады" });
      }

      const user = userResult.rows[0];

      // 🔥 3. Ескі парольды тексеру
      const isMatch = await bcrypt.compare(old_password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Қате пароль" });
      }

      // 🔥 4. Жаңа парольды хештеу
      const hashed = await bcrypt.hash(new_password, 10);

      // 🔥 5. Жаңарту
      await db.query(
        `UPDATE users SET password = $1 WHERE id = $2`,
        [hashed, userId]
      );

      res.json({ message: "Пароль сәтті өзгертілді" });

    } catch (err) {
      console.error("CHANGE PASSWORD ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = ProfileController;