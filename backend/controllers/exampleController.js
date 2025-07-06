// controllers/exampleController.js
const Example = require('../models/ExampleModel');

// ✅ 取得列表
const getAllExamples = async (req, res) => {
  try {
    const list = await Example.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error('❌ 取得失敗：', err);
    res.status(500).json({ message: '無法取得資料' });
  }
};

// ✅ 新增
const createExample = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: '請輸入名稱' });

    const created = new Example({
      name,
      isActive: true,
      owner: req.user._id
    });
    const saved = await created.save();
    res.json(saved);
  } catch (err) {
    console.error('❌ 新增失敗：', err);
    res.status(500).json({ message: '無法新增資料' });
  }
};

// ✅ 更新
const updateExample = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const updated = await Example.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { name, isActive },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: '找不到資料' });
    res.json(updated);
  } catch (err) {
    console.error('❌ 更新失敗：', err);
    res.status(500).json({ message: '無法更新資料' });
  }
};

// ✅ 刪除
const deleteExample = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Example.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!deleted) return res.status(404).json({ message: '找不到資料' });
    res.json({ message: '已刪除' });
  } catch (err) {
    console.error('❌ 刪除失敗：', err);
    res.status(500).json({ message: '無法刪除資料' });
  }
};

module.exports = {
  getAllExamples,
  createExample,
  updateExample,
  deleteExample
};
