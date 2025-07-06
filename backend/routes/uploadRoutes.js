const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 建立 uploads 資料夾（若尚未存在）
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 設定 multer 儲存位置與檔名
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E6)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ 圖片上傳 API（支援多圖）
router.post('/', upload.array('images', 10), (req, res) => {
  try {
    const urls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ urls });
  } catch (err) {
    console.error('❌ 上傳錯誤:', err);
    res.status(500).json({ message: '圖片上傳失敗' });
  }
});

module.exports = router;
