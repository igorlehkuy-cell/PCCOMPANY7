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
(function initCarousel(){
  const dots = document.querySelectorAll('.dot');
  const slides = document.querySelectorAll('.carousel-slide');
  if (!dots.length || !slides.length) return;
  let current = 0;
  function show(i){
    slides.forEach((s, idx)=> s.classList.toggle('active', idx===i));
    dots.forEach((d, idx)=> d.classList.toggle('active', idx===i));
    current = i;
  }
  dots.forEach((dot, i)=> dot.addEventListener('click', ()=> show(i)));
  setInterval(()=> show((current+1)%slides.length), 5000);
})();

// --- Product data (single source) ---
const products = [
  { id:1, name:'Gaming PC belissimo', priceUSD:799, image:'gaming-pc', type:'desktop', category:'gaming', manufacturer:'PC Company', description: 'Збалансований ігровий ПК для сучасних ігор на високих налаштуваннях у 1080p. Оптимальний вибір для геймерів-початківців.', specs: ['🖥️ Intel Core i5', '🎮 RTX 3060', '💾 16GB RAM', '💽 512GB SSD'] },
  { id:2, name:'Gaming PC Inferno', priceUSD:999, image:'gaming-pc', type:'desktop', category:'gaming', manufacturer:'PC Company', description: 'Продуктивний комп\'ютер, який легко впорається з будь-якими сучасними проектами завдяки потужній відеокарті RTX 40 серії.', specs: ['🖥️ AMD Ryzen 5', '🎮 RTX 4060', '💾 16GB RAM', '💽 1TB M.2 SSD'] },
  { id:3, name:'Workstation Kabak', priceUSD:1199, image:'gaming-pc', type:'desktop', category:'office', manufacturer:'PC Company', description: 'Універсальна робоча станція для вимогливих професіоналів. Відмінно підходить для рендеру, 3D-моделювання та монтажу.', specs: ['🖥️ Intel Core i7', '🎮 RTX 4060 Ti', '💾 32GB RAM', '💽 1TB SSD'] },
  { id:4, name:'Gaming PC Chumak', priceUSD:300, image:'gaming-pc', type:'desktop', category:'gaming', manufacturer:'PC Company', description: 'Бюджетна збірка для знайомства зі світом ПК-геймінгу. Чудово впорається з кіберспортивними дисциплінами (CS2, Dota 2).', specs: ['🖥️ Intel Core i3', '🎮 GTX 1650', '💾 8GB RAM', '💽 256GB SSD'] },
  { id:5, name:'Gaming PC Chupik', priceUSD:1606, image:'gaming-pc', type:'desktop', category:'gaming', manufacturer:'PC Company', description: 'Безкомпромісний ПК преміум-класу. Дозволяє грати в популярні ігри на максимальних налаштуваннях графіки у 2K та 4K дозволах.', specs: ['🖥️ Intel Core i9', '🎮 RTX 4080', '💾 32GB RAM', '💽 2TB M.2 SSD'] },
  { id:6, name:'Workstation Kozak', priceUSD:570, image:'gaming-pc', type:'desktop', category:'office', manufacturer:'PC Company', description: 'Надійний комп\'ютер для офісної роботи та повсякденних завдань. Завдяки швидкому SSD система та програми завантажуються миттєво.', specs: ['🖥️ AMD Ryzen 3', '🎮 Radeon Graphics', '💾 16GB RAM', '💽 512GB SSD'] },
  { id:7, name:'Laptop ASUS Vivo', priceUSD:599, image:'laptop', type:'laptop', category:'office', manufacturer:'ASUS', description: 'Легкий та стильний ноутбук для навчання й роботи поза домом. Забезпечує відмінну автономність та комфортну роботу з документами.', specs: ['💻 15.6" FHD', '🖥️ Intel i5-1135G7', '💾 8GB RAM', '💽 512GB SSD'] },
  { id:8, name:'Laptop LENOVO Slim', priceUSD:649, image:'laptop', type:'laptop', category:'office', manufacturer:'LENOVO', description: 'Універсальний ноутбук у тонкому та легкому корпусі. Чудовий дисплей робить його зручним для перегляду контенту та щоденного використання.', specs: ['💻 14" IPS', '🖥️ AMD Ryzen 5', '💾 16GB RAM', '💽 512GB SSD'] },
  { id:9, name:'Laptop HP Elite', priceUSD:749, image:'laptop', type:'laptop', category:'gaming', manufacturer:'HP', description: 'Потужний ігровий ноутбук із високочастотним дисплеєм. Ідеальний для динамічних шутерів з плавною картинкою без розривів.', specs: ['💻 15.6" 144Hz', '🖥️ Intel Core i7', '🎮 RTX 3050', '💾 16GB RAM'] },
  { id:10, name:'Laptop ASUS Opel', priceUSD:400, image:'laptop', type:'laptop', category:'office', manufacturer:'ASUS', description: 'Базовий лептоп для нескладних завдань, серфінгу в інтернеті та перегляду фільмів.', specs: ['💻 15.6" HD', '🖥️ Celeron N4020', '💾 4GB RAM', '💽 256GB SSD'] },
  { id:11, name:'Laptop LENOVO height-weight', priceUSD:610, image:'laptop', type:'laptop', category:'office', manufacturer:'LENOVO', description: 'Ноутбук класичного формфактора з великим обсягом пам\'яті для зберігання всіх ваших файлів та швидким процесором Core i5.', specs: ['💻 15.6" FHD', '🖥️ Intel Core i5', '💾 8GB RAM', '💽 1TB HDD'] },
  { id:12, name:'Laptop HP Smallit', priceUSD:630, image:'laptop', type:'laptop', category:'gaming', manufacturer: 'HP', description: 'Компактний 14-дюймовий ноутбук з дискретною відеокартою, який поєднує мобільність із можливістю пограти у вільний час.', specs: ['💻 14" FHD', '🖥️ AMD Ryzen 5', '🎮 GTX 1650', '💾 8GB RAM']}
];

// --- Helpers ---
function parsePrice(val){
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string'){
    const m = val.replace(/,/g, '.').match(/[-+]?[0-9]*\.?[0-9]+/);
    return m ? Number(m[0]) : 0;
  }
  return 0;
}
function formatUSD(n){ return '$' + (Number(n).toLocaleString('en-US', {maximumFractionDigits:2})); }

// --- Filter state ---
let filterState = {
  type: 'all',
  category: 'all',
  manufacturer: 'all',
  priceMin: null,
  priceMax: null
};

function saveFiltersToStorage(){ localStorage.setItem('pc-company-filters', JSON.stringify(filterState)); }
function loadFiltersFromStorage(){
  const raw = localStorage.getItem('pc-company-filters');
  if (!raw) return;
  try{ const obj = JSON.parse(raw); filterState = Object.assign(filterState, obj); }
  catch(e){ console.error('loadFiltersFromStorage parse error', e); }
}

// --- Filter panel UI ---
function createFilterPanel(){
  if (document.getElementById('productFilterPanel')) return;
  const panel = document.createElement('div'); panel.id='productFilterPanel'; panel.className='filter-panel';
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
  const overlay = document.createElement('div'); overlay.id='filterOverlay'; overlay.className='filter-overlay';
  document.body.appendChild(overlay); document.body.appendChild(panel);

  document.getElementById('filterCloseBtn').addEventListener('click', closeFilterPanel);
  overlay.addEventListener('click', closeFilterPanel);

  document.getElementById('filterTypeSelect').addEventListener('change', (e)=> populateManufacturerOptions(e.target.value));
  document.getElementById('filterSaveBtn').addEventListener('click', ()=>{ saveFiltersFromUI(); closeFilterPanel(); });
  document.getElementById('filterResetBtn').addEventListener('click', ()=>{ resetFilters(); });
}

function openFilterPanel(){ createFilterPanel(); document.getElementById('productFilterPanel').classList.add('open'); document.getElementById('filterOverlay').classList.add('open'); loadFiltersToUI(); }
function closeFilterPanel(){ const p=document.getElementById('productFilterPanel'), o=document.getElementById('filterOverlay'); if(p) p.classList.remove('open'); if(o) o.classList.remove('open'); }

function populateManufacturerOptions(type='all'){
  const sel = document.getElementById('filterManufacturerSelect'); if(!sel) return;
  const set = new Set(); products.forEach(p=>{ if(type==='all' || p.type===type) set.add(p.manufacturer || ''); });
  sel.innerHTML = '<option value="all">Всі</option>' + Array.from(set).filter(Boolean).sort().map(m=>`<option value="${m}">${m}</option>`).join('');
  if(filterState.manufacturer) sel.value = filterState.manufacturer;
}

function loadFiltersToUI(){
  const t=document.getElementById('filterTypeSelect'), c=document.getElementById('filterCategorySelect'), m=document.getElementById('filterManufacturerSelect'), min=document.getElementById('filterPriceMin'), max=document.getElementById('filterPriceMax');
  if(t) t.value = filterState.type || 'all';
  if(c) c.value = filterState.category || 'all';
  populateManufacturerOptions(filterState.type || 'all');
  if(m) m.value = filterState.manufacturer || 'all';
  if(min) min.value = filterState.priceMin !== null ? filterState.priceMin : '';
  if(max) max.value = filterState.priceMax !== null ? filterState.priceMax : '';
}

function saveFiltersFromUI(){
  const t=document.getElementById('filterTypeSelect'), c=document.getElementById('filterCategorySelect'), m=document.getElementById('filterManufacturerSelect'), min=document.getElementById('filterPriceMin'), max=document.getElementById('filterPriceMax');
  const newMin = min && min.value!=='' ? Number(min.value) : null;
  const newMax = max && max.value!=='' ? Number(max.value) : null;
  if(newMin!==null && newMax!==null && newMin>newMax){ alert('Помилка: мінімальна ціна не може бути більше за максимальну.'); return; }
  filterState.type = t ? t.value : 'all';
  filterState.category = c ? c.value : 'all';
  filterState.manufacturer = m ? m.value : 'all';
  filterState.priceMin = newMin; filterState.priceMax = newMax;
  saveFiltersToStorage(); renderProducts();
}
function resetFilters(){ filterState = { type:'all', category:'all', manufacturer:'all', priceMin:null, priceMax:null }; localStorage.removeItem('pc-company-filters'); loadFiltersToUI(); renderProducts(); }

// --- Rendering products with filters applied ---
function renderProducts(){
  const grid = document.getElementById('productsGrid'); if(!grid) return;
  grid.innerHTML = '';
  const filtered = products.filter(p=>{
    if(filterState.type !== 'all' && p.type !== filterState.type) return false;
    if(filterState.category !== 'all' && p.category !== filterState.category) return false;
    if(filterState.manufacturer !== 'all' && p.manufacturer !== filterState.manufacturer) return false;
    if(filterState.priceMin !== null && p.priceUSD < filterState.priceMin) return false;
    if(filterState.priceMax !== null && p.priceUSD > filterState.priceMax) return false;
    return true;
  });
  if(filtered.length===0){ grid.innerHTML = '<p class="no-products">За цими критеріями нічого не знайдено.</p>'; return; }
  filtered.forEach(p=> grid.appendChild(generateProductCard(p)));
}

function generateProductCard(product){
  const card = document.createElement('div'); card.className='product-card';
  const gradient = product.type==='desktop' ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' : 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)';
  card.innerHTML = `
    <div class="product-image-wrapper" style="background:${gradient};">
      <div class="product-image">${product.type==='desktop'?'🖥️':'💻'}</div>
      <div class="price-tag">${formatUSD(product.priceUSD)}</div>
    </div>
    <button class="product-details-btn" data-id="${product.id}">Детальніше</button>
  `;
  card.querySelector('.product-details-btn').addEventListener('click', ()=> openProductModal(product.id));
  return card;
}

// --- Product modal ---
function createProductModal(){
  if(document.getElementById('productModal')) return;
  const modal = document.createElement('div'); modal.id='productModal'; modal.className='product-modal';
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
  modal.addEventListener('click', (e)=>{ if(e.target===modal) closeProductModal(); });
  modal.querySelector('.btn-submit-review').addEventListener('click', submitReview);
}

function openProductModal(id){
  createProductModal();
  const product = products.find(p=>p.id===id); if(!product){ alert('Товар не знайдено'); return; }
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductPrice').textContent = formatUSD(product.priceUSD);
  document.getElementById('modalProductType').textContent = product.type==='desktop'?'Комп\'ютер':'Ноутбук';
  document.getElementById('modalProductIcon').textContent = product.type==='desktop'?'🖥️':'💻';
  
  const descSection = document.getElementById('modalProductDescSection');
  const descP = document.getElementById('modalProductDescription');
  if(descSection && descP) {
    if(product.description) {
      descP.textContent = product.description;
      descSection.style.display = 'block';
    } else {
      descSection.style.display = 'none';
    }
  }

  const charsDiv = document.getElementById('modalProductCharacteristics');
  if(charsDiv) {
    if(product.specs && product.specs.length > 0) {
      charsDiv.innerHTML = product.specs.map(spec => `<p>${spec}</p>`).join('');
    } else {
      charsDiv.innerHTML = '<p>💪 Потужна конфігурація</p><p>⚡ Висока продуктивність</p>';
    }
  }

  const addBtn = document.getElementById('modalAddToCartBtn');
  addBtn.onclick = ()=>{ addProductToCart(product.id, product.name, product.priceUSD, product.type); closeProductModal(); };
  document.getElementById('productModal').style.display='flex';
}
function closeProductModal(){ const m=document.getElementById('productModal'); if(m) m.style.display='none'; }

// Reviews
function submitReview(){ const name=document.getElementById('reviewName').value.trim(); const text=document.getElementById('reviewText').value.trim(); if(!name||!text){ alert('Будь ласка, заповніть усі поля!'); return; } const list=document.getElementById('reviewsList'); const no=list.querySelector('.no-reviews'); if(no) no.remove(); const item=document.createElement('div'); item.className='review-item'; item.innerHTML=`<div class="review-author">${name}</div><div class="review-text">${text}</div><div class="review-date">${new Date().toLocaleDateString('uk-UA')}</div>`; list.appendChild(item); document.getElementById('reviewName').value=''; document.getElementById('reviewText').value=''; alert('Відгук успішно додано!'); }

// --- Cart ---
function addProductToCart(id, name, price, type){
  const cart = JSON.parse(localStorage.getItem('pc-company-cart')||'[]');
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.quantity +=1; else cart.push({id,name,price,type,quantity:1});
  localStorage.setItem('pc-company-cart', JSON.stringify(cart)); alert(`${name} додано до кошика!`);
}
function createCartModal(){ if(document.getElementById('cartModal')) return; const modal=document.createElement('div'); modal.id='cartModal'; modal.className='cart-modal'; modal.innerHTML=`<div class="cart-modal-content"><div class="cart-modal-header"><h2>🛒 Мій кошик</h2><button class="cart-modal-close">&times;</button></div><div class="cart-modal-body"><div id="cartItemsList" class="cart-items-list"><p class="empty-cart">Кошик пустий</p></div></div><div class="cart-modal-summary"><div class="cart-summary-row"><span>Кількість товарів:</span><span id="cartItemCount">0</span></div><div class="cart-summary-row total"><span>Загалом:</span><span id="cartTotalPrice">0 $</span></div></div><div class="cart-modal-footer"><button class="btn-continue-shopping">Продовжити покупки</button><button class="btn-checkout">Оформити замовлення</button></div></div>`; document.body.appendChild(modal); modal.querySelector('.cart-modal-close').addEventListener('click', closeCartModal); modal.addEventListener('click', (e)=>{ if(e.target===modal) closeCartModal(); }); modal.querySelector('.btn-continue-shopping').addEventListener('click', closeCartModal); modal.querySelector('.btn-checkout').addEventListener('click', proceedToCheckout);
}
function openCartModal(){ createCartModal(); renderCartItems(); document.getElementById('cartModal').style.display='flex'; }
function closeCartModal(){ const m=document.getElementById('cartModal'); if(m) m.style.display='none'; }
function renderCartItems(){ const list=document.getElementById('cartItemsList'); const cart=JSON.parse(localStorage.getItem('pc-company-cart')||'[]'); if(!list) return; if(cart.length===0){ list.innerHTML='<p class="empty-cart">🛒 Кошик пустий</p>'; document.getElementById('cartItemCount').textContent='0'; document.getElementById('cartTotalPrice').textContent='0 $'; return; } list.innerHTML=''; let total=0; let items=0; cart.forEach((it,idx)=>{ const price=parsePrice(it.price)||0; const itemTotal=price*it.quantity; total+=itemTotal; items+=it.quantity; const div=document.createElement('div'); div.className='cart-item'; div.innerHTML=`<div class="cart-item-info"><div class="cart-item-icon">${it.type==='desktop'?'🖥️':'💻'}</div><div class="cart-item-details"><h4 class="cart-item-name">${it.name}</h4><p class="cart-item-price">${formatUSD(price)}</p></div></div><div class="cart-item-controls"><button class="cart-qty-btn" data-idx="${idx}" data-change="-1">−</button><input type="number" class="cart-qty-input" value="${it.quantity}" min="1" data-idx="${idx}"><button class="cart-qty-btn" data-idx="${idx}" data-change="1">+</button></div><div class="cart-item-total"><span>${formatUSD(itemTotal)}</span></div><button class="cart-item-remove" data-idx="${idx}">🗑️</button>`; list.appendChild(div); }); document.getElementById('cartItemCount').textContent = items; document.getElementById('cartTotalPrice').textContent = formatUSD(total);
  // attach events
  list.querySelectorAll('.cart-qty-btn').forEach(btn=> btn.addEventListener('click', (e)=>{ const idx=Number(btn.dataset.idx); const change=Number(btn.dataset.change); changeCartItemQuantity(idx, change); }));
  list.querySelectorAll('.cart-qty-input').forEach(inp=> inp.addEventListener('change', (e)=>{ const idx=Number(inp.dataset.idx); updateCartItemQuantity(idx, inp.value); }));
  list.querySelectorAll('.cart-item-remove').forEach(btn=> btn.addEventListener('click', ()=> removeFromCart(Number(btn.dataset.idx))));
}
function changeCartItemQuantity(index, change){ const cart=JSON.parse(localStorage.getItem('pc-company-cart')||'[]'); if(cart[index]){ cart[index].quantity = Math.max(1, cart[index].quantity + change); localStorage.setItem('pc-company-cart', JSON.stringify(cart)); renderCartItems(); } }
function updateCartItemQuantity(index, value){ const cart=JSON.parse(localStorage.getItem('pc-company-cart')||'[]'); const qty = parseInt(value)||1; if(cart[index]){ cart[index].quantity = Math.max(1, qty); localStorage.setItem('pc-company-cart', JSON.stringify(cart)); renderCartItems(); } }
function removeFromCart(index){ if(!confirm('Видалити цей товар з кошика?')) return; const cart=JSON.parse(localStorage.getItem('pc-company-cart')||'[]'); cart.splice(index,1); localStorage.setItem('pc-company-cart', JSON.stringify(cart)); renderCartItems(); alert('✅ Товар видалено з кошика'); }
function proceedToCheckout(){ const cart=JSON.parse(localStorage.getItem('pc-company-cart')||'[]'); if(cart.length===0){ alert('Кошик пуст! Додайте товари перед оформленням замовлення.'); return; } const isLoggedIn = localStorage.getItem('pc-company-logged-in') === 'true'; if(!isLoggedIn){ alert('Будь ласка, спочатку увійдіть до свого аккаунту'); window.location.href='login.html'; return; } closeCartModal(); window.location.href='checkout.html'; }

// --- Auth UI (simple) ---
function updateAuthUI(){ const isLoggedIn = localStorage.getItem('pc-company-logged-in') === 'true'; const currentUser = localStorage.getItem('pc-company-current-user'); const authLinks = document.querySelector('.auth-links'); if(!authLinks) return; if(isLoggedIn && currentUser){ try{ const user = JSON.parse(currentUser); authLinks.innerHTML = `<span class="auth-link welcome-text">Ласкаво просимо, ${user.name}!</span><button class="auth-link profile-link" id="profileOpenBtn">👤 Профіль</button><button class="auth-link logout-link" id="logoutBtn">Вийти</button>`; document.getElementById('profileOpenBtn').addEventListener('click', openProfileModal); document.getElementById('logoutBtn').addEventListener('click', logoutUser); }catch(e){ console.error(e); } } else { authLinks.innerHTML = `<a href="login.html" class="auth-link login-link">Вхід</a><a href="register.html" class="auth-link register-link">Реєстрація</a>`; } }

function openProfileModal(){ const raw = localStorage.getItem('pc-company-current-user'); if(!raw){ alert('Помилка: дані користувача не знайдені'); return; } try{ const user = JSON.parse(raw); let modal = document.getElementById('profileModal'); if(!modal){ modal = document.createElement('div'); modal.id='profileModal'; modal.className='profile-modal'; document.body.appendChild(modal); } modal.innerHTML = `<div class="profile-modal-content"><div class="profile-modal-header"><h2>Мій профіль</h2><button class="profile-modal-close">&times;</button></div><div class="profile-modal-body"><div class="profile-field"><label>Ім'я:</label><input id="profileName" value="${user.name}"></div><div class="profile-field"><label>Email:</label><input id="profileEmail" value="${user.email}" disabled><small>Email не можна змінити</small></div><div class="profile-field"><label>Телефон:</label><input id="profilePhone" value="${user.phone}"></div><div class="profile-field"><label>Новий пароль:</label><input id="profilePassword" type="password" placeholder="залишіть пусто щоб не змінювати"></div></div><div class="profile-modal-footer"><button class="btn-save" id="saveProfileBtn">Зберегти зміни</button><button class="btn-cancel" id="closeProfileBtn">Закрити</button></div></div>`; modal.style.display='flex'; modal.querySelector('.profile-modal-close').addEventListener('click', closeProfileModal); modal.querySelector('#closeProfileBtn').addEventListener('click', closeProfileModal); modal.querySelector('#saveProfileBtn').addEventListener('click', saveProfileChanges); modal.addEventListener('click', (e)=>{ if(e.target===modal) closeProfileModal(); }); }catch(e){ console.error(e); alert('Помилка при відкритті профілю'); } }
function closeProfileModal(){ const m=document.getElementById('profileModal'); if(m) m.style.display='none'; }
function saveProfileChanges(){ try{ const currentUser = JSON.parse(localStorage.getItem('pc-company-current-user')); const newName = document.getElementById('profileName').value.trim(); const newPhone = document.getElementById('profilePhone').value.trim(); const newPass = document.getElementById('profilePassword').value; if(!newName){ alert('Будь ласка, введіть ім'+'я!'); return; } if(!newPhone){ alert('Будь ласка, введіть номер телефону!'); return; } currentUser.name=newName; currentUser.phone=newPhone; if(newPass && newPass.length>=6){ currentUser.password=newPass; } else if(newPass && newPass.length>0 && newPass.length<6){ alert('Пароль повинен бути мінімум 6 символів!'); return; } localStorage.setItem('pc-company-user', JSON.stringify(currentUser)); localStorage.setItem('pc-company-current-user', JSON.stringify(currentUser)); alert('✅ Зміни успішно збережені!'); closeProfileModal(); updateAuthUI(); }catch(e){ console.error(e); alert('Помилка при збереженні'); } }
function logoutUser(){ if(!confirm('Ви впевнені, що хочете вийти?')) return; localStorage.setItem('pc-company-logged-in','false'); localStorage.removeItem('pc-company-current-user'); localStorage.removeItem('pc-company-remember'); alert('Ви успішно вийшли з аккаунту'); window.location.href='index.html'; }

// --- Initialization on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', ()=>{
  loadFiltersFromStorage();
  createFilterPanel();
  populateManufacturerOptions(filterState.type || 'all');
  renderProducts();
  updateAuthUI();
  // wire filter button
  const btn = document.querySelector('.filter-btn'); if(btn) btn.addEventListener('click', openFilterPanel);
  // wire cart button
  const cartBtn = document.querySelector('.cart-btn'); if(cartBtn) cartBtn.addEventListener('click', openCartModal);
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
  
  window.observeReveals = () => {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .product-card').forEach(el => {
          if (el.classList.contains('product-card')) el.classList.add('reveal');
          revealObserver.observe(el);
      });
  };
  window.observeReveals();
  // render site reviews form if exists
  const saveReviewBtn = document.getElementById('saveReviewBtn');
  if(saveReviewBtn) {
    saveReviewBtn.addEventListener('click', () => {
      const email = document.getElementById('reviewAuthorEmail').value.trim();
      const text = document.getElementById('reviewTextContent').value.trim();
      if(!email || !text) {
        alert('Будь ласка, заповніть усі поля!');
        return;
      }
      const accordion = document.getElementById('accordionFlushExample');
      if(!accordion) return;
      
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
      if(modal) modal.hide();
      
      alert('Дякуємо! Ваш відгук додано успішно.');
    });
  }
});
