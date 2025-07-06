document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('請先登入');
    window.location.href = './login.html';
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // ⬇️ 自動填入表單資料
  try {
    const res = await fetch('/api/brand/info', { headers });
    if (!res.ok) throw new Error('載入資料失敗');
    const data = await res.json();

    const setValue = (selector, value) => {
      const el = document.querySelector(selector);
      if (el) el.value = value || '';
    };
    const setChecked = (selector, value) => {
      const el = document.querySelector(selector);
      if (el) el.checked = !!value;
    };

    setValue('input[placeholder="輸入商店名稱"]', data.name);
    setValue('input[placeholder="用於 SEO 與搜尋顯示"]', data.siteName);
    setValue('input[placeholder="通知發送用 Email"]', data.email);
    setValue('input[placeholder="顯示於官網尾部"]', data.contactEmail);
    setValue('input[type="tel"]', data.phone);
    setValue('input[name="senderName"]', data.senderName);
    setValue('input[name="address"]', data.address);
    setValue('input[name="taxId"]', data.taxId);
    setValue('input[name="facebook"]', data.facebook);
    setValue('input[name="instagram"]', data.instagram);
    setValue('input[name="line"]', data.line);
    setValue('input[name="youtube"]', data.youtube);
    setValue('input[name="domain"]', data.domain);
    setValue('input[name="subdomain"]', data.subdomain);
    setValue('input[name="seoTitle"]', data.seoTitle);
    setValue('input[name="seoSubtitle"]', data.seoSubtitle);
    setValue('input[name="seoDesc"]', data.seoDesc);
    setValue('input[name="seoKeywords"]', data.seoKeywords);
    setValue('input[name="ogTitle"]', data.ogTitle);
    setValue('input[name="ogDesc"]', data.ogDesc);

    setChecked('input[name="showContactEmail"]', data.showContactEmail);
    setChecked('input[name="showPhone"]', data.showPhone);
    setChecked('input[name="showAddress"]', data.showAddress);
    setChecked('input[name="showTaxId"]', data.showTaxId);
    setChecked('input[name="enableAdultCheck"]', data.enableAdultCheck);
    setChecked('input[name="disableRightClick"]', data.disableRightClick);
    setChecked('input[name="showCookieNotice"]', data.showCookieNotice);

    // ⬇️ 圖片預覽
    if (data.faviconUrl) {
      document.querySelector('#faviconPreview').src = data.faviconUrl;
      document.querySelector('#faviconPreview').style.display = 'block';
    }
    if (data.ogImageUrl) {
      document.querySelector('#ogPreview').src = data.ogImageUrl;
      document.querySelector('#ogPreview').style.display = 'block';
    }
    if (data.logoUrl) {
      document.querySelector('#logoPreview').src = data.logoUrl;
      document.querySelector('#logoPreview').style.display = 'block';
    }
    if (data.bannerWideUrl) {
      document.querySelector('#bannerWidePreview').src = data.bannerWideUrl;
      document.querySelector('#bannerWidePreview').style.display = 'block';
    }
    if (data.bannerMobileUrl) {
      document.querySelector('#bannerMobilePreview').src = data.bannerMobileUrl;
      document.querySelector('#bannerMobilePreview').style.display = 'block';
    }
  } catch (err) {
    console.error('❌ 載入錯誤：', err);
  }

  // ⬆️ 圖片上傳
  const imageMap = {
    favicon: '#faviconPreview',
    ogImage: '#ogPreview',
    logo: '#logoPreview',
    bannerWide: '#bannerWidePreview',
    bannerMobile: '#bannerMobilePreview'
  };

  Object.keys(imageMap).forEach(field => {
    const input = document.querySelector(`input[name="${field}"]`);
    if (!input) return;

    input.addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        const img = document.querySelector(imageMap[field]);
        img.src = event.target.result;
        img.style.display = 'block';
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('field', field);

      try {
        const res = await fetch('/api/upload-brand-assets', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
        const result = await res.json();
        document.querySelector(imageMap[field]).src = result.url;
        input.setAttribute('data-url', result.url);
      } catch (err) {
        alert('圖片上傳失敗');
        console.error(err);
      }
    });
  });

  // 💾 儲存設定
  document.querySelector('.save-btn').addEventListener('click', async () => {
    const val = sel => document.querySelector(sel)?.value || '';
    const chk = sel => document.querySelector(sel)?.checked || false;
    const fileUrl = sel => document.querySelector(sel)?.getAttribute('data-url') || '';

    const body = {
      name: val('input[placeholder="輸入商店名稱"]'),
      siteName: val('input[placeholder="用於 SEO 與搜尋顯示"]'),
      email: val('input[placeholder="通知發送用 Email"]'),
      contactEmail: val('input[placeholder="顯示於官網尾部"]'),
      phone: val('input[type="tel"]'),
      senderName: val('input[name="senderName"]'),
      address: val('input[name="address"]'),
      taxId: val('input[name="taxId"]'),
      facebook: val('input[name="facebook"]'),
      instagram: val('input[name="instagram"]'),
      line: val('input[name="line"]'),
      youtube: val('input[name="youtube"]'),
      domain: val('input[name="domain"]'),
      subdomain: val('input[name="subdomain"]'),
      seoTitle: val('input[name="seoTitle"]'),
      seoSubtitle: val('input[name="seoSubtitle"]'),
      seoDesc: val('input[name="seoDesc"]'),
      seoKeywords: val('input[name="seoKeywords"]'),
      ogTitle: val('input[name="ogTitle"]'),
      ogDesc: val('input[name="ogDesc"]'),
      faviconUrl: fileUrl('input[name="favicon"]'),
      ogImageUrl: fileUrl('input[name="ogImage"]'),
      logoUrl: fileUrl('input[name="logo"]'),
      bannerWideUrl: fileUrl('input[name="bannerWide"]'),
      bannerMobileUrl: fileUrl('input[name="bannerMobile"]'),
      showContactEmail: chk('input[name="showContactEmail"]'),
      showPhone: chk('input[name="showPhone"]'),
      showAddress: chk('input[name="showAddress"]'),
      showTaxId: chk('input[name="showTaxId"]'),
      enableAdultCheck: chk('input[name="enableAdultCheck"]'),
      disableRightClick: chk('input[name="disableRightClick"]'),
      showCookieNotice: chk('input[name="showCookieNotice"]')
    };

    try {
      const res = await fetch('/api/brand/info', {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
      });
      const result = await res.json();
      alert(result.message || '設定已儲存');
    } catch (err) {
      alert('儲存失敗');
      console.error(err);
    }
  });
});




