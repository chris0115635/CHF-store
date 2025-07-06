const Product = require('../models/product');

// ✅ 前台 or 後台：取得商品列表
const getAllProducts = async (req, res) => {
  try {
    // 官網前台傳入 brand=xxx 時（例如 ?brand=shengxin）
    if (req.query.brand) {
      const brand = req.query.brand;
      const products = await Product.find({ owner: brand, isActive: true }).sort({ createdAt: -1 });
      return res.json({ products });
    }

    // 後台登入使用者
    if (req.user?.owner) {
      const products = await Product.find({ owner: req.user.owner }).sort({ createdAt: -1 });
      return res.json({ products });
    }

    // ❌ 都沒提供就回錯
    return res.status(400).json({ message: '請提供品牌資訊（brand 或登入）' });
  } catch (err) {
    console.error('❌ 無法取得商品：', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// ✅ 前台專用：只要 brand，不檢查登入
const getAllPublicProducts = async (req, res) => {
  try {
    const brand = req.query.brand;
    if (!brand) return res.status(400).json({ message: '缺少 brand 參數' });

    const products = await Product.find({ owner: brand, isActive: true }).sort({ createdAt: -1 }).lean();
    res.json(products); // ✅ 直接回傳陣列
  } catch (err) {
    console.error('❌ 取得前台商品錯誤', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// ✅ 取得單一商品（後台編輯用）
const getOneProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user.owner,
    });
    if (!product) return res.status(404).json({ message: '商品不存在' });
    res.json({ product });
  } catch (err) {
    console.error('❌ 取得單一商品失敗：', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};
// ✅ 前台用：不需登入的查詢單一商品
const getPublicProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    }).lean();

    if (!product) return res.status(404).json({ message: '找不到商品' });
    res.json(product); // ✅ 回傳商品物件
  } catch (err) {
    console.error('❌ 前台查詢單一商品錯誤：', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};


// ✅ 後台新增商品
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      categories,
      images,
      specs,
      isNew,
      isActive,
    } = req.body;

    const product = new Product({
      name,
      price: Number(price),
      originalPrice: Number(originalPrice) || 0,
      categories,
      images,
      specs,
      isNew,
      isActive,
      owner: req.user.owner,
    });

    await product.save();
    res.json({ message: '✅ 商品新增成功', product });
  } catch (err) {
    console.error('❌ 新增商品錯誤：', err);
    res.status(500).json({ message: '新增失敗' });
  }
};


// ✅ 後台更新商品
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      categories,
      images,
      specs,
      isNew,
      isActive,
    } = req.body;

    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.owner },
      {
        name,
        price: Number(price),
        originalPrice: Number(originalPrice) || 0,
        categories,
        images,
        specs,
        isNew,
        isActive,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: '找不到商品' });
    res.json({ message: '✅ 更新成功', product: updated });
  } catch (err) {
    console.error('❌ 更新商品錯誤：', err);
    res.status(500).json({ message: '更新失敗' });
  }
};


// ✅ 後台刪除商品
const deleteProduct = async (req, res) => {
  try {
    const result = await Product.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.owner,
    });
    if (!result) return res.status(404).json({ message: '商品不存在' });
    res.json({ message: '✅ 刪除成功' });
  } catch (err) {
    console.error('❌ 刪除商品錯誤：', err);
    res.status(500).json({ message: '刪除失敗' });
  }
};

module.exports = {
  getAllProducts,
  getAllPublicProducts, // ✅ 加在這裡
  getOneProduct,
  getPublicProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
