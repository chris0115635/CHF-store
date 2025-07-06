const token = localStorage.getItem("token");
const apiUrl = "/api/products";
let currentPage = 1;
const itemsPerPage = 15;
let categoryMap = {}; // 用來對照分類 id → 名稱

async function fetchCategories() {
  const brand = localStorage.getItem("brand");
  console.log("🧪 準備查詢的品牌是：", brand);
  try {
    const res = await fetch(`/api/categories?brand=${brand}`, {
      headers: {
     Authorization: `Bearer ${token}`
      }
      });
    let data = await res.json();
    console.log("🧪 抓到的分類原始資料：", data); // ✅ 加上這行 log 看有沒有資料

    if (!Array.isArray(data)) {
      console.error("❌ 後端回傳不是陣列：", data);
      data = [];
    }

    const map = {};
    for (const c of data) {
      map[c._id] = c.name;
    }
    categoryMap = map;
    console.log("🧪 對照表 categoryMap：", categoryMap);
  } catch (err) {
    console.error("❌ 無法載入分類資料", err);
    categoryMap = {};
  }
}

async function fetchProducts() {
  try {
    const res = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log("✅ 回傳的產品資料是：", data);
    return data.products || [];
  } catch (err) {
    console.error("❌ 無法載入商品資料", err);
    return [];
  }
}

function renderTable(products) {
  const tbody = document.getElementById("productTableBody");
  tbody.innerHTML = "";

  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = products.slice(startIdx, startIdx + itemsPerPage);

  for (let product of paginated) {
    const row = document.createElement("tr");

    let rawImg = product.images?.[0] || "";
    rawImg = rawImg.replace(/^\/?(uploads\/)?/, "");
    const imgUrl = `/uploads/${rawImg}`;

    const categories = (product.categories || [])
      .map(id => categoryMap[id] || id)
      .join(", ");

    const specs = Array.isArray(product.specs)
      ? product.specs
          .filter(spec => spec?.name && Array.isArray(spec.options))
          .map(spec => `${spec.name}：${spec.options.join("、")}`)
          .join("｜")
      : "";

     row.innerHTML = `
      <td><img src="${imgUrl}" style="width:60px;height:auto;"></td>
      <td>${product.name}</td>
      <td>
      ${
  product.originalPrice > 0
    ? `<del>$${product.originalPrice}</del><br><strong>$${product.price}</strong>`
    : `<strong>$${product.price}</strong>`
}
</td>

      <td>${specs}</td>
      <td>${categories}</td>
      <td>${product.isNew ? "是" : "否"}</td>
      <td>
        <input type="checkbox" ${product.isActive ? "checked" : ""} onchange="toggleActive('${product._id}', this.checked)">
      </td>
      <td>
        <button onclick="editProduct('${product._id}')">編輯</button>
        <button onclick="deleteProduct('${product._id}')">刪除</button>
      </td>
     `;
      tbody.appendChild(row);
       }

     renderPagination(products.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.disabled = true;
    btn.onclick = () => {
      currentPage = i;
      loadAndRender();
    };
    container.appendChild(btn);
  }
}

async function toggleActive(productId, isActive) {
  try {
    await fetch(`${apiUrl}/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive }),
    });
  } catch (err) {
    console.error("❌ 切換上架狀態失敗", err);
  }
}

function editProduct(id) {
  window.location.href = `/shengxin/admin/admin_add.html?id=${id}`;
}

async function deleteProduct(id) {
  if (!confirm("確定要刪除這個商品嗎？")) return;
  try {
    await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadAndRender();
  } catch (err) {
    console.error("❌ 刪除商品失敗", err);
  }
}

function searchProducts() {
  const keyword = document.getElementById("searchInput").value.trim();
  loadAndRender(keyword);
}

async function loadAndRender(keyword = "") {
  await fetchCategories();
  const products = await fetchProducts();

  const filtered = keyword
    ? products.filter(p => String(p.name || "").includes(keyword))
    : products;

  renderTable(filtered);
}

document.addEventListener("DOMContentLoaded", loadAndRender);
