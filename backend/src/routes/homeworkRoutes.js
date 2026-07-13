const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const allow = require("../middleware/roles.middleware");
const controller = require("../controllers/homeworkController");

router.get("/", auth, allow("admin","director","teacher","student"), controller.getHomeworks);
router.post("/", auth, allow("admin","director","teacher"), controller.createHomework);
router.delete("/:id", auth, allow("admin","director","teacher"), controller.deleteHomework);
router.get("/meta", auth, allow("admin","director","teacher"), controller.getMeta);
module.exports = router;