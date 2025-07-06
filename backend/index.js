console.log("✅ index.js 已經開始執行");

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // 讀取 .env 環境變數

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 中介設定（Middleware）
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); 
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); 

// ✅ 載入路由模組
const userRoutes = require('./routes/userRoutes');                    
const brandRoutes = require('./routes/brandRoutes');                  
const uploadBrandAssets = require('./routes/uploadBrandAssets');     
const categoryRoutes = require('./routes/categoryRoutes');            
const productRoutes = require('./routes/productRoutes');              
const uploadRoutes = require('./routes/uploadRoutes'); 
const orderRoutes = require('./routes/orderRoutes');

console.log('🧪 已載入所有 routes');

// ✅ 設定 API 路由（順序很重要）
app.use('/api/users', userRoutes);                    
app.use('/api/brand', brandRoutes);                   
app.use('/api/upload-brand-assets', uploadBrandAssets); 
app.use('/api/categories', categoryRoutes);           
app.use('/api/products', productRoutes);              
app.use('/api/upload', uploadRoutes); 
app.use('/api/orders', orderRoutes); 

// ✅ 連線 MongoDB 並啟動伺服器
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ 成功連接 MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ 無法連接 MongoDB', err);
  });

  