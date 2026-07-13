const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/roles.middleware");
const TeacherSubjectController = require("../controllers/teacherSubject.controller");

// ➕ Пән бекіту
router.post(
  "/",
  authMiddleware,
  allowRoles("admin", "director"),
  TeacherSubjectController.assignSubject
);

// 📋 Тізім
router.get(
  "/",
  authMiddleware,
  TeacherSubjectController.getAll
);
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin", "director"),
  TeacherSubjectController.deleteAssignment
);

// routes
router.get(
  "/me",
  authMiddleware,
  allowRoles("teacher"),
  TeacherSubjectController.getMySubjects
);
module.exports = router;
