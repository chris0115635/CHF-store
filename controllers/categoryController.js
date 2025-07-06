const Category = require('../models/categoryModel');

// ✅ 前台 / 後台：取得分類列表
const getAllCategories = async (req, res) => {
  try {
    console.log("前台帶入 brand：", req.query.brand);
    // ✅ 前台用：網址帶 ?brand=shengxin
    if (req.query.brand) {
  console.log("✅ 前台帶入 brand：", req.query.brand);
  const categories = await Category.find({ owner: req.query.brand, isActive: true }).sort({ createdAt: -1 });
  console.log("✅ 找到的前台分類：", categories);
  return res.json(categories);
}

    // ✅ 後台用：token 解出來的 req.user.owner
    if (req.user?.owner) {
  console.log("✅ 後台用 owner 查詢分類：", req.user.owner);
  const categories = await Category.find({ owner: req.user.owner }).sort({ createdAt: -1 });
  console.log("✅ 找到的分類：", categories);
  return res.json(categories);
}

    // ❌ 前台沒帶 brand、後台也沒 token（req.user）就報錯
    return res.status(400).json({ message: '請提供品牌資訊' });

  } catch (err) {
    console.error('❌ 取得分類失敗：', err);
    res.status(500).json({ message: '無法取得分類列表' });
  }
};




// ✅ 後台：新增分類時自動綁定登入者的品牌 owner
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: '請輸入分類名稱' });

    const newCategory = new Category({
      name,
      isActive: true,
      owner: req.user.owner // ✅ 綁定品牌代稱（如 shengxin）
    });

    const saved = await newCategory.save();
    res.json(saved);
  } catch (err) {
    console.error('❌ 新增分類失敗：', err);
    res.status(500).json({ message: '無法新增分類' });
  }
};

// ✅ 修改分類（仍比對 owner 確保安全）
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const updated = await Category.findOneAndUpdate(
      { _id: id, owner: req.user.owner },
      { name, isActive },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: '找不到分類' });
    res.json(updated);
  } catch (err) {
    console.error('❌ 修改分類失敗：', err);
    res.status(500).json({ message: '無法修改分類' });
  }
};

// ✅ 刪除分類（同樣限制 owner）
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findOneAndDelete({ _id: id, owner: req.user.owner });

    if (!deleted) return res.status(404).json({ message: '找不到分類' });
    res.json({ message: '分類已刪除' });
  } catch (err) {
    console.error('❌ 刪除分類失敗：', err);
    res.status(500).json({ message: '無法刪除分類' });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};


