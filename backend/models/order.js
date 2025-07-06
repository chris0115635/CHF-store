const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: String, required: true }, // 品牌代稱
  items: [
    {
      productId: String,
      name: String,
      specs: Object,
      quantity: Number,
      price: Number
    }
  ],
  recipient: {
    name: String,
    phone: String,
    address: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
