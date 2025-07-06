// routes/exampleRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getAllExamples,
  createExample,
  updateExample,
  deleteExample
} = require('../controllers/exampleController');

// 取得所有資料
router.get('/', verifyToken, getAllExamples);

// 新增資料
router.post('/', verifyToken, createExample);

// 更新資料
router.put('/:id', verifyToken, updateExample);

// 刪除資料
router.delete('/:id', verifyToken, deleteExample);

module.exports = router;
