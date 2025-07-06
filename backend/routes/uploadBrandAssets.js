// routes/uploadBrandAssets.js ✅ 正確版本
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyToken } = require('../middleware/auth');
const userController = require('../controllers/userController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ✅ 上傳圖片 API：支援 favicon、logo、banner 等圖片
router.post('/', verifyToken, upload.single('image'), userController.uploadBrandAssets);

module.exports = router;


