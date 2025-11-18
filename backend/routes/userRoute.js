const express = require("express");
const { getUserInfoById, getAllInchargeUsers, updateRolUser, getAllusers, getAllTechnicians } = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/getMyUser", authMiddleware, getUserInfoById);
router.get("/getAllInchargeUsers", authMiddleware, adminMiddleware, getAllInchargeUsers);
router.put("/updateRolUser/:id", authMiddleware, adminMiddleware, updateRolUser);
router.get("/getAllusers", authMiddleware, adminMiddleware, getAllusers);
router.get("/getAllTechnicians", authMiddleware, adminMiddleware, getAllTechnicians);

module.exports = router;