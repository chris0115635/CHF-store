const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 沒有 token，繼續走（不設 req.user）
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user) {
      req.user = user; // ⬅️ 存進 req.user
    }

    next(); // ✅ 一定要執行！
  } catch (err) {
    console.error("optionalAuth token 錯誤", err);
    next(); // ❗即使 token 無效，也繼續往下走，交給 controller 判斷
  }
};

module.exports = { optionalAuth };

