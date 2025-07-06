const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');  // ✅ 驗證 token

// ✅ 註冊（就是這個你缺了）
router.post('/register', userController.register);

// ✅ 登入
router.post('/login', userController.login);

// ✅ 忘記密碼
router.post('/forgot-password', userController.forgotPassword);

// ✅ 重設密碼
router.post('/reset-password/:token', userController.resetPassword);

// ✅ 上傳品牌圖片（favicon、LOGO、banner...）
router.post('/upload-brand-assets', verifyToken, upload.single('image'), userController.uploadBrandAssets);

// ✅ 供前台使用的品牌資料查詢
router.get('/public-brand-info', verifyToken, userController.getPublicBrandInfo);
router.get('/brand/info', verifyToken, userController.getPublicBrandInfo);

module.exports = router;



