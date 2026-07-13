const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'Сәтті шықты' });
  } catch (error) {
    res.status(500).json({ message: 'Қате кетті' });
  }
});
module.exports = router;
