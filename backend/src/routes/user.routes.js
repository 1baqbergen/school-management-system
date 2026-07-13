const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Қорғалған маршрутқа кірдіңіз",
    user: req.user
  });
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({
    message: 'Ағымдағы қолданушы',
    user: req.user
  });
});

module.exports = router;
