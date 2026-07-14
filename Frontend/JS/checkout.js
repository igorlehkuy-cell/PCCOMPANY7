// Checkout functionality

// --- Telegram Bot Configuration ---
const TELEGRAM_BOT_TOKEN = '8659176041:AAGmAvQylvGPuPPYD72icKhjdYTtcefWgvg'; // Вставте сюди токен вашого бота від @BotFather
const TELEGRAM_CHAT_ID = '2096812186';     // Вставте сюди ваш Chat ID (можна дізнатися через бота @userinfobot)

async function sendTelegramNotification(order, orderData) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('Telegram token or chat ID is empty. Skipping notification.');
        return;
    }

    const itemsStr = order.items.map(item => `  • ${item.name} (x${item.quantity}) - $${parseInt(item.price) * item.quantity}`).join('\n');
    const paymentMethodMap = {
        'card': 'Банківська карта',
        'transfer': 'Банківський переказ',
        'cash': 'Готівка',
        'crypto': 'Крипта'
    };
    const paymentText = paymentMethodMap[orderData.paymentMethod] || orderData.paymentMethod;

    let paymentExtra = '';
    if (orderData.paymentMethod === 'card' && orderData.cardNumber) {
        paymentExtra = `\n🔢 <b>Номер карти:</b> ${orderData.cardNumber}`;
    }

    const deliveryMethodMap = {
        'courier': "Кур'єрська доставка (За адресою)",
        'novaposhta': 'Нова Пошта',
        'ukrposhta': 'Укрпошта',
        'meest': 'Meest Express',
        'pickup': 'Самовивіз з магазину'
    };
    const deliveryText = deliveryMethodMap[orderData.deliveryMethod] || 'Не вказано';

    const message = `
📦 <b>НОВЕ ЗАМОВЛЕННЯ #${order.id}</b>
    
👤 <b>Клієнт:</b> ${orderData.name}
📱 <b>Телефон:</b> ${orderData.phone}
📧 <b>Email:</b> ${orderData.email}

📍 <b>Локація на карті:</b> ${orderData.location}
🚚 <b>Спосіб доставки:</b> ${deliveryText}
🏠 <b>Адреса/Відділення:</b> ${orderData.address} ${orderData.apartment ? ' (кв./офіс ' + orderData.apartment + ')' : ''}
💳 <b>Оплата:</b> ${paymentText}${paymentExtra}

🛒 <b>Товари:</b>
${itemsStr}

💵💰 <b>Всього до сплати:</b> $${order.total} + ${orderData.deliveryPrice || 0} грн (Доставка)
    `;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
    } catch (e) {
        console.error('Помилка при відправці повідомлення в Telegram:', e);
    }
}

class Checkout {
    constructor() {
        this.cart = this.loadCart();
        this.deliveryPrices = {
            'Київ': 0,
            'Харків': 50,
            'Одеса': 75,
            'Львів': 100,
            'Дніпро': 60,
            'Інше': 0
        };
    }

    loadCart() {
        const saved = localStorage.getItem('pc-company-cart');
        return saved ? JSON.parse(saved) : [];
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => {
            const price = parseInt(String(item.price).replace(/[^0-9.]/g, '')) || 0;
            return total + (price * item.quantity);
        }, 0);
    }

    getDeliveryPrice(location) {
        return this.deliveryPrices[location] || 0;
    }

    saveOrder(orderData) {
        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: this.cart,
            ...orderData,
            total: this.getCartTotal() + this.getDeliveryPrice(orderData.location)
        };

        // Save to localStorage
        const orders = JSON.parse(localStorage.getItem('pc-company-orders') || '[]');
        orders.push(order);
        localStorage.setItem('pc-company-orders', JSON.stringify(orders));

        // Clear cart after order
        localStorage.removeItem('pc-company-cart');

        return order;
    }
}

// Initialize checkout
const checkout = new Checkout();

// Render order summary
function renderOrderSummary() {
    const orderItemsContainer = document.getElementById('orderItems');
    const orderTotalElem = document.getElementById('orderTotal');

    if (!orderItemsContainer) return;

    orderItemsContainer.innerHTML = '';

    if (checkout.cart.length === 0) {
        orderItemsContainer.innerHTML = '<p>Кошик порожній</p>';
        return;
    }

    checkout.cart.forEach(item => {
        const itemElem = document.createElement('div');
        itemElem.className = 'order-item';
        const price = parseInt(String(item.price).replace(/[^0-9.]/g, '')) || 0;
        const itemTotal = price * item.quantity;
        itemElem.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>$${itemTotal}</span>
        `;
        orderItemsContainer.appendChild(itemElem);
    });

    // Update total
    if (orderTotalElem) {
        const total = checkout.getCartTotal();
        orderTotalElem.textContent = `$${total}`;
    }
}

// Handle location change (replaced by map init)
function initMap() {
    const mapContainer = document.getElementById('delivery-map');
    if (!mapContainer) return;

    // Default center (Ukraine)
    const map = L.map('delivery-map').setView([49.0, 31.0], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add Geocoder (Search box)
    if (L.Control.Geocoder) {
        L.Control.geocoder({
            defaultMarkGeocode: false,
            placeholder: 'Шукати адресу...'
        })
        .on('markgeocode', function(e) {
            map.setView(e.geocode.center, 14);
            map.fireEvent('click', { latlng: e.geocode.center });
        })
        .addTo(map);
    }

    const branches = [
        { city: 'Київ', address: 'вул. Хрещатик, 1', lat: 50.4501, lng: 30.5234 },
        { city: 'Київ', address: 'пр. Берестейський, 24', lat: 50.4508, lng: 30.4650 },
        { city: 'Харків', address: 'вул. Сумська, 10', lat: 49.9935, lng: 36.2304 },
        { city: 'Одеса', address: 'вул. Дерибасівська, 5', lat: 46.4825, lng: 30.7233 },
        { city: 'Львів', address: 'пл. Ринок, 1', lat: 49.8420, lng: 24.0315 },
        { city: 'Дніпро', address: 'пр. Дмитра Яворницького, 50', lat: 48.4647, lng: 35.0462 }
    ];

    const locationInput = document.getElementById('location');
    const branchDetailsInput = document.getElementById('branchDetails');
    const branchNameElem = document.getElementById('selected-branch-name');
    const branchPriceElem = document.getElementById('selected-branch-price');
    const orderTotalElem = document.getElementById('orderTotal');

    // Add markers
    branches.forEach(branch => {
        const marker = L.marker([branch.lat, branch.lng]).addTo(map);

        marker.bindPopup(`
            <div style="text-align: center;">
                <b>${branch.city}</b><br>
                <span style="font-size:13px;">${branch.address}</span><br>
                <div style="margin: 8px 0; font-size: 13px; color: #4CAF50;">📦 В наявності (доставка 0-1 день)</div>
                <button type="button" 
                        class="btn-select-branch" 
                        style="margin-top:4px; padding:6px 12px; background:var(--dark-brown); color:white; border:none; border-radius:4px; cursor:pointer; width:100%; font-weight:bold; transition: 0.3s;"
                        onmouseover="this.style.background='var(--accent)'" onmouseout="this.style.background='var(--dark-brown)'"
                        onclick="selectBranch('${branch.city}', '${branch.address}')">
                    Вибрати відділення
                </button>
            </div>
        `);
    });

    let userMarker = null;
    let deliveryPolyline = null;
    let animatedTruck = null;
    let truckAnimationInterval = null;

    // Central point (Kyiv - our store) for calculating distance
    const kyivCoords = { lat: 50.4501, lng: 30.5234 };

    // Custom truck icon
    const truckIcon = L.divIcon({
        className: 'truck-icon',
        html: '<div style="font-size: 24px; animation: bounce 1s infinite;">🚚</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    // Helper to calculate estimated delivery date based on distance
    function getEstimatedDeliveryHTML(distance) {
        const today = new Date();
        let days = 0;
        if(distance > 800) days = 3;
        else if(distance > 300) days = 2;
        else if(distance > 50) days = 1;

        if (days === 0) return '<b style="color:var(--accent);">Сьогодні</b> (в межах 2-3 годин)';
        if (days === 1) return '<b style="color:var(--accent);">Завтра</b> (до кінця дня)';
        
        today.setDate(today.getDate() + days);
        return `<b style="color:var(--accent);">${today.toLocaleDateString('uk-UA')}</b> (Орієнтовно)`;
    }

    function animateTruckTo(targetLat, targetLng) {
        if (animatedTruck) map.removeLayer(animatedTruck);
        if (deliveryPolyline) map.removeLayer(deliveryPolyline);
        if (truckAnimationInterval) clearInterval(truckAnimationInterval);

        // Draw dotted line
        deliveryPolyline = L.polyline([[kyivCoords.lat, kyivCoords.lng], [targetLat, targetLng]], {
            color: 'var(--accent)',
            dashArray: '5, 10',
            weight: 3,
            opacity: 0.7
        }).addTo(map);

        animatedTruck = L.marker([kyivCoords.lat, kyivCoords.lng], { icon: truckIcon }).addTo(map);

        const steps = 60;
        let currentStep = 0;
        const dLat = (targetLat - kyivCoords.lat) / steps;
        const dLng = (targetLng - kyivCoords.lng) / steps;

        truckAnimationInterval = setInterval(() => {
            currentStep++;
            const nextLat = kyivCoords.lat + (dLat * currentStep);
            const nextLng = kyivCoords.lng + (dLng * currentStep);
            animatedTruck.setLatLng([nextLat, nextLng]);

            if (currentStep >= steps) {
                clearInterval(truckAnimationInterval);
                // Turn truck into a green checkmark upon arrival
                animatedTruck.setIcon(L.divIcon({
                    className: 'check-icon',
                    html: '<div style="font-size: 24px; color: #4CAF50;">✅</div>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                }));
            }
        }, 30);
    }

    // Haversine formula to calculate distance between two lat/lng coordinates in kilometers
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }

    // Handle clicking anywhere on the map to set a custom delivery location
    map.on('click', function (e) {
        if (userMarker) {
            map.removeLayer(userMarker);
        }
        userMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);

        // Calculate dynamic price based on distance (e.g., base 50 UAH + 2 UAH per km)
        const distance = calculateDistance(kyivCoords.lat, kyivCoords.lng, e.latlng.lat, e.latlng.lng);
        let dynamicPrice = 50 + Math.round(distance * 2);

        // If it's within 10km of Kyiv center, make it free or minimal base price
        if (distance < 10) {
            dynamicPrice = 0;
        }

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&zoom=10&addressdetails=1`)
            .then(res => res.json())
            .then(data => {
                const city = data.address.city || data.address.town || data.address.village || data.address.state || 'Україна';
                const addressText = data.display_name;

                const etaHTML = getEstimatedDeliveryHTML(distance);

                userMarker.bindPopup(`
                    <div style="text-align: center;">
                        <b style="color:var(--dark-brown);">Ваше місцезнаходження</b><br>
                        ${city}<br>
                        <span style="font-size: 13px; color: #666;">Відстань від нашого складу: ${Math.round(distance)} км</span><br>
                        <div style="margin: 8px 0; padding: 6px; background: rgba(220,165,110,0.1); border-radius: 4px; font-size: 13px;">
                            Час доставки: ${etaHTML}
                        </div>
                        <button type="button" class="btn-select-branch" 
                                style="margin-top:4px; padding:6px 12px; background:var(--dark-brown); color:white; border:none; border-radius:4px; cursor:pointer; width:100%; font-weight:bold; transition: 0.3s;"
                                onmouseover="this.style.background='var(--accent)'" onmouseout="this.style.background='var(--dark-brown)'"
                                onclick="selectBranch('${city.replace(/'/g, "\\'")}', 'Власна адреса: ${addressText.replace(/'/g, "\\'")}', true, ${dynamicPrice}); animateTruckTo(${e.latlng.lat}, ${e.latlng.lng})">
                            Підтвердити локацію
                        </button>
                    </div>
                `).openPopup();
            })
            .catch(() => {
                const etaHTML = getEstimatedDeliveryHTML(distance);

                userMarker.bindPopup(`
                    <div style="text-align: center;">
                        <b style="color:var(--dark-brown);">Ваше місцезнаходження</b><br>
                        <span style="font-size: 13px; color: #666;">Відстань від складу: ${Math.round(distance)} км</span><br>
                        <div style="margin: 8px 0; padding: 6px; background: rgba(220,165,110,0.1); border-radius: 4px; font-size: 13px;">
                            Час доставки: ${etaHTML}
                        </div>
                        <button type="button" class="btn-select-branch" 
                                style="margin-top:4px; padding:6px 12px; background:var(--dark-brown); color:white; border:none; border-radius:4px; cursor:pointer; width:100%; font-weight:bold; transition: 0.3s;"
                                onmouseover="this.style.background='var(--accent)'" onmouseout="this.style.background='var(--dark-brown)'"
                                onclick="selectBranch('Інше', 'Власна адреса на карті', true, ${dynamicPrice}); animateTruckTo(${e.latlng.lat}, ${e.latlng.lng})">
                            Підтвердити локацію
                        </button>
                    </div>
                `).openPopup();
            });
    });

    // Global function to handle branch selection from popup
    window.selectBranch = function (city, address, isCustom = false, calculatedPrice = null) {
        locationInput.value = city;
        branchDetailsInput.value = address;

        let deliveryPrice = 0;

        if (isCustom && calculatedPrice !== null) {
            // Use dynamically calculated price for custom markers
            deliveryPrice = calculatedPrice;
        } else if (checkout.deliveryPrices.hasOwnProperty(city)) {
            // Fallback to static prices for predefined branches 
            deliveryPrice = checkout.deliveryPrices[city];
        } else {
            deliveryPrice = 150;
        }

        branchNameElem.textContent = isCustom ? `Власна адреса (${city})` : `${city}, ${address}`;
        branchPriceElem.textContent = deliveryPrice === 0 && !isCustom ? 'Безкоштовно' : `${deliveryPrice} грн`;

        const cartTotal = checkout.getCartTotal();
        // save delivery price to orderData when confirming
        window.pendingDeliveryPrice = deliveryPrice;

        if (orderTotalElem) {
            orderTotalElem.innerHTML = `$${cartTotal} <span style="font-size:14px; font-weight:normal;">+ ${deliveryPrice} грн (Доставка)</span>`;
        }
        
        // Populate the read-only address input
        const addressInput = document.getElementById('address');
        if (addressInput) {
            addressInput.value = isCustom ? `${city} (Власна адреса)` : `${city}, ${address}`;
        }

        map.closePopup();
    };
}

let pendingOrderData = null;

// Handle form submission
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(checkoutForm);
        pendingOrderData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            location: formData.get('location'),
            deliveryMethod: formData.get('deliveryMethod'),
            address: formData.get('address'),
            apartment: formData.get('apartment'),
            postcode: formData.get('postcode'),
            paymentMethod: formData.get('payment'),
            branchDetails: formData.get('branchDetails')
        };

        // Validate
        if (!pendingOrderData.location) {
            showToast('Виберіть місто/локацію доставки на карті!', 'warning');
            return;
        }

        if (!pendingOrderData.paymentMethod) {
            showToast('Виберіть спосіб оплати!', 'warning');
            return;
        }

        // Add branch details to location string for display
        if (pendingOrderData.branchDetails) {
            pendingOrderData.location = `${pendingOrderData.location}, ${pendingOrderData.branchDetails}`;
        }

        openPaymentModal(pendingOrderData.paymentMethod);
    });
}

// --- Auth UI (sync header auth state) ---
function getDefaultAvatarSrc(idx) { return `../images/avatars/preset_${idx}.svg`; }

function updateAuthUI() { 
    const isLoggedIn = localStorage.getItem('pc-company-logged-in') === 'true'; 
    const currentUser = localStorage.getItem('pc-company-current-user'); 
    const authLinks = document.querySelector('.auth-links'); 
    if(!authLinks) return; 
    
    if(isLoggedIn && currentUser) { 
        try { 
            const user = JSON.parse(currentUser);
            const avatarSrc = user.avatar || getDefaultAvatarSrc(1);
            authLinks.innerHTML = `
                <img src="${avatarSrc}" class="header-avatar" alt="Аватар" onerror="this.style.display='none'">
                <span class="auth-link welcome-text">Вітаємо, ${user.name}!</span>
                <a href="profile.html" class="auth-link profile-link">👤 Профіль</a>
                <button class="auth-link logout-link" id="logoutBtn">Вийти</button>
            `; 
            document.getElementById('logoutBtn').addEventListener('click', logoutUser); 
        } catch(e) { console.error(e); } 
    } else { 
        authLinks.innerHTML = `<a href="login.html" class="auth-link login-link">Вхід</a><a href="register.html" class="auth-link register-link">Реєстрація</a>`; 
    } 
}

function logoutUser(){ if(!confirm('Ви впевнені, що хочете вийти?')) return; localStorage.setItem('pc-company-logged-in','false'); localStorage.removeItem('pc-company-current-user'); localStorage.removeItem('pc-company-remember'); showToast('Ви успішно вийшли з аккаунту', 'success'); setTimeout(() => window.location.href='index.html', 1200); }

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    const themeToggle = document.getElementById('themeCheckbox');
    if (themeToggle) {
        themeToggle.checked = localStorage.getItem('pc-company-theme') === 'dark';
        themeToggle.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('pc-company-theme', newTheme);
        });
    }
});

function openPaymentModal(method) {
    const modal = document.getElementById('paymentModal');
    if(!modal) return;
    
    // Hide all sub-views
    ['card', 'transfer', 'cash', 'crypto'].forEach(m => {
        const el = document.getElementById(`modal-payment-${m}`);
        if(el) el.style.display = 'none';
    });

    // Show active view
    const activeEl = document.getElementById(`modal-payment-${method}`);
    if(activeEl) activeEl.style.display = 'block';

    modal.style.display = 'flex';
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if(modal) {
        modal.style.display = 'none';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (checkout.cart.length === 0) {
        showToast('Кошик порожній! Повертаємося на головну...', 'warning');
        setTimeout(() => window.location.href = 'index.html', 1500);
        return;
    }

    renderOrderSummary();
    // Init map after leaflet is fully loaded
    if (typeof L !== 'undefined') {
        initMap();
    } else {
        window.addEventListener('load', initMap);
    }

    // Handle payment method toggles
    // Setup modal events
    const modal = document.getElementById('paymentModal');
    if(modal) {
        document.getElementById('paymentModalCloseBtn').addEventListener('click', closePaymentModal);
        modal.addEventListener('click', (e) => { if(e.target === modal) closePaymentModal(); });

        document.getElementById('confirmPaymentBtn').addEventListener('click', async () => {
            if(!pendingOrderData) return;
            
            // if card, validate and append to pending order
            if (pendingOrderData.paymentMethod === 'card') {
                const cardNum = document.getElementById('modalCardNumber').value;
                if (!cardNum || cardNum.trim() === '') {
                    showToast('Будь ласка, введіть дійсний номер кредитної карти.', 'error');
                    return;
                }
                pendingOrderData.cardNumber = cardNum;
            }

            const confirmBtn = document.getElementById('confirmPaymentBtn');
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Обробка...';

            // add delivery price to pendingOrderData
            pendingOrderData.deliveryPrice = window.pendingDeliveryPrice || 0;

            // Save order
            const order = checkout.saveOrder(pendingOrderData);

            // Send to telegram
            await sendTelegramNotification(order, pendingOrderData);

            showToast(`Замовлення успішно оформлено! 🎉 #${order.id}`, 'success');
            setTimeout(() => window.location.href = 'index.html', 2500);
        });
    }

    // Pre-fill user data if logged in
    const currentUser = localStorage.getItem('pc-company-current-user');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');

        if (nameInput) nameInput.value = user.name || '';
        if (emailInput) emailInput.value = user.email || '';
        if (phoneInput) phoneInput.value = user.phone || '';
    }
});


