const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const inChargeMiddleware = require("../middleware/inChargeMiddleware");
const { createEquipment } = require("../controller/EquipmentController");
const router = express.Router();

router.post("/createEquipment", authMiddleware, inChargeMiddleware, createEquipment);

module.exports = router;