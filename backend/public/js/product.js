document.addEventListener('DOMContentLoaded', () => {
console.log("▶️ 開始執行");

// 取得網址中的商品 ID
const productId = new URLSearchParams(window.location.search).get("id");
console.log("📦 商品 ID：", productId);

if (!productId) {
  alert("找不到商品 ID");
  throw new Error("找不到商品 ID");
}
// ✅ 點購物車圖示 → 跳轉到購物車頁面
document.querySelector('.material-icons.shopping_cart')?.addEventListener('click', () => {
  const brand = window.location.pathname.split("/")[1];
  location.href = `/${brand}/cart.html`;
});
// ✅ 正確 API：前台專用，無需登入
fetch(`/api/products/public/${productId}`)
  .then((res) => {
    if (!res.ok) throw new Error("商品資料錯誤");
    return res.json();
  })
  .then((data) => {
    console.log("🧪 商品資料：", data);

    // 確保data是正確的
    if (!data || !data.name || !data.price) {
      alert("商品資料錯誤，請稍後再試");
      throw new Error("商品資料錯誤");
    }

    // 商品名稱與價格
    document.getElementById("productName").textContent = data.name || "未命名商品";
    const priceElement = document.getElementById("productPrice");
    

let priceText = `NT$${data.price}（含運!!）`;
if (data.originalPrice && data.originalPrice > data.price) {
  priceText = `<del>NT$${data.originalPrice}</del> → <strong>${priceText}</strong>`;
}
priceElement.innerHTML = priceText;
// 商品說明
    document.getElementById("productDescription").innerHTML = data.description || "";
    // 商品主圖與縮圖處理
    const images = data.images || [];
    const mainImage = images[0] || "/uploads/no-image.png";
    const mainImageEl = document.getElementById("mainImage");
    if (mainImageEl) mainImageEl.src = mainImage;

    const thumbnailContainer = document.getElementById("thumbnailContainer");
    if (thumbnailContainer) {
      thumbnailContainer.innerHTML = images
        .map((img) => `<img src="${img}" class="thumbnail" style="width:80px;height:auto;">`)
        .join("");

      // 點擊縮圖切換主圖
      thumbnailContainer.querySelectorAll(".thumbnail").forEach((thumb) => {
        thumb.addEventListener("click", () => {
          mainImageEl.src = thumb.src;
        });
      });
    }

    // 商品規格處理（顏色/尺碼）
    const specsDiv = document.getElementById("productSpecs");
    if (specsDiv && data.specs) {
      specsDiv.innerHTML = data.specs
        .map((spec) => {
          const options = spec.options
  .map((opt) => `<button class="spec-option">${opt}</button>`)
  .join("");

return `
  <div class="spec-group" data-name="${spec.name}">
    <strong>${spec.name}：</strong>
    <div class="spec-options">
      ${options}
    </div>
  </div>
`;
        })
        .join("");

      // ✅ 加入點擊事件讓每組只能選一個
      document.querySelectorAll('.spec-group').forEach(group => {
        const buttons = group.querySelectorAll('.spec-option');

        buttons.forEach(button => {
          button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
          });
        });
      });
    }
  })
  .catch((err) => {
    console.error("❌ 商品載入失敗：", err);
    alert("商品載入失敗，請稍後再試");
  });

// ✅ 加入購物車按鈕點擊事件
const addToCartBtn = document.querySelector('.add-to-cart-btn');
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', () => {
  const selectedSpecs = {};
  document.querySelectorAll('.spec-group').forEach(group => {
    const title = group.dataset.name;
    const activeBtn = group.querySelector('.spec-option.active');
    if (activeBtn) {
      selectedSpecs[title] = activeBtn.textContent;
    }
    console.log("📦 加入後 cart =", JSON.parse(localStorage.getItem('cart')));
  });

  // 檢查是否所有規格都有選
  if (Object.keys(selectedSpecs).length < document.querySelectorAll('.spec-group').length) {
    alert('請選擇所有規格再加入購物車');
    return;
  }

  // 讀取當前 cart
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // 建立要加入的商品物件
  const productToAdd = {
    id: productId,
    name: document.getElementById('productName').textContent,
    price: parseInt(document.getElementById('productPrice').textContent.replace('NT$', '')),
    image: document.getElementById('mainImage').src,
    specs: selectedSpecs,
    quantity: 1
  };

  // 檢查購物車內是否已有相同商品＋相同規格
  const existing = cart.find(item =>
    item.id === productToAdd.id &&
    JSON.stringify(item.specs) === JSON.stringify(productToAdd.specs)
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(productToAdd);
  }

  // 存回 localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  console.log("🛒 商品已加入購物車：", productToAdd);
  alert('✅ 商品已加入購物車');
});

}

// ✅ 左側選單功能
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sideMenu").classList.add("open");
});
document.getElementById("closeMenu").addEventListener("click", () => {
  document.getElementById("sideMenu").classList.remove("open");
});

// ✅ 載入分類（放這頁也要）
const brand = window.location.pathname.split("/")[1];
fetch(`/api/categories?brand=${brand}`)
  .then((res) => res.json())
  .then((categories) => {
    const list = document.getElementById("categoryList");
    const nav = document.getElementById("desktopCategoryBar");
    if (!list || !nav) return;

    list.innerHTML = "";
    nav.innerHTML = "";

    categories.forEach((cat) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="/${brand}/categories.html?cat=${cat.name}">${cat.name}</a>`;
      list.appendChild(li);

      const link = document.createElement("a");
      link.href = `/${brand}/categories.html?cat=${cat.name}`;
      link.textContent = cat.name;
      nav.appendChild(link);
    });
  })
  .catch((err) => {
    console.error("❌ 載入分類失敗", err);
  });

// ✅ 手機選單開關
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('sideMenu').classList.add('open');
});
document.getElementById('closeMenu').addEventListener('click', () => {
  document.getElementById('sideMenu').classList.remove('open');
});
});