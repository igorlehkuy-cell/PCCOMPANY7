// === PROFILE PAGE JS ===

// ── Avatar helpers (standalone, don't depend on rental.js) ──────────────────
function getDefaultAvatarSrc(idx) {
    return `../images/avatars/preset_${idx}.svg`;
}

let _avatarSelected = null;

function openAvatarModal() {
    const raw = localStorage.getItem('pc-company-current-user');
    const user = raw ? JSON.parse(raw) : {};
    const currentAvatar = user.avatar || getDefaultAvatarSrc(1);
    _avatarSelected = currentAvatar;

    let modal = document.getElementById('avatarModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'avatarModal';
        modal.className = 'avatar-modal';
        document.body.appendChild(modal);
    }

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
                        <img src="${currentAvatar}" class="avatar-preview-large" id="avatarPreviewLarge" alt="Preview"
                            onerror="this.src='data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 50 50&quot;><text y=&quot;1em&quot; font-size=&quot;40&quot;>🤖</text></svg>'">
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

    modal.querySelectorAll('.avatar-preset-item').forEach(item => {
        item.addEventListener('click', () => {
            modal.querySelectorAll('.avatar-preset-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            _avatarSelected = item.dataset.src;
            document.getElementById('avatarPreviewLarge').src = _avatarSelected;
        });
    });

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
    modal.querySelector('#avatarSaveBtn').addEventListener('click', saveAvatar);
}

function closeAvatarModal() {
    const modal = document.getElementById('avatarModal');
    if (modal) modal.style.display = 'none';
}

function handleAvatarFile(file, modal) {
    if (!file.type.startsWith('image/')) { showToastSafe('Будь ласка, виберіть зображення!', 'warning'); return; }
    if (file.size > 5 * 1024 * 1024) { showToastSafe('Файл завеликий! Максимум 5MB.', 'warning'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        _avatarSelected = e.target.result;
        document.getElementById('avatarPreviewLarge').src = _avatarSelected;
        modal.querySelectorAll('.avatar-preset-item').forEach(i => i.classList.remove('selected'));
        showToastSafe('📸 Фото завантажено!', 'info');
    };
    reader.readAsDataURL(file);
}

function saveAvatar() {
    if (!_avatarSelected) { showToastSafe('Виберіть аватар!', 'warning'); return; }
    try {
        const currentUser = JSON.parse(localStorage.getItem('pc-company-current-user'));
        currentUser.avatar = _avatarSelected;
        localStorage.setItem('pc-company-current-user', JSON.stringify(currentUser));
        localStorage.setItem('pc-company-user', JSON.stringify(currentUser));
        closeAvatarModal();
        updateAuthUI();
        // Also update sidebar avatar
        const sidebarAvatar = document.getElementById('sidebarAvatar');
        if (sidebarAvatar) sidebarAvatar.src = _avatarSelected;
        showToastSafe('✅ Аватар успішно збережено!', 'success');
    } catch (e) {
        console.error(e);
        showToastSafe('Помилка при збереженні аватара', 'error');
    }
}

function showToastSafe(msg, type) {
    if (typeof window.showToast === 'function') window.showToast(msg, type);
    else alert(msg);
}

// ── Auth UI ────────────────────────────────────────────────────────────────
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
                <img src="${avatarSrc}" class="header-avatar" alt="Аватар" title="Мій профіль" onerror="this.style.display='none'">
                <span class="auth-link welcome-text">Вітаємо, ${user.name}!</span>
                <a href="profile.html" class="auth-link profile-link" style="font-weight:600;">👤 Профіль</a>
                <button class="auth-link logout-link" id="logoutBtn">Вийти</button>
            `;
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
        } catch (e) { console.error(e); }
    } else {
        authLinks.innerHTML = `<a href="login.html" class="auth-link login-link">Вхід</a><a href="register.html" class="auth-link register-link">Реєстрація</a>`;
    }
}

function logoutUser() {
    if (!confirm('Ви впевнені, що хочете вийти?')) return;
    localStorage.setItem('pc-company-logged-in', 'false');
    localStorage.removeItem('pc-company-current-user');
    localStorage.removeItem('pc-company-remember');
    window.location.href = 'index.html';
}

// ── Main Init ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme toggle
    const themeCheckbox = document.getElementById('themeCheckbox');
    if (themeCheckbox) {
        themeCheckbox.checked = localStorage.getItem('pc-company-theme') === 'dark';
        themeCheckbox.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('pc-company-theme', newTheme);
        });
    }

    // 2. Auth check
    const isLoggedIn = localStorage.getItem('pc-company-logged-in') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // 3. Load user
    updateAuthUI();

    const rawUser = localStorage.getItem('pc-company-current-user');
    let user = {};
    if (rawUser) user = JSON.parse(rawUser);

    initProfileUI(user);

    // 4. Tab navigation
    const navItems = document.querySelectorAll('.profile-nav-item[data-target]');
    const tabs = document.querySelectorAll('.profile-tab');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            const target = document.getElementById(targetId);
            if (target) target.classList.add('active');
        });
    });

    // 5. Save Profile
    const saveProfileBtn = document.getElementById('savePageProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const newName = document.getElementById('pageProfileName').value.trim();
            const newPhone = document.getElementById('pageProfilePhone').value.trim();
            if (!newName) { showToastSafe('Ім\'я не може бути порожнім', 'error'); return; }
            user.name = newName;
            user.phone = newPhone;
            saveUser(user);
            const sidebarName = document.getElementById('sidebarUserName');
            if (sidebarName) sidebarName.textContent = newName;
            updateAuthUI();
            showToastSafe('✅ Особисті дані оновлено', 'success');
        });
    }

    // 6. Change Password
    const savePassBtn = document.getElementById('savePagePasswordBtn');
    if (savePassBtn) {
        savePassBtn.addEventListener('click', () => {
            const oldPass = document.getElementById('pageProfileOldPass').value;
            const newPass = document.getElementById('pageProfileNewPass').value;
            if (!oldPass || !newPass) { showToastSafe('Заповніть обидва поля', 'error'); return; }
            if (oldPass !== user.password) { showToastSafe('Невірний поточний пароль', 'error'); return; }
            if (newPass.length < 6) { showToastSafe('Пароль має бути мінімум 6 символів', 'error'); return; }
            user.password = newPass;
            saveUser(user);
            document.getElementById('pageProfileOldPass').value = '';
            document.getElementById('pageProfileNewPass').value = '';
            showToastSafe('✅ Пароль успішно змінено', 'success');
        });
    }

    // 7. Logout
    const logoutBtn = document.getElementById('sidebarLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Ви впевнені, що хочете вийти?')) {
                localStorage.setItem('pc-company-logged-in', 'false');
                localStorage.removeItem('pc-company-current-user');
                window.location.href = 'index.html';
            }
        });
    }

    // 8. Admin button
    const adminBtn = document.getElementById('profileAdminBtn');
    if (adminBtn && user.is_admin === 1) adminBtn.style.display = 'block';

    // 9. Avatar change button
    const changeAvatarBtn = document.getElementById('sidebarChangeAvatarBtn');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', () => openAvatarModal());
    }

    // 10. Load data
    loadOrders();
    loadRentals();
    loadStatsAndAchievements(user);
});

function saveUser(user) {
    localStorage.setItem('pc-company-current-user', JSON.stringify(user));
    localStorage.setItem('pc-company-user', JSON.stringify(user));
}

function initProfileUI(user) {
    const avatarSrc = user.avatar || getDefaultAvatarSrc(1);
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    if (sidebarAvatar) sidebarAvatar.src = avatarSrc;
    const sidebarName = document.getElementById('sidebarUserName');
    if (sidebarName) sidebarName.textContent = user.name || 'Гість';
    const sidebarEmail = document.getElementById('sidebarUserEmail');
    if (sidebarEmail) sidebarEmail.textContent = user.email || '';
    const nameInput = document.getElementById('pageProfileName');
    if (nameInput) nameInput.value = user.name || '';
    const phoneInput = document.getElementById('pageProfilePhone');
    if (phoneInput) phoneInput.value = user.phone || '';
}

// ── Orders ────────────────────────────────────────────────────────────────
function loadOrders() {
    const container = document.getElementById('ordersContainer');
    if (!container) return;

    const storedOrders = JSON.parse(localStorage.getItem('pc-company-orders') || '[]');
    const orders = [...storedOrders];

    // Add mock history if empty
    if (orders.length === 0) {
        orders.push(
            { id: 'ORD-9823', date: '12.04.2026', items: 'Ігровий ПК "Inferno"', total: '$999', status: 'completed', statusText: 'Виконано' },
            { id: 'ORD-8472', date: '05.02.2026', items: 'Ноутбук ASUS Vivo', total: '$599', status: 'completed', statusText: 'Виконано' }
        );
    }

    container.innerHTML = orders.map(o => `
        <div class="history-item">
            <div class="history-info">
                <h4>Замовлення #${o.id || 'ORD-' + Date.now()}</h4>
                <p>${o.date || new Date().toLocaleDateString('uk-UA')} • ${o.items || 'Товари з кошика'}</p>
                <p style="font-weight:600;margin-top:5px;color:var(--primary-brown)">${o.total || (o.totalAmount ? o.totalAmount + ' грн' : 'N/A')}</p>
            </div>
            <div class="history-status status-${o.status || 'pending'}">${o.statusText || 'Опрацьовується'}</div>
        </div>
    `).join('');
}

// ── Rentals ────────────────────────────────────────────────────────────────
function loadRentals() {
    const container = document.getElementById('rentalsContainer');
    if (!container) return;
    const rentals = [
        { id: 'RNT-102', item: 'Ігровий ПК "Chupik"', startDate: '01.05.2026', endDate: '01.06.2026', status: 'active', statusText: 'Активна' }
    ];
    container.innerHTML = rentals.map(r => `
        <div class="history-item">
            <div class="history-info">
                <h4>Оренда: ${r.item}</h4>
                <p>Термін: ${r.startDate} — ${r.endDate}</p>
            </div>
            <div class="history-status status-${r.status}">${r.statusText}</div>
        </div>
    `).join('');
}

// ── Stats & Achievements ────────────────────────────────────────────────────
function loadStatsAndAchievements(user) {
    const quizState = JSON.parse(localStorage.getItem('pc-company-quiz-state') || '{}');
    const streak = quizState.streak || 0;
    const points = quizState.points || 0;

    const quizStreakEl = document.getElementById('quizStreak');
    if (quizStreakEl) quizStreakEl.textContent = streak;
    const quizPointsEl = document.getElementById('quizPoints');
    if (quizPointsEl) quizPointsEl.textContent = points + '%';
    const totalOrdersEl = document.getElementById('totalOrders');
    if (totalOrdersEl) totalOrdersEl.textContent = JSON.parse(localStorage.getItem('pc-company-orders') || '[]').length || 3;
    const bonusEl = document.getElementById('bonusPointsBalance');
    if (bonusEl) bonusEl.textContent = (user.bonus_points || 0) + ' ₴';

    const achievements = [
        { id: 'first_blood', name: 'Перша кров', icon: '🩸', req: 'Зробіть перше замовлення', unlocked: true },
        { id: 'quiz_master', name: 'Майстер вікторин', icon: '🧠', req: 'Стрік 3+ у вікторині', unlocked: streak >= 3 },
        { id: 'dark_knight', name: 'Темний лицар', icon: '🦇', req: 'Увімкніть темну тему', unlocked: localStorage.getItem('pc-company-theme') === 'dark' },
        { id: 'reviewer', name: 'Критик', icon: '⭐', req: 'Залиште відгук', unlocked: false },
        { id: 'renter', name: 'Орендар', icon: '⏳', req: 'Візьміть ПК в оренду', unlocked: true },
        { id: 'deal_hunter', name: 'Мисливець за знижками', icon: '🎯', req: 'Використайте промокод', unlocked: !!localStorage.getItem('pc-company-last-promo') },
        { id: 'night_owl', name: 'Нічна сова', icon: '🦉', req: 'Зайдіть після 22:00', unlocked: new Date().getHours() >= 22 },
        { id: 'power_user', name: 'Просунутий юзер', icon: '⚡', req: 'Зробіть 5 замовлень', unlocked: false }
    ];

    const grid = document.getElementById('achievementsGrid');
    if (grid) {
        grid.innerHTML = achievements.map(a => `
            <div class="badge-item ${a.unlocked ? 'unlocked' : ''}" title="${a.req}">
                <div class="badge-icon">${a.icon}</div>
                <div class="badge-name">${a.name}</div>
                <div class="badge-req">${a.req}</div>
                ${a.unlocked ? '<div class="badge-unlocked-mark">✓</div>' : '<div class="badge-locked-mark">🔒</div>'}
            </div>
        `).join('');
    }

    loadQuests(user, streak, points);
}

function loadQuests(user, streak, points) {
    const container = document.getElementById('questsContainer');
    if (!container) return;

    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    const dailyDone = JSON.parse(localStorage.getItem('pc-company-daily-quests') || '{}');
    if (!dailyDone[todayKey + '_login']) {
        dailyDone[todayKey + '_login'] = true;
        localStorage.setItem('pc-company-daily-quests', JSON.stringify(dailyDone));
    }

    const quests = [
        { id: 'daily_login', category: 'daily', categoryLabel: '📅 Щоденне', icon: '🌅', name: 'Щоденний вхід', desc: 'Заходьте на сайт кожен день', reward: '+5 бонусних гривень', current: 1, target: 1, done: true },
        { id: 'daily_quiz', category: 'daily', categoryLabel: '📅 Щоденне', icon: '🧩', name: 'Пройдіть вікторину', desc: 'Зіграйте у вікторину на головній сторінці', reward: 'Знижка до 5%', current: Math.min(streak, 1), target: 1, done: streak > 0 },
        { id: 'daily_browse', category: 'daily', categoryLabel: '📅 Щоденне', icon: '🔍', name: 'Перегляньте 3 товари', desc: 'Відкрийте 3 різних товари', reward: '+2 бонусні гривні', current: Math.min(parseInt(localStorage.getItem('pc-company-viewed-today') || '0'), 3), target: 3, done: parseInt(localStorage.getItem('pc-company-viewed-today') || '0') >= 3 },
        { id: 'quest_orders', category: 'ongoing', categoryLabel: '🎯 Постійне', icon: '📦', name: 'Колекціонер замовлень', desc: 'Зробіть 5 замовлень у магазині', reward: 'Ачівка "Постійний клієнт" + 50 бонусів', current: 3, target: 5, done: false },
        { id: 'quest_quiz_streak', category: 'ongoing', categoryLabel: '🎯 Постійне', icon: '🔥', name: 'Вогняний стрік', desc: 'Досягніть стріку 5 днів у вікторині', reward: 'Ачівка "Майстер вікторин"', current: streak, target: 5, done: streak >= 5 },
        { id: 'quest_dark_mode', category: 'ongoing', categoryLabel: '🎯 Постійне', icon: '🌙', name: 'Темна сторона', desc: 'Увімкніть темну тему та користуйтесь нею', reward: 'Ачівка "Темний лицар"', current: localStorage.getItem('pc-company-theme') === 'dark' ? 1 : 0, target: 1, done: localStorage.getItem('pc-company-theme') === 'dark' },
        { id: 'quest_rental', category: 'ongoing', categoryLabel: '🎯 Постійне', icon: '⏳', name: 'Перша оренда', desc: 'Орендуйте будь-який ПК або ноутбук', reward: 'Ачівка "Орендар" + 30 бонусів', current: 1, target: 1, done: true },
        { id: 'quest_promo', category: 'ongoing', categoryLabel: '🎯 Постійне', icon: '🎟️', name: 'Мисливець за знижками', desc: 'Скористайтесь промокодом при замовленні', reward: 'Ачівка "Мисливець за знижками"', current: localStorage.getItem('pc-company-last-promo') ? 1 : 0, target: 1, done: !!localStorage.getItem('pc-company-last-promo') }
    ];

    const renderQuest = (q) => {
        const pct = Math.round((Math.min(q.current, q.target) / q.target) * 100);
        const barColor = q.done ? '#22c55e' : q.category === 'daily' ? '#6366f1' : '#f59e0b';
        return `
        <div class="quest-item ${q.done ? 'quest-done' : ''}">
            <div class="quest-left">
                <div class="quest-icon">${q.icon}</div>
                <div class="quest-info">
                    <div class="quest-top-row">
                        <span class="quest-category-badge ${q.category}">${q.categoryLabel}</span>
                        ${q.done ? '<span class="quest-completed-badge">✅ Виконано</span>' : ''}
                    </div>
                    <div class="quest-name">${q.name}</div>
                    <div class="quest-desc">${q.desc}</div>
                    <div class="quest-progress-wrap">
                        <div class="quest-progress-bar">
                            <div class="quest-progress-fill" style="width:${pct}%; background:${barColor};"></div>
                        </div>
                        <span class="quest-progress-text">${Math.min(q.current, q.target)} / ${q.target}</span>
                    </div>
                </div>
            </div>
            <div class="quest-reward">
                <div class="quest-reward-icon">🏆</div>
                <div class="quest-reward-text">${q.reward}</div>
            </div>
        </div>`;
    };

    const dailyQuests = quests.filter(q => q.category === 'daily');
    const ongoingQuests = quests.filter(q => q.category === 'ongoing');

    container.innerHTML = `
        <div class="quests-section-title">📅 Щоденні завдання</div>
        <div class="quests-list">${dailyQuests.map(renderQuest).join('')}</div>
        <div class="quests-section-title" style="margin-top:24px;">🎯 Постійні завдання</div>
        <div class="quests-list">${ongoingQuests.map(renderQuest).join('')}</div>
    `;
}

window.loadQuests = loadQuests;
