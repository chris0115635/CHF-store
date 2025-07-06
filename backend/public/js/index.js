// ✅ 開關手機側欄選單
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('sideMenu').classList.add('open');
});

document.getElementById('closeMenu').addEventListener('click', () => {
  document.getElementById('sideMenu').classList.remove('open');
});

// ✅ 取得品牌代稱（網址中的 shengxin）
const brand = window.location.pathname.split('/')[1];

// ✅ 載入分類
fetch(`/api/categories?brand=${brand}`)
  .then(res => {
    if (!res.ok) throw new Error(`API 回傳錯誤: ${res.status}`);
    return res.json();
  })
  .then(data => {
    renderCategories(data);
  })
  .catch(err => {
    console.error('載入分類失敗:', err);
  });

// ✅ 渲染分類到桌機與手機前台
function renderCategories(categories) {
  const desktopList = document.getElementById('desktopCategoryBar');
  const mobileList = document.getElementById('categoryList');

  desktopList.innerHTML = '';
  mobileList.innerHTML = '';

  categories.forEach(cat => {
    if (!cat.isActive) return;

    const categoryLink = `/shengxin/categories.html?cat=${encodeURIComponent(cat.name)}`;

    // 桌機分類（<a>）
    const a = document.createElement('a');
    a.href = categoryLink;
    a.textContent = cat.name;
    desktopList.appendChild(a);

    // 手機分類（<li>）
    const li = document.createElement('li');
    li.textContent = cat.name;
    li.onclick = () => location.href = categoryLink;
    mobileList.appendChild(li);
  });
}
// ✅ 點擊購物車 → 跳轉購物車頁面
document.querySelector('.shopping_cart').addEventListener('click', () => {
  const brand = window.location.pathname.split('/')[1]; // 取得品牌資料夾名稱
  window.location.href = `/${brand}/cart.html`;
});

