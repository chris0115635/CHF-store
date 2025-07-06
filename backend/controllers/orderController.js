const Order = require('../models/order');

// controllers/orderController.js
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ 從 token 解出來的使用者 ID
    const owner = req.user.owner;
    const order = new Order({
      user: userId,
      owner: owner,                      // ✅ 填入 user 欄位
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      items: req.body.items,
      total: req.body.total,
      status: '待付款',
      createdAt: new Date(),
    });

    await order.save();

    res.json({
      message: '訂單建立成功',
      orderId: order._id,
      bankCode: '822',
      accountNumber: '050-01112057249',
    });
  } catch (err) {
    console.error('❌ 建立訂單失敗：', err);
    res.status(500).json({ message: '建立訂單失敗' });
  }
};

