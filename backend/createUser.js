const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = 'yc16899@example.com';
    const rawPassword = '123123';
    const owner = 'shengxin';

    const user = new User({
      email,
      password: rawPassword, // ❌ 不加密！交給 userSchema.pre('save') 處理
      owner,
    });

    await user.save();
    console.log('✅ 帳號建立成功');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ 創建帳號時發生錯誤:', error);
  }
};

createUser();
