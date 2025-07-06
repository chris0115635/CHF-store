const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/optionalAuth'); // ✅ 要記得引入

// ✅ 測試用
router.get('/ping', (req, res) => {
  res.send('✅ products route 正常');
});

// ✅ 前台專用：不需登入，根據品牌名稱取得商品
router.get('/public', productController.getAllPublicProducts);

// ✅ 前台與後台通用查詢：使用 optionalAuth（後台登入才會觸發 req.user）
router.get('/', optionalAuth, productController.getAllProducts);

// ✅ 後台：需登入
router.get('/:id', verifyToken, productController.getOneProduct);
router.post('/', verifyToken, productController.createProduct);
router.put('/:id', verifyToken, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);
// ✅ 前台專用：根據 ID 查詢單一商品（不需登入）
router.get('/public/:id', productController.getPublicProductById);

module.exports = router;
