console.log("✅ index.js 已經開始執行");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config(); // ✅ 讀取 .env 環境變數

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // 靜態檔案
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ✅ 回傳首頁 index.html（修正 Cannot GET /）
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ 載入所有 routes
const userRoutes = require("./routes/userRoutes");
const brandRoutes = require("./routes/brandRoutes");
const uploadBrandAssets = require("./routes/uploadBrandAssets");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const orderRoutes = require("./routes/orderRoutes");

console.log("🧪 已載入所有 routes");

// ✅ 設定 API 路由
app.use("/api/users", userRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/upload-brand-assets", uploadBrandAssets);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

// ✅ 連線資料庫 + 啟動 server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ 成功連接 MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ 無法連接 MongoDB", err);
  });

  