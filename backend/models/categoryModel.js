// models/categoryModel.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  owner: {
    type: String, // 直接存品牌識別（例如 'shengxin'）
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
