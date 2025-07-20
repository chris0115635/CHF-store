// ✅ admin_add.js：支援圖片上傳、商品儲存與規格新增

const token = localStorage.getItem("token");
if (!token) {
  alert("請先登入");
  window.location.href = "/shengxin/admin/login.html";
}

const categoryList = document.getElementById("categoryList");
const form = document.getElementById("productForm");
const imageInput = document.getElementById("imageFiles");
const preview = document.getElementById("imagePreview");
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

let uploadedImageUrls = [];

// ✅ 載入分類清單
async function loadCategories(selected = []) {
  try {
    const res = await fetch("/api/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log("🧪 載入分類結果：", data);
    categoryList.innerHTML = "分類：<br/>";
    data.forEach(cat => {
  const checked = selected.includes(String(cat._id)) ? "checked" : "";
  categoryList.innerHTML += `
    <label>
      <input type="checkbox" value="${cat._id}" ${checked} />
      ${cat.name}
    </label><br/>
  `;
});

  } catch (err) {
    console.error("❌ 載入分類失敗", err);
  }
}

// ✅ 預覽圖片
imageInput.addEventListener("change", () => {
  preview.innerHTML = "";
  Array.from(imageInput.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.height = "80px";
      img.style.marginRight = "10px";
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// ✅ 載入編輯商品資料
async function loadProduct() {
  try {
    const res = await fetch(`/api/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const p = data.product;
    document.getElementById("name").value = p.name;
    document.getElementById("price").value = p.price;
    document.getElementById("originalPrice").value = p.originalPrice || "";
    document.getElementById("isNew").checked = p.isNew;
    document.getElementById("isActive").checked = p.isActive;
    document.getElementById("description").value = p.description || "";
    uploadedImageUrls = p.images || [];

    const selectedCategoryIds = (p.categories || []).map(c => c._id || c);
    await loadCategories(selectedCategoryIds);


    // ✅ 載入規格
    if (p.specs) {
      p.specs.forEach(spec => {
        const specDiv = document.createElement("div");
        specDiv.innerHTML = `<strong>${spec.name}</strong>: ${spec.options.join(', ')}`;
        specDiv.dataset.name = spec.name;
        specDiv.dataset.options = JSON.stringify(spec.options);
        document.getElementById("specsContainer").appendChild(specDiv);
      });
    }
  } catch (err) {
    console.error("❌ 載入商品失敗", err);
  }
}

// ✅ 圖片上傳函式
async function uploadImages() {
  const files = imageInput.files;
  if (!files.length) return uploadedImageUrls;

  const formData = new FormData();
  for (let file of files) formData.append("images", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error("圖片上傳失敗");

  const data = await res.json();
  return data.urls;
}

// ✅ 表單提交
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = Number(document.getElementById("price").value);
  const isNew = document.getElementById("isNew").checked;
  const isActive = document.getElementById("isActive").checked;
  const originalPriceInput = document.getElementById("originalPrice").value.trim();
let originalPrice;
if (originalPriceInput !== "") {
  originalPrice = Number(originalPriceInput);
}


  const selectedCategories = Array.from(
    categoryList.querySelectorAll("input:checked")
  ).map(input => input.value);

  // ✅ 收集規格資料
  const specs = Array.from(document.querySelectorAll('#specsContainer div')).map(div => ({
    name: div.dataset.name,
    options: JSON.parse(div.dataset.options)
  }));

  try {
    const newImages = await uploadImages();
const images = newImages.length > 0 ? newImages : uploadedImageUrls; // ✅ 用舊的圖（編輯時）
const description = document.getElementById("description").value.trim();

const body = {
  name,
  price,
  isNew,
  isActive,
  categories: selectedCategories,
  images,
  specs,
  description,
};

if (originalPrice !== undefined) {
  body.originalPrice = originalPrice;
}
console.log("🧪 送出的資料：", body);
    const method = productId ? "PUT" : "POST";
    const url = productId ? `/api/products/${productId}` : "/api/products";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert("✅ 商品儲存成功！");
      const brand = window.location.pathname.split("/")[1]; // ⬅️ 品牌自動判斷
       window.location.href = `/${brand}/admin/admin_products.html`;
       }    
       else {
      const err = await res.json();
      alert("❌ 儲存失敗：" + err.message);
    }
  } catch (err) {
    console.error("❌ 提交錯誤", err);
    alert("❌ 發生錯誤，請稍後再試");
  }
});

// ✅ 初始化
if (productId) {
  loadProduct();
} else {
  loadCategories();
}
function addSpec() {
  const name = document.getElementById('newSpecName').value.trim();
  const options = document.getElementById('newSpecOptions').value.trim().split(',').map(opt => opt.trim()).filter(Boolean);

  if (!name || options.length === 0) return alert("請輸入完整的規格名稱與選項");

  const specDiv = document.createElement('div');
  specDiv.innerHTML = `<strong>${name}</strong>: ${options.join(', ')}`;
  specDiv.dataset.name = name;
  specDiv.dataset.options = JSON.stringify(options);
  document.getElementById('specsContainer').appendChild(specDiv);

  document.getElementById('newSpecName').value = '';
  document.getElementById('newSpecOptions').value = '';
}
