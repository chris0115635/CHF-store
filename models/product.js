const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
    originalPrice: {
    type: Number,
    required: false,
  },
  images: {
    type: [String], // 圖片網址陣列
    default: [],
  },
  isNew: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  categories: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Category',
}],
  specs: [
    {
      name: String,
      options: [String]
    }
  ],
  owner: {
    type: String, // 所屬品牌識別（如 shengxin）
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
