const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/roles.middleware");
const ClassController = require("../controllers/class.controller");

// ➕ Сынып қосу (admin, director)
router.post(
  "/",
  authMiddleware,
  allowRoles("admin", "director"),
  ClassController.createClass
);

// 📋 Барлық сыныптар
router.get(
  "/",
  authMiddleware,
  ClassController.getAllClasses
);

router.get(
  "/teacher/my-class",
  authMiddleware,
  allowRoles("teacher"),
  ClassController.getTeacherClass
);
router.put(
  "/:id",
  authMiddleware,
  allowRoles("admin", "director"),
  ClassController.updateClass
);

router.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin", "director"),
  ClassController.deleteClass
);
router.get("/:id/students", ClassController.getClassStudents);
module.exports = router;
