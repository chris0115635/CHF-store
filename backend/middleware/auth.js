const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const verifyToken = async function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '缺少登入驗證' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('🧪 decoded 是：', decoded);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: '無效的使用者' });

    // ✅ 只附帶必要資料
    req.user = {
      id: user._id,
      email: user.email,
      owner: user.owner // 🔥 重點
    };

    next();
  } catch (err) {
    console.error('❌ 驗證失敗:', err);
    res.status(401).json({ message: '驗證失敗' });
  }
};

module.exports = { verifyToken };

