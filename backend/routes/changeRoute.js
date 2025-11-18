const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { create, getAll, acceptChange } = require('../controller/ChangeGestorController');

const router = express.Router();

router.post('/create', authMiddleware, create);
router.get('/getAll', authMiddleware, getAll);
router.put('/acceptChange/:id', authMiddleware, adminMiddleware, acceptChange);

module.exports = router;

