const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// ✅ 這邊要確認是 `orderController.createOrder`，不是 `orderController()` 或 `undefined`
router.post('/', verifyToken, orderController.createOrder);

module.exports = router;
