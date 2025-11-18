const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const inChargeMiddleware = require("../middleware/inChargeMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { createDepartment, getMyBuildings, addNewArea } = require("../controller/departmentController");
const router = express.Router();

router.post("/create", authMiddleware, createDepartment);
router.get("/getMyBuildings/:id", authMiddleware, getMyBuildings);
router.post("/:id/createArea", authMiddleware, addNewArea);


module.exports = router;