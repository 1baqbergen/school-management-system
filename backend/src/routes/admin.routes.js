const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/roles.middleware');
const AdminController = require("../controllers/admin.controller");

// Admin тексеру маршруты
router.get(
  '/admin',
  authMiddleware,
  allowRoles('admin'),
  (req, res) => {
    res.json({
      message: 'Admin маршрутқа кірдіңіз',
      user: req.user
    });
  }
);

// Admin dashboard
router.get(
  "/dashboard",
  authMiddleware,
  allowRoles("admin"),
  (req, res) => {
    res.json({
      message: "Admin панеліне қош келдіңіз",
      admin: req.user,
    });
  }
);

// Барлық қолданушылар
router.get(
  "/users",
  authMiddleware,
  allowRoles("admin"),
  AdminController.getAllUsers
);
router.get(
  "/teachers",
  authMiddleware,
  allowRoles("admin"),
  AdminController.getAllTeachersFull
);

router.post(
  "/create-teacher",
  authMiddleware,
  allowRoles("admin"),
  AdminController.createTeacherFull
);

router.put(
  "/teachers/:id",
  authMiddleware,
  allowRoles("admin"),
  AdminController.updateTeacher
);

router.delete(
  "/teachers/:id",
  authMiddleware,
  allowRoles("admin"),
  AdminController.deleteTeacher
);

// 🔥 ЕНДІ НАҚТЫ DATABASE-КЕ ЖАЗАТЫН ROUTE
router.post(
  '/create-user',
  authMiddleware,
  allowRoles('admin'),
  AdminController.createUser
);

module.exports = router;
