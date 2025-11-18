const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const inChargeMiddleware = require("../middleware/inChargeMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {createTask, getAllCompletedTasks, getAllTasks, authorizeTask, getUnassignedTasks, getMyGeneratedTasks, getMyAssignedTasks, getAllBuildingAndEquipmentInfo, finishTask, getMyCompletedTasks, setSrviceType, liberateIncident} = require("../controller/taskController");
const router = express.Router();

router.post("/create", authMiddleware, createTask);
router.get("/getAll", authMiddleware, adminMiddleware, getAllTasks);
router.put("/authorize", authMiddleware, adminMiddleware, authorizeTask);
router.get("/getAllUnauthorize", authMiddleware, adminMiddleware, getUnassignedTasks);
router.get("/getMyGeneratedTasks", authMiddleware, getMyGeneratedTasks);
router.get("/getMyAssignedTasks", authMiddleware, getMyAssignedTasks);
router.get("/getAllBuildEquip", getAllBuildingAndEquipmentInfo);
router.patch("/complete/:id", authMiddleware, finishTask);
router.get("/getMyCompletedTasks", authMiddleware, getMyCompletedTasks);
router.get("/getAllCompletedTasks", authMiddleware, getAllCompletedTasks);
router.put("/setServiceType/:id", authMiddleware, setSrviceType);
router.put("/liberateIncident/:id", authMiddleware, liberateIncident);

module.exports = router;