// Consolidated script.js — cleaned version
// Features: smooth scroll, carousel, products data, filter panel (type/category/manufacturer/price), cart modal, product modal, auth UI

// Smooth scroll navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerEl = document.querySelector('.header');
      const headerHeight = headerEl ? headerEl.offsetHeight : 0;
      const targetPosition = target.offsetTop - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});
// Simple carousel (only if slides exist)
(function initCarousel() {
  const dots = document.querySelectorAll('.dot');
  const slides = document.querySelectorAll('.carousel-slide');
  if (!dots.length || !slides.length) return;
  let current = 0;
  function show(i) {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    current = i;
  }
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  setInterval(() => show((current + 1) % slides.length), 5000);
})();

let products = [
  { id: 1, name: 'Gaming PC belissimo', priceUSD: 799, image: 'gaming-pc', type: 'desktop', category: 'gaming', manufacturer: 'PC Company', description: 'Збалансований ігровий ПК для сучасних ігор на високих налаштуваннях у 1080p. Оптимальний вибір для геймерів-початківців.', specs: ['🖥️ Intel Core i5', '🎮 RTX 3060', '💾 16GB RAM', '💽 512GB SSD'] },
  { id: 2, name: 'Gaming PC Inferno', priceUSD: 999, image: 'gaming-pc', type: 'desktop', category: 'gaming', manufacturer: 'PC Company', description: 'Продуктивний комп\'ютер, який легко впорається з будь-якими сучасними проектами завдяки потужній відеокарті RTX 40 серії.', specs: ['🖥️ AMD Ryzen 5', '🎮 RTX 4060', '💾 16GB RAM', '💽 1TB M.2 SSD'] },
  { id: 3, name: 'Workstation Kabak', priceUSD: 1199, image: 'gaming-pc', type: 'desktop', category: 'office', manufacturer: 'PC Company', description: 'Універсальна робоча станція для вимогливих професіоналів. Відмінно підходить для рендеру, 3D-моделювання та монтажу.', specs: ['🖥️ Intel Core i7', '🎮 RTX 4060 Ti', '💾 32GB RAM', '💽 1TB SSD'] },
  { id: 4, name: 'Gaming PC Chumak', priceUSD: 300, image: 'gaming-pc', type: 'desktop', category: 'gaming', manufacturer: 'PC Company', description: 'Бюджетна збірка для знайомства зі світом ПК-геймінгу. Чудово впорається з кіберспортивними дисциплінами (CS2, Dota 2).', specs: ['🖥️ Intel Core i3', '🎮 GTX 1650', '💾 8GB RAM', '💽 256GB SSD'] },
  { id: 5, name: 'Gaming PC Chupik', priceUSD: 1606, image: 'gaming-pc', type: 'desktop', category: 'gaming', manufacturer: 'PC Company', description: 'Безкомпромісний ПК преміум-класу. Дозволяє грати в популярні ігри на максимальних налаштуваннях графіки у 2K та 4K дозволах.', specs: ['🖥️ Intel Core i9', '🎮 RTX 4080', '💾 32GB RAM', '💽 2TB M.2 SSD'] },
  { id: 6, name: 'Workstation Kozak', priceUSD: 570, image: 'gaming-pc', type: 'desktop', category: 'office', manufacturer: 'PC Company', description: 'Надійний комп\'ютер для офісної роботи та повсякденних завдань. Завдяки швидкому SSD система та програми завантажуються миттєво.', specs: ['🖥️ AMD Ryzen 3', '🎮 Radeon Graphics', '💾 16GB RAM', '💽 512GB SSD'] },
  { id: 7, name: 'Laptop ASUS Vivo', priceUSD: 599, image: 'laptop', type: 'laptop', category: 'office', manufacturer: 'ASUS', description: 'Легкий та стильний ноутбук для навчання й роботи поза домом. Забезпечує відмінну автономність та комфортну роботу з документами.', specs: ['💻 15.6" FHD', '🖥️ Intel i5-1135G7', '💾 8GB RAM', '💽 512GB SSD'] },
  { id: 8, name: 'Laptop LENOVO Slim', priceUSD: 649, image: 'laptop', type: 'laptop', category: 'office', manufacturer: 'LENOVO', description: 'Універсальний ноутбук у тонкому та легкому корпусі. Чудовий дисплей робить його зручним для перегляду контенту та щоденного використання.', specs: ['💻 14" IPS', '🖥️ AMD Ryzen 5', '💾 16GB RAM', '💽 512GB SSD'] },
  { id: 9, name: 'Laptop HP Elite', priceUSD: 749, image: 'laptop', type: 'laptop', category: 'gaming', manufacturer: 'HP', description: 'Потужний ігровий ноутбук із високочастотним дисплеєм. Ідеальний для динамічних шутерів з плавною картинкою без розривів.', specs: ['💻 15.6" 144Hz', '🖥️ Intel Core i7', '🎮 RTX 3050', '💾 16GB RAM'] },
  { id: 10, name: 'Laptop ASUS Opel', priceUSD: 400, image: 'laptop', type: 'laptop', category: 'office', manufacturer: 'ASUS', description: 'Базовий лептоп для нескладних завдань, серфінгу в інтернеті та перегляду фільмів.', specs: ['💻 15.6" HD', '🖥️ Celeron N4020', '💾 4GB RAM', '💽 256GB SSD'] },
  { id: 11, name: 'Laptop LENOVO height-weight', priceUSD: 610, image: 'laptop', type: 'laptop', category: 'office', manufacturer: 'LENOVO', description: 'Ноутбук класичного формфактора з великим обсягом пам\'яті для зберігання всіх ваших файлів та швидким процесором Core i5.', specs: ['💻 15.6" FHD', '🖥️ Intel Core i5', '💾 8GB RAM', '💽 1TB HDD'] },
  { id: 12, name: 'Laptop HP Smallit', priceUSD: 630, image: 'laptop', type: 'laptop', category: 'gaming', manufacturer: 'HP', description: 'Компактний 14-дюймовий ноутбук з дискретною відеокартою, який поєднує мобільність із можливістю пограти у вільний час.', specs: ['💻 14" FHD', '🖥️ AMD Ryzen 5', '🎮 GTX 1650', '💾 8GB RAM'] }
];

async function fetchProducts() {
    try {
        const res = await fetch('http://127.0.0.1:8000/api/products');
        if (res.ok) {
            const dbProducts = await res.json();
            if (dbProducts.length > 0) {
                products = dbProducts.map(p => {
                   let type = 'desktop';
                   if (p.category && (p.category.toLowerCase() === 'ноутбуки' || p.category.toLowerCase().includes('laptop'))) type = 'laptop';
                   let cat = 'gaming';
                   if (p.category && (p.category.toLowerCase().includes('офіс') || p.category.toLowerCase().includes('office'))) cat = 'office';
                   
                   let specsArray = [];
                   if (p.specs) {
                       try {
                           specsArray = JSON.parse(p.specs);
                           if (!Array.isArray(specsArray)) specsArray = [p.specs];
                       } catch(e) {
                           specsArray = p.specs.split('\\n');
                       }
                   }

                   return {
                       id: p.id,
                       name: p.name,
                       priceUSD: p.price,
                       image: p.image_url || 'gaming-pc',
                       type: type,
                       category: cat,
                       manufacturer: 'PC Company',
                       description: p.description || '',
                       specs: specsArray
                   };
                });
            }
            renderProducts();
            populateManufacturerOptions(filterState.type || 'all');
        }
    } catch(e) {
        console.error("Failed to fetch products, using fallback", e);
    }
}

// --- Helpers ---
function parsePrice(val) {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const m = val.replace(/,/g, '.').match(/[-+]?[0-9]*\.?[0-9]+/);
    return m ? Number(m[0]) : 0;
  }
  return 0;
}
function formatUSD(n) { return '$' + (Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })); }

// --- Filter state ---
let filterState = {
  type: 'all',
  category: 'all',
  manufacturer: 'all',
  priceMin: null,
  priceMax: null
};

function saveFiltersToStorage() { localStorage.setItem('pc-company-filters', JSON.stringify(filterState)); }
function loadFiltersFromStorage() {
  const raw = localStorage.getItem('pc-company-filters');
  if (!raw) return;
  try { const obj = JSON.parse(raw); filterState = Object.assign(filterState, obj); }
  catch (e) { console.error('loadFiltersFromStorage parse error', e); }
}

// --- Filter panel UI ---
function createFilterPanel() {
  if (document.getElementById('productFilterPanel')) return;
  const panel = document.createElement('div'); panel.id = 'productFilterPanel'; panel.className = 'filter-panel';
  panel.innerHTML = `
    <div class="filter-panel-header">
      <h3>Фільтр товарів</h3>
      <button id="filterCloseBtn" class="filter-close">✕</button>
    </div>
    <div class="filter-panel-body">
      <div class="filter-group">
        <label>Тип</label>
        <select id="filterTypeSelect"><option value="all">Всі</option><option value="desktop">Комп'ютери</option><option value="laptop">Ноутбуки</option></select>
      </div>
      <div class="filter-group">
        <label>Категорія</label>
        <select id="filterCategorySelect"><option value="all">Всі</option><option value="gaming">Ігрові</option><option value="office">Офісні</option></select>
      </div>
      <div class="filter-group">
        <label>Виробник</label>
        <select id="filterManufacturerSelect"><option value="all">Всі</option></select>
      </div>
      <div class="filter-group">
        <label>Ціна (USD)</label>
        <div class="price-row"><input type="number" id="filterPriceMin" placeholder="від" min="0"><span>-</span><input type="number" id="filterPriceMax" placeholder="до" min="0"></div>
      </div>
      <div class="filter-actions">
        <button id="filterSaveBtn" class="btn-save-filters">Зберегти</button>
        <button id="filterResetBtn" class="btn-reset-filters">Скинути</button>

      </div>
    </div>
  `;
  const overlay = document.createElement('div'); overlay.id = 'filterOverlay'; overlay.className = 'filter-overlay';
  document.body.appendChild(overlay); document.body.appendChild(panel);

  document.getElementById('filterCloseBtn').addEventListener('click', closeFilterPanel);
  overlay.addEventListener('click', closeFilterPanel);

  document.getElementById('filterTypeSelect').addEventListener('change', (e) => populateManufacturerOptions(e.target.value));
  document.getElementById('filterSaveBtn').addEventListener('click', () => { saveFiltersFromUI(); closeFilterPanel(); });
  document.getElementById('filterResetBtn').addEventListener('click', () => { resetFilters(); });
}

function openFilterPanel() { createFilterPanel(); document.getElementById('productFilterPanel').classList.add('open'); document.getElementById('filterOverlay').classList.add('open'); loadFiltersToUI(); }
function closeFilterPanel() { const p = document.getElementById('productFilterPanel'), o = document.getElementById('filterOverlay'); if (p) p.classList.remove('open'); if (o) o.classList.remove('open'); }

function populateManufacturerOptions(type = 'all') {
  const sel = document.getElementById('filterManufacturerSelect'); if (!sel) return;
  const set = new Set(); products.forEach(p => { if (type === 'all' || p.type === type) set.add(p.manufacturer || ''); });
  sel.innerHTML = '<option value="all">Всі</option>' + Array.from(set).filter(Boolean).sort().map(m => `<option value="${m}">${m}</option>`).join('');
  if (filterState.manufacturer) sel.value = filterState.manufacturer;
}

function loadFiltersToUI() {
  const t = document.getElementById('filterTypeSelect'), c = document.getElementById('filterCategorySelect'), m = document.getElementById('filterManufacturerSelect'), min = document.getElementById('filterPriceMin'), max = document.getElementById('filterPriceMax');
  if (t) t.value = filterState.type || 'all';
  if (c) c.value = filterState.category || 'all';
  populateManufacturerOptions(filterState.type || 'all');
  if (m) m.value = filterState.manufacturer || 'all';
  if (min) min.value = filterState.priceMin !== null ? filterState.priceMin : '';
  if (max) max.value = filterState.priceMax !== null ? filterState.priceMax : '';
}

function saveFiltersFromUI() {
  const t = document.getElementById('filterTypeSelect'), c = document.getElementById('filterCategorySelect'), m = document.getElementById('filterManufacturerSelect'), min = document.getElementById('filterPriceMin'), max = document.getElementById('filterPriceMax');
  const newMin = min && min.value !== '' ? Number(min.value) : null;
  const newMax = max && max.value !== '' ? Number(max.value) : null;
  if (newMin !== null && newMax !== null && newMin > newMax) { window.showToast('Помилка: мінімальна ціна не може бути більше за максимальну.', 'error'); return; }
  filterState.type = t ? t.value : 'all';
  filterState.category = c ? c.value : 'all';
  filterState.manufacturer = m ? m.value : 'all';
  filterState.priceMin = newMin; filterState.priceMax = newMax;
  saveFiltersToStorage(); renderProducts();
}
function resetFilters() { filterState = { type: 'all', category: 'all', manufacturer: 'all', priceMin: null, priceMax: null }; localStorage.removeItem('pc-company-filters'); loadFiltersToUI(); renderProducts(); }

// --- Rendering products with filters applied ---
function renderProducts() {
  const grid = document.getElementById('productsGrid'); if (!grid) return;
  grid.innerHTML = '';
  const filtered = products.filter(p => {
    if (filterState.type !== 'all' && p.type !== filterState.type) return false;
    if (filterState.category !== 'all' && p.category !== filterState.category) return false;
    if (filterState.manufacturer !== 'all' && p.manufacturer !== filterState.manufacturer) return false;
    if (filterState.priceMin !== null && p.priceUSD < filterState.priceMin) return false;
    if (filterState.priceMax !== null && p.priceUSD > filterState.priceMax) return false;
    return true;
  });
  if (filtered.length === 0) { grid.innerHTML = '<p class="no-products">За цими критеріями нічого не знайдено.</p>'; return; }
  filtered.forEach(p => grid.appendChild(generateProductCard(p)));
  if (window.observeReveals) window.observeReveals();
}

function generateProductCard(product) {
  const card = document.createElement('div'); card.className = 'product-card';
  const gradient = product.type === 'desktop' ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' : 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)';
  card.innerHTML = `
    <div class="product-image-wrapper" style="background:${gradient}; position:relative;">
      <button class="btn-compare-add" data-id="${product.id}" title="Додати до порівняння" style="position:absolute; top:10px; left:10px; background:rgba(0,0,0,0.5); border:none; border-radius:50%; width:35px; height:35px; font-size:18px; cursor:pointer; color:#fff; z-index:2; transition:all 0.3s ease; display:flex; justify-content:center; align-items:center;">⚖️</button>
      <div class="product-image">${product.type === 'desktop' ? '🖥️' : '💻'}</div>
      <div class="price-tag">${formatUSD(product.priceUSD)}</div>
    </div>
    <button class="product-details-btn" data-id="${product.id}">Детальніше</button>
  `;
  card.querySelector('.product-details-btn').addEventListener('click', () => openProductModal(product.id));
  card.querySelector('.btn-compare-add').addEventListener('click', (e) => { e.stopPropagation(); toggleCompare(product.id); });
  return card;
}

// --- Product modal ---
function createProductModal() {
  if (document.getElementById('productModal')) return;
  const modal = document.createElement('div'); modal.id = 'productModal'; modal.className = 'product-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close">✕</button>
      <div class="modal-header"><div class="modal-product-icon" id="modalProductIcon">🖥️</div><div><h2 id="modalProductName">Name</h2><p id="modalProductType">Type</p></div></div>
      <div class="modal-body">
        <div class="modal-section" id="modalProductDescSection"><h3>Опис</h3><p id="modalProductDescription" style="font-size:0.95em; color:#ddd; line-height:1.4;"></p></div>
        <div class="modal-section"><h3>Характеристики</h3><div class="characteristics" id="modalProductCharacteristics"><p>💪 Потужна конфігурація</p><p>⚡ Висока продуктивність</p></div></div>
        <div class="modal-section"><h3>Ціна</h3><p class="modal-price" id="modalProductPrice">$0</p></div>
        <div class="modal-section"><h3>Відгуки</h3><div id="reviewsList"><p class="no-reviews">Немає відгуків. Будьте першим!</p></div>
          <div class="review-form"><input id="reviewName" placeholder="Ваше ім'я"><textarea id="reviewText" rows="4" placeholder="Напишіть ваш відгук..."></textarea><button class="btn-submit-review">Надіслати відгук</button></div>
        </div>
      </div>
      <div class="modal-footer"><button class="btn-modal-close">Закрити</button><button class="btn-modal-add-cart" id="modalAddToCartBtn">Додати в кошик</button></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('.modal-close').addEventListener('click', closeProductModal);
  modal.querySelector('.btn-modal-close').addEventListener('click', closeProductModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeProductModal(); });
  modal.querySelector('.btn-submit-review').addEventListener('click', submitReview);
}

function openProductModal(id) {
  createProductModal();
  const product = products.find(p => p.id === id); if (!product) { window.showToast('Товар не знайдено', 'error'); return; }
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductPrice').textContent = formatUSD(product.priceUSD);
  document.getElementById('modalProductType').textContent = product.type === 'desktop' ? 'Комп\'ютер' : 'Ноутбук';
  document.getElementById('modalProductIcon').textContent = product.type === 'desktop' ? '🖥️' : '💻';

  const descSection = document.getElementById('modalProductDescSection');
  const descP = document.getElementById('modalProductDescription');
  if (descSection && descP) {
    if (product.description) {
      descP.textContent = product.description;
      descSection.style.display = 'block';
    } else {
      descSection.style.display = 'none';
    }
  }

  const charsDiv = document.getElementById('modalProductCharacteristics');
  if (charsDiv) {
    if (product.specs && product.specs.length > 0) {
      charsDiv.innerHTML = product.specs.map(spec => `<p>${spec}</p>`).join('');
    } else {
      charsDiv.innerHTML = '<p>💪 Потужна конфігурація</p><p>⚡ Висока продуктивність</p>';
    }
  }

  const addBtn = document.getElementById('modalAddToCartBtn');
  addBtn.onclick = () => { addProductToCart(product.id, product.name, product.priceUSD, product.type); closeProductModal(); };
  document.getElementById('productModal').style.display = 'flex';
}
function closeProductModal() { const m = document.getElementById('productModal'); if (m) m.style.display = 'none'; }

// Reviews
function submitReview() { const name = document.getElementById('reviewName').value.trim(); const text = document.getElementById('reviewText').value.trim(); if (!name || !text) { window.showToast('Будь ласка, заповніть усі поля!', 'error'); return; } const list = document.getElementById('reviewsList'); const no = list.querySelector('.no-reviews'); if (no) no.remove(); const item = document.createElement('div'); item.className = 'review-item'; item.innerHTML = `<div class="review-author">${name}</div><div class="review-text">${text}</div><div class="review-date">${new Date().toLocaleDateString('uk-UA')}</div>`; list.appendChild(item); document.getElementById('reviewName').value = ''; document.getElementById('reviewText').value = ''; window.showToast('Відгук успішно додано!', 'success'); }

// --- Cart ---
function addProductToCart(id, name, price, type) {
  const cart = JSON.parse(localStorage.getItem('pc-company-cart') || '[]');
  const existing = cart.find(i => i.id === id);
  if (existing) existing.quantity += 1; else cart.push({ id, name, price, type, quantity: 1 });
  localStorage.setItem('pc-company-cart', JSON.stringify(cart)); window.showToast(`${name} додано до кошика!`, 'success');
}
function createCartModal() {
  if (document.getElementById('cartModal')) return; const modal = document.createElement('div'); modal.id = 'cartModal'; modal.className = 'cart-modal'; modal.innerHTML = `<div class="cart-modal-content"><div class="cart-modal-header"><h2>🛒 Мій кошик</h2><button class="cart-modal-close">&times;</button></div><div class="cart-modal-body"><div id="cartItemsList" class="cart-items-list"><p class="empty-cart">Кошик пустий</p></div></div><div class="cart-modal-summary"><div class="cart-summary-row"><span>Кількість товарів:</span><span id="cartItemCount">0</span></div><div class="cart-summary-row total"><span>Загалом:</span><span id="cartTotalPrice">0 $</span></div></div><div class="cart-modal-footer"><button class="btn-continue-shopping">Продовжити покупки</button><button class="btn-checkout">Оформити замовлення</button></div></div>`; document.body.appendChild(modal); modal.querySelector('.cart-modal-close').addEventListener('click', closeCartModal); modal.addEventListener('click', (e) => { if (e.target === modal) closeCartModal(); }); modal.querySelector('.btn-continue-shopping').addEventListener('click', closeCartModal); modal.querySelector('.btn-checkout').addEventListener('click', proceedToCheckout);
}
function openCartModal() { createCartModal(); renderCartItems(); document.getElementById('cartModal').style.display = 'flex'; }
function closeCartModal() { const m = document.getElementById('cartModal'); if (m) m.style.display = 'none'; }
function renderCartItems() {
  const list = document.getElementById('cartItemsList'); const cart = JSON.parse(localStorage.getItem('pc-company-cart') || '[]'); if (!list) return; if (cart.length === 0) { list.innerHTML = '<p class="empty-cart">🛒 Кошик пустий</p>'; document.getElementById('cartItemCount').textContent = '0'; document.getElementById('cartTotalPrice').textContent = '0 $'; return; } list.innerHTML = ''; let total = 0; let items = 0; cart.forEach((it, idx) => { const price = parsePrice(it.price) || 0; const itemTotal = price * it.quantity; total += itemTotal; items += it.quantity; const div = document.createElement('div'); div.className = 'cart-item'; div.innerHTML = `<div class="cart-item-info"><div class="cart-item-icon">${it.type === 'desktop' ? '🖥️' : '💻'}</div><div class="cart-item-details"><h4 class="cart-item-name">${it.name}</h4><p class="cart-item-price">${formatUSD(price)}</p></div></div><div class="cart-item-controls"><button class="cart-qty-btn" data-idx="${idx}" data-change="-1">−</button><input type="number" class="cart-qty-input" value="${it.quantity}" min="1" data-idx="${idx}"><button class="cart-qty-btn" data-idx="${idx}" data-change="1">+</button></div><div class="cart-item-total"><span>${formatUSD(itemTotal)}</span></div><button class="cart-item-remove" data-idx="${idx}">🗑️</button>`; list.appendChild(div); }); document.getElementById('cartItemCount').textContent = items; document.getElementById('cartTotalPrice').textContent = formatUSD(total);
  // attach events
  list.querySelectorAll('.cart-qty-btn').forEach(btn => btn.addEventListener('click', (e) => { const idx = Number(btn.dataset.idx); const change = Number(btn.dataset.change); changeCartItemQuantity(idx, change); }));
  list.querySelectorAll('.cart-qty-input').forEach(inp => inp.addEventListener('change', (e) => { const idx = Number(inp.dataset.idx); updateCartItemQuantity(idx, inp.value); }));
  list.querySelectorAll('.cart-item-remove').forEach(btn => btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.idx))));
}
function changeCartItemQuantity(index, change) { const cart = JSON.parse(localStorage.getItem('pc-company-cart') || '[]'); if (cart[index]) { cart[index].quantity = Math.max(1, cart[index].quantity + change); localStorage.setItem('pc-company-cart', JSON.stringify(cart)); renderCartItems(); } }
function updateCartItemQuantity(index, value) { const cart = JSON.parse(localStorage.getItem('pc-company-cart') || '[]'); const qty = parseInt(value) || 1; if (cart[index]) { cart[index].quantity = Math.max(1, qty); localStorage.setItem('pc-company-cart', JSON.stringify(cart)); renderCartItems(); } }
function removeFromCart(index) { if (!confirm('Видалити цей товар з кошика?')) return; const cart = JSON.parse(localStorage.getItem('pc-company-cart') || '[]'); cart.splice(index, 1); localStorage.setItem('pc-company-cart', JSON.stringify(cart)); renderCartItems(); window.showToast('✅ Товар видалено з кошика', 'info'); }
function proceedToCheckout() { const cart = JSON.parse(localStorage.getItem('pc-company-cart') || '[]'); if (cart.length === 0) { window.showToast('Кошик пуст! Додайте товари перед оформленням замовлення.', 'warning'); return; } const isLoggedIn = localStorage.getItem('pc-company-logged-in') === 'true'; if (!isLoggedIn) { window.showToast('Будь ласка, спочатку увійдіть до свого аккаунту', 'warning'); setTimeout(() => { window.location.href = 'login.html'; }, 1500); return; } closeCartModal(); window.location.href = 'checkout.html'; }

// --- Auth UI (simple) ---
// --- Avatar helpers ---
function getUserAvatar() {
  const raw = localStorage.getItem('pc-company-current-user');
  if (!raw) return null;
  try { return JSON.parse(raw).avatar || null; } catch (e) { return null; }
}

function getDefaultAvatarSrc(idx) {
  return `../images/avatars/preset_${idx}.svg`;
}

// --- Auth UI with Avatar ---
function updateAuthUI() {
  const isLoggedIn = localStorage.getItem('pc-company-logged-in') === 'true';
  const currentUser = localStorage.getItem('pc-company-current-user');
  const authLinks = document.querySelector('.auth-links');
  if (!authLinks) return;
  if (isLoggedIn && currentUser) {
    try {
      const user = JSON.parse(currentUser);
      const avatarSrc = user.avatar || getDefaultAvatarSrc(1);
      authLinks.innerHTML = `
        <a href="profile.html"><img src="${avatarSrc}" class="header-avatar" id="headerAvatar" alt="Аватар" title="Мій профіль"></a>
        <span class="auth-link welcome-text">Вітаємо, ${user.name}!</span>
        <a href="profile.html" class="auth-link profile-link" id="profileLink">👤 Профіль</a>
        <button class="auth-link logout-link" id="logoutBtn">Вийти</button>
      `;
      document.getElementById('logoutBtn').addEventListener('click', logoutUser);
    } catch (e) { console.error(e); }
  } else {
    authLinks.innerHTML = `<a href="login.html" class="auth-link login-link">Вхід</a><a href="register.html" class="auth-link register-link">Реєстрація</a>`;
  }
}

function openProfileModal() {
  const raw = localStorage.getItem('pc-company-current-user');
  if (!raw) { window.showToast('Помилка: дані користувача не знайдені', 'error'); return; }
  try {
    const user = JSON.parse(raw);
    const avatarSrc = user.avatar || getDefaultAvatarSrc(1);
    let modal = document.getElementById('profileModal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'profileModal'; modal.className = 'profile-modal'; document.body.appendChild(modal); }
    modal.innerHTML = `
      <div class="profile-modal-content">
        <div class="profile-modal-header"><h2>Мій профіль</h2><button class="profile-modal-close">&times;</button></div>
        <div class="profile-modal-body">
          <div class="profile-avatar-wrap">
            <img src="${avatarSrc}" class="profile-avatar-img" id="profileAvatarImg" alt="Аватар">
            <button class="btn-edit-avatar" id="editAvatarBtn">🎨 Змінити аватар</button>
          </div>
          <div class="profile-field"><label>Ім'я:</label><input id="profileName" value="${user.name}"></div>
          <div class="profile-field"><label>Email:</label><input id="profileEmail" value="${user.email}" disabled><small>Email не можна змінити</small></div>
          <div class="profile-field"><label>Телефон:</label><input id="profilePhone" value="${user.phone || ''}"></div>
          <hr style="border: 1px solid #333; margin: 15px 0;">
          <h4 style="font-size: 16px; margin-bottom: 10px; text-align: left;">Зміна пароля</h4>
          <div class="profile-field"><label>Поточний пароль:</label><input id="profileOldPassword" type="password" placeholder="поточний пароль"></div>
          <div class="profile-field"><label>Новий пароль:</label><input id="profilePassword" type="password" placeholder="новий пароль (мін. 6 символів)"></div>
        </div>
        <div class="profile-modal-footer">
          <button class="btn-save" id="saveProfileBtn">Зберегти зміни</button>
          <button class="btn-cancel" id="closeProfileBtn">Закрити</button>
        </div>
      </div>`;
    modal.style.display = 'flex';
    modal.querySelector('.profile-modal-close').addEventListener('click', closeProfileModal);
    modal.querySelector('#closeProfileBtn').addEventListener('click', closeProfileModal);
    modal.querySelector('#saveProfileBtn').addEventListener('click', saveProfileChanges);
    modal.querySelector('#editAvatarBtn').addEventListener('click', () => { closeProfileModal(); openAvatarModal(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) closeProfileModal(); });
  } catch (e) { console.error(e); window.showToast('Помилка при відкритті профілю', 'error'); }
}
function closeProfileModal() { const m = document.getElementById('profileModal'); if (m) m.style.display = 'none'; }
function saveProfileChanges() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('pc-company-current-user'));
    const newName = document.getElementById('profileName').value.trim();
    const newPhone = document.getElementById('profilePhone').value.trim();
    const newPass = document.getElementById('profilePassword').value;
    const oldPass = document.getElementById('profileOldPassword').value;
    if (!newName) { window.showToast('Будь ласка, введіть ім\'я!', 'error'); return; }
    
    if (newPass || oldPass) {
      if (oldPass !== currentUser.password) {
        window.showToast('Невірний поточний пароль!', 'error');
        return;
      }
      if (newPass.length < 6) {
        window.showToast('Новий пароль повинен бути мінімум 6 символів!', 'error');
        return;
      }
      currentUser.password = newPass;
    }
    
    currentUser.name = newName;
    currentUser.phone = newPhone;
    localStorage.setItem('pc-company-user', JSON.stringify(currentUser));
    localStorage.setItem('pc-company-current-user', JSON.stringify(currentUser));
    window.showToast('✅ Зміни успішно збережені!', 'success');
    closeProfileModal(); updateAuthUI();
  } catch (e) { console.error(e); window.showToast('Помилка при збереженні', 'error'); }
}
function logoutUser() { if (!confirm('Ви впевнені, що хочете вийти?')) return; localStorage.setItem('pc-company-logged-in', 'false'); localStorage.removeItem('pc-company-current-user'); localStorage.removeItem('pc-company-remember'); window.showToast('Ви успішно вийшли з аккаунту', 'success'); setTimeout(() => { window.location.href = 'index.html'; }, 1500); }

// --- Avatar Modal ---
let _avatarSelected = null;

function openAvatarModal() {
  const raw = localStorage.getItem('pc-company-current-user');
  const user = raw ? JSON.parse(raw) : {};
  const currentAvatar = user.avatar || getDefaultAvatarSrc(1);
  _avatarSelected = currentAvatar;

  let modal = document.getElementById('avatarModal');
  if (!modal) { modal = document.createElement('div'); modal.id = 'avatarModal'; modal.className = 'avatar-modal'; document.body.appendChild(modal); }

  const presets = Array.from({ length: 8 }, (_, i) => getDefaultAvatarSrc(i + 1));
  const presetsHTML = presets.map((src, i) => `
    <div class="avatar-preset-item${currentAvatar === src ? ' selected' : ''}" data-src="${src}" title="Пресет ${i + 1}">
      <img src="${src}" alt="Авт ${i + 1}" onerror="this.parentElement.innerHTML='🤖'">
    </div>
  `).join('');

  modal.innerHTML = `
    <div class="avatar-modal-content">
      <div class="avatar-modal-header">
        <h2>🎨 Вибір аватара</h2>
        <button class="avatar-modal-close" id="avatarModalClose">&times;</button>
      </div>
      <div class="avatar-modal-body">
        <div>
          <p class="avatar-section-title">Поточний аватар</p>
          <div class="avatar-preview-wrap">
            <img src="${currentAvatar}" class="avatar-preview-large" id="avatarPreviewLarge" alt="Preview" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 50 50%22><text y=%221em%22 font-size=%2240%22>🤖</text></svg>'">
          </div>
        </div>
        <div>
          <p class="avatar-section-title">Готові аватари</p>
          <div class="avatar-presets-grid" id="avatarPresetsGrid">${presetsHTML}</div>
        </div>
        <div>
          <p class="avatar-section-title">Завантажити своє фото</p>
          <div class="avatar-upload-area" id="avatarUploadArea">
            <div class="avatar-upload-icon">📁</div>
            <p>Натисніть або перетягніть зображення сюди</p>
            <input type="file" id="avatarFileInput" accept="image/*">
          </div>
        </div>
      </div>
      <div class="avatar-modal-footer">
        <button class="btn-avatar-cancel" id="avatarCancelBtn">Скасувати</button>
        <button class="btn-avatar-save" id="avatarSaveBtn">✅ Зберегти аватар</button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  modal.querySelector('#avatarModalClose').addEventListener('click', closeAvatarModal);
  modal.querySelector('#avatarCancelBtn').addEventListener('click', closeAvatarModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeAvatarModal(); });

  // Preset selection
  modal.querySelectorAll('.avatar-preset-item').forEach(item => {
    item.addEventListener('click', () => {
      modal.querySelectorAll('.avatar-preset-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      _avatarSelected = item.dataset.src;
      document.getElementById('avatarPreviewLarge').src = _avatarSelected;
    });
  });

  // File upload
  const uploadArea = modal.querySelector('#avatarUploadArea');
  const fileInput = modal.querySelector('#avatarFileInput');
  uploadArea.addEventListener('click', () => fileInput.click());
  uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.style.borderColor = '#8B4513'; });
  uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault(); uploadArea.style.borderColor = '';
    if (e.dataTransfer.files[0]) handleAvatarFile(e.dataTransfer.files[0], modal);
  });
  fileInput.addEventListener('change', (e) => { if (e.target.files[0]) handleAvatarFile(e.target.files[0], modal); });

  // Save
  modal.querySelector('#avatarSaveBtn').addEventListener('click', saveAvatar);
}

function handleAvatarFile(file, modal) {
  if (!file.type.startsWith('image/')) { window.showToast('Будь ласка, виберіть зображення!', 'warning'); return; }
  if (file.size > 5 * 1024 * 1024) { window.showToast('Файл завеликий! Максимум 5MB.', 'warning'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    _avatarSelected = e.target.result;
    document.getElementById('avatarPreviewLarge').src = _avatarSelected;
    modal.querySelectorAll('.avatar-preset-item').forEach(i => i.classList.remove('selected'));
    window.showToast('📸 Фото завантажено! Натисніть «Зберегти».', 'info');
  };
  reader.readAsDataURL(file);
}

function saveAvatar() {
  if (!_avatarSelected) { window.showToast('Виберіть аватар!', 'warning'); return; }
  try {
    const currentUser = JSON.parse(localStorage.getItem('pc-company-current-user'));
    currentUser.avatar = _avatarSelected;
    localStorage.setItem('pc-company-current-user', JSON.stringify(currentUser));
    localStorage.setItem('pc-company-user', JSON.stringify(currentUser));
    closeAvatarModal();
    updateAuthUI();
    window.showToast('✅ Аватар успішно збережено!', 'success');
  } catch (e) { console.error(e); window.showToast('Помилка при збереженні аватара', 'error'); }
}

function closeAvatarModal() { const m = document.getElementById('avatarModal'); if (m) m.style.display = 'none'; }

// --- Initialization on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
  loadFiltersFromStorage();
  createFilterPanel();
  populateManufacturerOptions(filterState.type || 'all');
  renderProducts();
  fetchProducts(); // << Load DB products
  updateAuthUI();

  // --- Сповіщення про покинутий кошик ---
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 0) {
      const cart = JSON.parse(localStorage.getItem('pc-company-cart') || '[]');
      const notified = sessionStorage.getItem('abandoned_cart_notified');
      if (cart.length > 0 && !notified) {
        window.showToast('У вас залишились товари в кошику! Оформіть замовлення зараз, щоб їх не втратити.', 'info');
        sessionStorage.setItem('abandoned_cart_notified', 'true');
      }
    }
  });

  // Ініціалізація UI порівняння
  if (typeof updateCompareUI === 'function') updateCompareUI();

  // --- Theme toggle ---
  const savedTheme = localStorage.getItem('pc-company-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeCheckbox = document.getElementById('themeCheckbox');
  if (themeCheckbox) {
    themeCheckbox.checked = savedTheme === 'dark';
    themeCheckbox.addEventListener('change', () => {
      const newTheme = themeCheckbox.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('pc-company-theme', newTheme);
    });
  }

  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  // wire filter button
  const btn = document.querySelector('.filter-btn'); if (btn) btn.addEventListener('click', openFilterPanel);
  // wire cart button
  const cartBtn = document.querySelector('.cart-btn'); if (cartBtn) cartBtn.addEventListener('click', openCartModal);
  // intersection observer for reveal animations
  const revealCallbacks = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  };
  const revealObserver = new IntersectionObserver(revealCallbacks, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Also observe product-card dynamically added later via renderProducts
  window.observeReveals = () => {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .product-card').forEach(el => {
      if (el.classList.contains('product-card')) el.classList.add('reveal');
      revealObserver.observe(el);
    });
  };
  window.observeReveals();
  // render site reviews form if exists
  const saveReviewBtn = document.getElementById('saveReviewBtn');
  if (saveReviewBtn) {
    saveReviewBtn.addEventListener('click', () => {
      const email = document.getElementById('reviewAuthorEmail').value.trim();
      const text = document.getElementById('reviewTextContent').value.trim();
      if (!email || !text) {
        window.showToast('Будь ласка, заповніть усі поля!', 'error');
        return;
      }
      const accordion = document.getElementById('accordionFlushExample');
      if (!accordion) return;

      const newId = 'flush-collapseNew' + Date.now();
      const item = document.createElement('div');
      item.className = 'accordion-item';
      item.innerHTML = `
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#${newId}" aria-expanded="false" aria-controls="${newId}">
                <img src="/Frontend/images/img.png" class="rounded float-start" alt="..." width="20" height="20">
                <div class="d-grid gap-2 d-md-flex justify-content-md-end" style="margin-left: 10px;">
                    <a href="mailto:${email}">${email}</a>
                </div>
            </button>
        </h2>
        <div id="${newId}" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">${text}</div>
        </div>
      `;
      accordion.insertBefore(item, accordion.firstChild);

      document.getElementById('reviewAuthorEmail').value = '';
      document.getElementById('reviewTextContent').value = '';

      const modalEl = document.getElementById('addReviewModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

      window.showToast('Дякуємо! Ваш відгук додано успішно.', 'success');
    });
  }

  // Mobile menu toggle logic
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileMenuOverlay');

  if (mobileToggle && mobileMenu && mobileOverlay) {
    const toggleMenu = (open) => {
      mobileMenu.classList.toggle('open', open);
      mobileOverlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.contains('open');
      toggleMenu(!isOpen);
    });

    mobileOverlay.addEventListener('click', () => toggleMenu(false));

    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }
});

// --- PWA Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// --- Compare Products ---
let compareList = JSON.parse(localStorage.getItem('pc-company-compare') || '[]');

function toggleCompare(id) {
    const idx = compareList.indexOf(id);
    if (idx > -1) {
        compareList.splice(idx, 1);
        window.showToast('Товар видалено з порівняння', 'info');
    } else {
        if (compareList.length >= 3) {
            window.showToast('Можна порівнювати не більше 3 товарів одночасно!', 'warning');
            return;
        }
        compareList.push(id);
        window.showToast('Товар додано до порівняння', 'success');
    }
    localStorage.setItem('pc-company-compare', JSON.stringify(compareList));
    updateCompareUI();
}

function updateCompareUI() {
    let bar = document.getElementById('compareFloatingBar');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'compareFloatingBar';
        bar.style.cssText = 'position:fixed; bottom:20px; left:20px; background:var(--card-bg, #fff); color:var(--text-color, #333); padding:15px 20px; border-radius:10px; box-shadow:0 4px 15px rgba(0,0,0,0.2); z-index:1000; display:flex; align-items:center; gap:15px; border:1px solid var(--border-color, #ddd); font-weight:bold; transition:all 0.3s ease;';
        bar.innerHTML = `
            <div><span id="compareCountUI" style="color:var(--primary-color, #007bff); font-size:1.2em;">0</span> товарів</div>
            <button id="btnOpenCompareModal" style="background:var(--primary-color, #007bff); color:#fff; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">Порівняти</button>
            <button id="btnClearCompareModal" style="background:#dc3545; color:#fff; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">Очистити</button>
        `;
        document.body.appendChild(bar);
        document.getElementById('btnOpenCompareModal').addEventListener('click', openCompareModal);
        document.getElementById('btnClearCompareModal').addEventListener('click', () => { compareList = []; localStorage.removeItem('pc-company-compare'); updateCompareUI(); window.showToast('Список порівняння очищено', 'info'); });
    }
    
    document.getElementById('compareCountUI').textContent = compareList.length;
    if (compareList.length > 0) {
        bar.style.display = 'flex';
    } else {
        bar.style.display = 'none';
    }

    // Update buttons in product cards
    document.querySelectorAll('.btn-compare-add').forEach(btn => {
        const id = Number(btn.dataset.id);
        if (compareList.includes(id)) {
            btn.style.background = 'var(--primary-color, #007bff)';
            btn.title = 'Видалити з порівняння';
        } else {
            btn.style.background = 'rgba(0,0,0,0.5)';
            btn.title = 'Додати до порівняння';
        }
    });
}

function openCompareModal() {
    if (compareList.length === 0) return;
    let modal = document.getElementById('compareModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'compareModal';
        modal.className = 'compare-modal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:2000; overflow-y:auto;';
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeCompareModal(); });
    }
    
    let itemsHTML = '';
    compareList.forEach(id => {
        const p = products.find(prod => prod.id === id);
        if (p) {
            itemsHTML += `
                <div style="flex:1; min-width:250px; background:var(--card-bg, #fff); padding:20px; border-radius:10px; text-align:center; position:relative; box-shadow:0 5px 15px rgba(0,0,0,0.1);">
                    <button onclick="toggleCompare(${p.id}); closeCompareModal(); if(compareList.length > 0) openCompareModal();" style="position:absolute; top:10px; right:10px; background:transparent; border:none; font-size:20px; cursor:pointer; color:var(--text-color, #333);">&times;</button>
                    <div style="font-size:40px; margin-bottom:10px;">${p.type === 'desktop' ? '🖥️' : p.type === 'laptop' ? '💻' : p.type === 'speaker' ? '🔊' : '📦'}</div>
                    <h3 style="font-size:18px; margin-bottom:10px; color:var(--text-color, #333); height:45px; overflow:hidden;">${p.name}</h3>
                    <div style="font-size:20px; font-weight:bold; color:var(--primary-color, #007bff); margin-bottom:15px;">${formatUSD(p.priceUSD)}</div>
                    <p style="font-size:14px; color:var(--text-muted, #777); margin-bottom:15px; height:80px; overflow:hidden;">${p.description || ''}</p>
                    <div style="text-align:left; font-size:14px; background:var(--bg-color, #f9f9f9); padding:10px; border-radius:5px; color:var(--text-color, #333);">
                        ${p.specs && p.specs.length > 0 ? p.specs.map(s => `<div style="padding:5px 0; border-bottom:1px solid var(--border-color, #eee);">${s}</div>`).join('') : 'Немає даних'}
                    </div>
                </div>
            `;
        }
    });

    modal.innerHTML = `
        <div style="width:90%; max-width:1000px; background:var(--bg-color, #f4f4f4); padding:30px; border-radius:15px; max-height:90vh; overflow-y:auto; position:relative;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h2 style="color:var(--text-color, #333); margin:0;">⚖️ Порівняння товарів</h2>
                <button onclick="closeCompareModal()" style="background:transparent; border:none; font-size:28px; cursor:pointer; color:var(--text-color, #333);">&times;</button>
            </div>
            <div style="display:flex; gap:20px; flex-wrap:wrap; align-items:stretch;">
                ${itemsHTML}
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeCompareModal() {
    const modal = document.getElementById('compareModal');
    if (modal) modal.style.display = 'none';
}




