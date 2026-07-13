const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const allow = require("../middleware/roles.middleware");
const controller = require("../controllers/submissionController");

router.post("/", auth, allow("student"), controller.submitHomework);
router.get("/", auth, allow("teacher","admin"), controller.getSubmissions);
router.get("/me", auth, allow("student"), controller.getMySubmissions);
router.put("/:id/grade", auth, allow("teacher"), controller.gradeSubmission);

module.exports = router;