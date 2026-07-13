// backend/src/routes/grade.routes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/roles.middleware");
const GradeController = require("../controllers/grade.controller");

// ✅ LIST: role-ға қарай controller өзі бөледі
router.get(
  "/",
  authMiddleware,
  allowRoles("admin", "director", "teacher", "student"),
  GradeController.getGrades
);

// ✅ TEACHER: өз бағалары
router.get(
  "/teacher/me",
  authMiddleware,
  allowRoles("teacher"),
  GradeController.getMyTeacherGrades
);

// ✅ META (role-based)
router.get(
  "/meta",
  authMiddleware,
  allowRoles("teacher", "admin", "director"),
  GradeController.getMeta
);

// ✅ ADMIN: пәндер teacher бойынша
router.get(
  "/meta/teacher/:teacher_id",
  authMiddleware,
  allowRoles("admin", "director"),
  GradeController.getMetaByTeacher
);

// ✅ STUDENT by id (admin/teacher ok, student only self)
router.get(
  "/student/:student_id",
  authMiddleware,
  allowRoles("admin", "director", "teacher", "student"),
  GradeController.getStudentGrades
);

// ✅ CREATE
router.post(
  "/",
  authMiddleware,
  allowRoles("admin", "director", "teacher"),
  GradeController.createGrade
);

// ✅ UPDATE
router.put(
  "/:id",
  authMiddleware,
  allowRoles("teacher", "admin", "director"),
  GradeController.updateGrade
);

// ✅ DELETE
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin", "director"),
  GradeController.deleteGrade
);

module.exports = router;