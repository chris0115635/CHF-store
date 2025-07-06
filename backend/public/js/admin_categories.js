document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  console.log('🧪 token =', token);

  if (!token) {
    alert('請先登入');
    window.location.href = '/reina/admin/login.html';
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // ✅ 載入分類
  async function loadCategories() {
    try {
      const res = await fetch('/api/categories', {
      method: 'GET',
      headers
      });
      const data = await res.json();

      if (!Array.isArray(data)) {
      console.error('⚠️ 後端回傳非陣列：', data);
      alert(data.message || '載入分類失敗，請重新登入');
      return;
      }


      const tbody = document.getElementById('categoryTableBody');
      tbody.innerHTML = '';

      data.forEach(category => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${category.name}</td>
          <td>${category.isActive ? '啟用' : '停用'}</td>
          <td>${new Date(category.createdAt).toLocaleString()}</td>
          <td class="actions">
            <button onclick="toggleCategory('${category._id}', ${category.isActive})">
              ${category.isActive ? '停用' : '啟用'}
            </button>
            <button onclick="deleteCategory('${category._id}')">刪除</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error('❌ 載入分類失敗', err);
    }
  }

  // ✅ 新增分類（全域綁定給 HTML）
  window.addCategory = async function () {
    const name = document.getElementById('newCategoryName').value.trim();
    if (!name) return alert('請輸入分類名稱');

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name })
      });
      const result = await res.json();
      alert(result.message || '新增成功');
      document.getElementById('newCategoryName').value = '';
      loadCategories();
    } catch (err) {
      alert('新增失敗');
      console.error(err);
    }
  };

  // ✅ 啟用/停用分類
  window.toggleCategory = async function (id, currentStatus) {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const result = await res.json();
      alert(result.message || '已更新');
      await loadCategories();
    } catch (err) {
      alert('更新失敗');
      console.error(err);
    }
  };

  // ✅ 刪除分類
  window.deleteCategory = async function (id) {
    if (!confirm('確定要刪除嗎？')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers
      });
      const result = await res.json();
      alert(result.message || '已刪除');
      loadCategories();
    } catch (err) {
      alert('刪除失敗');
      console.error(err);
    }
  };

  // 🚀 頁面載入時先呼叫
  loadCategories();
});
