const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");

router.get("/meta", activityController.getActivityMeta);
router.get("/", activityController.getAllActivities);
router.get("/:id", activityController.getActivityById);
router.post("/", activityController.createActivity);
router.put("/:id", activityController.updateActivity);
router.patch("/:id/complete", activityController.markActivityCompleted);
router.delete("/:id", activityController.deleteActivity);

module.exports = router;
