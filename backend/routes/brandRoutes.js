const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { verifyToken } = require('../middleware/auth');

// ✅ 後台用：取得與儲存品牌資料
router.get('/info', verifyToken, brandController.getBrandInfo);
router.put('/info', verifyToken, brandController.updateBrandInfo); 

module.exports = router;
