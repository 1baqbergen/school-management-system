const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/dashboard.controller");

// 📊 Dashboard routes
router.get("/stats", DashboardController.getStats);
router.get("/top-students", DashboardController.getTopStudents);
router.get("/weak-students", DashboardController.getWeakStudents);
router.get("/grade-dynamics", DashboardController.getGradeDynamics);
router.get("/subject-stats", DashboardController.getSubjectStats);

module.exports = router;