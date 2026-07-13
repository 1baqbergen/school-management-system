const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/roles.middleware");
const ScheduleController = require("../controllers/schedule.controller");

// META (select үшін) — admin/director ғана
router.get(
  "/meta",
  authMiddleware,
  allowRoles("admin", "director"),
  ScheduleController.getScheduleMeta
);

// ➕ Кесте қосу
router.post(
  "/",
  authMiddleware,
  allowRoles("admin", "director"),
  ScheduleController.createSchedule
);

// 📋 Барлық кесте
router.get(
  "/",
  authMiddleware,
  ScheduleController.getAllSchedules
);

// ✏️ UPDATE
router.put(
  "/:id",
  authMiddleware,
  allowRoles("admin", "director"),
  ScheduleController.updateSchedule
);

// 🗑️ DELETE
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin", "director"),
  ScheduleController.deleteSchedule
);
router.get(
  "/teacher/me",
  authMiddleware,
  allowRoles("teacher"),
  ScheduleController.getMySchedule
);

router.get(
  "/teacher/my",
  authMiddleware,
  allowRoles("teacher"),
  ScheduleController.getMySchedule
);
router.get(
  "/student/my",
  authMiddleware,
  allowRoles("student"),
  ScheduleController.getMyStudentSchedule
);

module.exports = router;