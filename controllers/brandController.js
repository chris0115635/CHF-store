const Brand = require('../models/brand');

// ✅ 取得品牌資訊（後台與前台共用）
exports.getBrandInfo = async (req, res) => {
  try {
    console.log('🧪 controller 收到的 req.user：', req.user);

    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: '無法辨識使用者，請重新登入' });
    }

    const brand = await Brand.findOne({ owner: req.user._id });

    if (!brand) {
      return res.status(404).json({ message: '找不到品牌資訊' });
    }

    res.json(brand);
  } catch (err) {
    console.error('❌ getBrandInfo 發生錯誤：', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// ✅ 更新品牌資訊（後台儲存設定）
exports.updateBrandInfo = async (req, res) => {
  try {
    console.log('🧪 update 收到的 req.user：', req.user);

    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: '無法辨識使用者，請重新登入' });
    }

    const updated = await Brand.findOneAndUpdate(
      { owner: req.user._id },
      req.body,
      { new: true, upsert: true }
    );

    res.json({ message: '設定已儲存', data: updated });
  } catch (err) {
    console.error('❌ updateBrandInfo 發生錯誤：', err);
    res.status(500).json({ message: '儲存失敗' });
  }
};



