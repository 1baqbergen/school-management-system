const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/roles.middleware");
const StudentController = require("../controllers/student.controller");

router.post(
  "/",
  authMiddleware,
  allowRoles("admin", "director"),
  StudentController.createStudent
);

router.get(
  "/",
  authMiddleware,
  allowRoles("admin", "director"),
  StudentController.getAllStudents
);

router.put(
  "/:id",
  authMiddleware,
  allowRoles("admin", "director"),
  StudentController.updateStudent
);

router.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin", "director"),
  StudentController.deleteStudent
);

router.get(
  "/list",
  authMiddleware,
  allowRoles("admin", "director"),
  StudentController.getStudentsForSelect
);

router.get(
  "/:id",
  authMiddleware,
  allowRoles("admin", "director", "teacher", "parent"),
  StudentController.getStudentById
);

module.exports = router;