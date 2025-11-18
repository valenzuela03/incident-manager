const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { createProblem, getAllProblems, getMyAssignedProblems, updateProblem } = require("../controller/problemController");

const router = express.Router();

router.post("/create", authMiddleware, adminMiddleware, createProblem);
router.get("/all", authMiddleware, adminMiddleware, getAllProblems);
router.get("/myAssigned", authMiddleware, getMyAssignedProblems);
router.patch("/update/:id", authMiddleware, updateProblem);

module.exports = router;