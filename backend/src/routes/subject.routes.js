const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/roles.middleware");
const SubjectController = require("../controllers/subject.controller");

// ➕ Пән қосу (admin, director)
router.post(
  "/",
  authMiddleware,
  allowRoles("admin", "director"),
  SubjectController.createSubject
);

// 📋 Пәндер тізімі
router.get(
  "/",
  authMiddleware,
  SubjectController.getAllSubjects
);
router.put(
  "/:id",
  authMiddleware,
  allowRoles("admin", "director"),
  SubjectController.updateSubject
);

router.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin", "director"),
  SubjectController.deleteSubject
);

module.exports = router;
