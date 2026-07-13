const router = require("express").Router();
const AIController = require("./ai.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/ask", authMiddleware, AIController.askAI);

module.exports = router;