const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/roles.middleware");
const ParentController = require("../controllers/parent.controller");

// Admin
router.post("/", auth, allowRoles("admin", "director"), ParentController.createParent);
router.get("/", auth, allowRoles("admin", "director"), ParentController.getAllParents);
router.delete("/:id", auth, allowRoles("admin", "director"), ParentController.deleteParent);

router.post("/:parentId/assign-student", auth, allowRoles("admin", "director"), ParentController.assignStudent);
router.delete("/:parentId/remove-student/:studentId", auth, allowRoles("admin", "director"), ParentController.removeStudent);
router.get("/:parentId/children",
  auth,
  allowRoles("admin", "director"),
  ParentController.getChildrenByParentId
);
// Parent
router.get("/my-children", auth, allowRoles("parent"), ParentController.getMyChildren);
router.get("/child/:studentId/grades", auth, allowRoles("parent"), ParentController.getChildGrades);
router.get("/child/:studentId/schedule", auth, allowRoles("parent"), ParentController.getChildSchedule);

module.exports = router;