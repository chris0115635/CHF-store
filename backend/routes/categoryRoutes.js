// ✅ categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { verifyToken } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/optionalAuth');

// ✅ 支援前台與後台（用 optionalAuth）
router.get('/', optionalAuth, getAllCategories);
router.post('/', verifyToken, createCategory);
router.put('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

module.exports = router;
