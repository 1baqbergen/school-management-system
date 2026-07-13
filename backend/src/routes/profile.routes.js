const express = require('express'); // 🔥 МІНДЕТТІ - express импорттау керек
const router = express.Router();
const controller = require('../controllers/profileController');
const auth = require("../middleware/auth.middleware");
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 🔥 uploads папкасын тексеру
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔥 multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Тек сурет файлдары ғана рұқсат етіледі'));
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

// ------------------- ROUTES -------------------

router.get('/me', auth, controller.getProfile);
router.put('/update', auth, controller.updateProfile);
router.put('/change-password', auth, controller.changePassword);

// 🔥 AVATAR UPLOAD
router.put('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Файл жүктелмеді" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    // Ескі аватарды өшіру
    const oldAvatar = await db.query(
      `SELECT avatar_url FROM users WHERE id = $1`,
      [req.user.id]
    );
    
    if (oldAvatar.rows[0]?.avatar_url) {
      const oldPath = path.join(__dirname, '../..', oldAvatar.rows[0].avatar_url);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await db.query(
      `UPDATE users SET avatar_url = $1 WHERE id = $2`,
      [avatarUrl, req.user.id]
    );

    res.json({ avatar: avatarUrl });

  } catch (e) {
    console.error("AVATAR UPLOAD ERROR:", e);
    res.status(500).json({ message: "Қате" });
  }
});

// ❌ Бұл ЖОҚ болуы керек! Static files serve ТЕК server.js-та!
// router.use('/uploads', express.static('uploads')); // 🔥 ӨШІРІҢІЗ!

module.exports = router;