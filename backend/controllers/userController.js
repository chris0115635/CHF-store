const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Brand = require('../models/brand');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: '帳號不存在' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: '密碼錯誤' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    console.error('登入錯誤：', err);
    res.status(500).json({ error: '登入失敗' });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, owner } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email 已被使用' });

    const newUser = new User({ email, password, owner });
    await newUser.save();

    res.status(201).json({ message: '註冊成功' });
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: '找不到此帳號' });

    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30m' });
    const resetLink = `http://localhost:3000/reset-password.html?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: 'CHF Admin <no-reply@chf.com>',
      to: email,
      subject: '重設您的密碼',
      html: `<p>請點擊以下連結以重設密碼：</p><a href="${resetLink}">${resetLink}</a>`
    });

    res.json({ message: '已寄出密碼重設連結' });
  } catch (err) {
    console.error('忘記密碼錯誤：', err);
    res.status(500).json({ error: '處理失敗' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: '找不到使用者' });

    user.password = newPassword;
    await user.save();
    res.json({ message: '密碼已更新' });
  } catch (err) {
    console.error('重設密碼錯誤：', err);
    res.status(400).json({ error: '連結已失效或無效' });
  }
};

exports.uploadBrandAssets = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;
    const field = req.body.field;

    if (!file || !field) {
      return res.status(400).json({ message: '缺少圖片或欄位名稱' });
    }

    const imageUrl = `/uploads/${file.filename}`;

    const brand = await Brand.findOneAndUpdate(
      { owner: userId },
      { [field + 'Url']: imageUrl },
      { new: true }
    );

    if (!brand) {
      return res.status(404).json({ message: '找不到品牌資料' });
    }

    res.json({ message: '圖片已更新', url: imageUrl });
  } catch (err) {
    console.error('❌ 圖片上傳失敗:', err);
    res.status(500).json({ message: '圖片處理錯誤' });
  }
};

exports.getPublicBrandInfo = async (req, res) => {
  try {
    const { brand } = req.query;
    if (!brand) return res.status(400).json({ message: '缺少 brand 參數' });

    const user = await require('../models/user').findOne({ email: brand });
    if (!user) return res.status(404).json({ message: '找不到對應使用者' });

    const data = await Brand.findOne({ owner: user._id }).lean();
    if (!data) return res.status(404).json({ message: '找不到品牌資料' });

    res.json(data);
  } catch (err) {
    console.error('❌ 取得品牌資料錯誤：', err);
    res.status(500).json({ message: '無法取得品牌資料' });
  }
};

