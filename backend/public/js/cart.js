(() => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const cartItemsContainer = document.getElementById('cartItems');
  const totalPriceElement = document.getElementById('totalPrice');

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function renderCart() {
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>目前購物車沒有商品。</p>';
      totalPriceElement.textContent = 'NT$0';
      return;
    }

    cart.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('cart-item');
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width:100px;height:auto;">
        <div>
          <h3>${item.name}</h3>
          <p>NT$${item.price}</p>
          <div>
            <button class="decrease" data-id="${item.id}">-</button>
            <span>數量：${item.quantity}</span>
            <button class="increase" data-id="${item.id}">+</button>
          </div>
          <button class="remove" data-id="${item.id}">移除</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
      totalPrice += item.price * item.quantity;
    });

    totalPriceElement.textContent = `NT$${totalPrice}`;
  }

  // 數量 +1
  cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('increase')) {
      const id = e.target.dataset.id;
      const item = cart.find(i => i.id === id);
      if (item) {
        item.quantity++;
        saveCart();
        renderCart();
      }
    }
  });

  // 數量 -1
  cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('decrease')) {
      const id = e.target.dataset.id;
      const item = cart.find(i => i.id === id);
      if (item && item.quantity > 1) {
        item.quantity--;
        saveCart();
        renderCart();
      }
    }
  });

  // 移除項目
  cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove')) {
      const id = e.target.dataset.id;
      cart = cart.filter(i => i.id !== id);
      saveCart();
      renderCart();
    }
  });

  // 清空購物車
  document.getElementById('clearCartBtn').addEventListener('click', () => {
    cart = [];
    saveCart();
    renderCart();
  });

  // 結帳處理
  document.getElementById("checkoutBtn").addEventListener("click", () => {
  const token = localStorage.getItem("memberToken");
  if (!token) {
    alert("請先登入才能結帳！");
    window.location.href = "/shengxin/login.html";
  } else {
    window.location.href = "/shengxin/checkout.html"; // ✅ 要導向這裡
  }
});


  // 初次載入
  renderCart();
})();

