const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/roles.middleware");
const TeacherController = require("../controllers/teacher.controller");
const GradeController = require("../controllers/grade.controller");
router.post(
  "/",
  authMiddleware,
  allowRoles("admin", "director"),
  TeacherController.createTeacher
);

router.get(
  "/",
  authMiddleware,
  allowRoles("admin", "director"),
  async (req, res) => {
    try {
      const teachers = await require("../controllers/teacher.controller").getAllTeachers(req, res);
    } catch (err) {
      res.status(500).json({ message: "Ошибка получения учителей" });
    }
  }
);
router.put(
  "/:id",
  authMiddleware,
  allowRoles("admin", "director"),
  TeacherController.updateTeacher
);

router.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin", "director"),
  TeacherController.deleteTeacher
);
router.get(
  "/list",
  authMiddleware,
  allowRoles("admin", "director"),
  TeacherController.getTeachersForSelect
);

router.get(
  "/grades",
  authMiddleware,
  allowRoles("teacher"),
  GradeController.getMyTeacherGrades
);
router.get(
  "/dashboard",
  authMiddleware,
  allowRoles("teacher"),
  TeacherController.dashboard
);

router.get(
  "/stats",
  authMiddleware,
  allowRoles("teacher"),
  TeacherController.stats
);

module.exports = router;
