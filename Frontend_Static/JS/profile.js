// JS for Profile Dashboard
document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Auth
    const isLoggedIn = localStorage.getItem('pc-company-logged-in') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Load User Data
    const rawUser = localStorage.getItem('pc-company-current-user');
    let user = {};
    if (rawUser) {
        user = JSON.parse(rawUser);
    }

    // Initialize UI with user data
    initProfileUI(user);

    // 3. Tab Navigation
    const navItems = document.querySelectorAll('.profile-nav-item[data-target]');
    const tabs = document.querySelectorAll('.profile-tab');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));

            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 4. Save Profile Form
    const saveProfileBtn = document.getElementById('savePageProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const newName = document.getElementById('pageProfileName').value.trim();
            const newPhone = document.getElementById('pageProfilePhone').value.trim();

            if (!newName) {
                window.showToast('Ім\'я не може бути порожнім', 'error');
                return;
            }

            user.name = newName;
            user.phone = newPhone;
            saveUser(user);
            document.getElementById('sidebarUserName').textContent = newName;
            window.showToast('Особисті дані оновлено', 'success');
        });
    }

    // 5. Change Password Form
    const savePassBtn = document.getElementById('savePagePasswordBtn');
    if (savePassBtn) {
        savePassBtn.addEventListener('click', () => {
            const oldPass = document.getElementById('pageProfileOldPass').value;
            const newPass = document.getElementById('pageProfileNewPass').value;

            if (!oldPass || !newPass) {
                window.showToast('Заповніть обидва поля', 'error');
                return;
            }

            if (oldPass !== user.password) {
                window.showToast('Невірний поточний пароль', 'error');
                return;
            }

            if (newPass.length < 6) {
                window.showToast('Новий пароль має бути мінімум 6 символів', 'error');
                return;
            }

            user.password = newPass;
            saveUser(user);
            document.getElementById('pageProfileOldPass').value = '';
            document.getElementById('pageProfileNewPass').value = '';
            window.showToast('Пароль успішно змінено', 'success');
        });
    }

    // 6. Logout
    document.getElementById('sidebarLogoutBtn').addEventListener('click', () => {
        if (confirm('Ви впевнені, що хочете вийти?')) {
            localStorage.setItem('pc-company-logged-in', 'false');
            localStorage.removeItem('pc-company-current-user');
            window.location.href = 'index.html';
        }
    });

    // Admin Panel display
    const adminBtn = document.getElementById('profileAdminBtn');
    if (adminBtn) {
        if (user.is_admin === 1) {
            adminBtn.style.display = 'block';
        }
    }

    // 7. Avatar change - reusing the modal from script.js if possible
    document.getElementById('sidebarChangeAvatarBtn').addEventListener('click', () => {
        if (typeof openAvatarModal === 'function') {
            openAvatarModal();
            // Since avatar modal saves and updates auth UI, we also need to update sidebar
            const checkAvatarInterval = setInterval(() => {
                const modal = document.getElementById('avatarModal');
                if (!modal || modal.style.display === 'none') {
                    clearInterval(checkAvatarInterval);
                    const updatedUser = JSON.parse(localStorage.getItem('pc-company-current-user') || '{}');
                    if (updatedUser.avatar) {
                        document.getElementById('sidebarAvatar').src = updatedUser.avatar;
                    }
                }
            }, 500);
        } else {
            window.showToast('Функція зміни аватара недоступна', 'error');
        }
    });

    // Load Mock Data for Orders, Rentals, Achievements
    loadMockOrders();
    loadMockRentals();
    loadStatsAndAchievements(user);
});

function saveUser(user) {
    localStorage.setItem('pc-company-current-user', JSON.stringify(user));
    localStorage.setItem('pc-company-user', JSON.stringify(user)); // update main db too for simplicity
    if (typeof updateAuthUI === 'function') updateAuthUI();
}

function initProfileUI(user) {
    const avatarSrc = user.avatar || getDefaultAvatarSrc(1);
    document.getElementById('sidebarAvatar').src = avatarSrc;
    document.getElementById('sidebarUserName').textContent = user.name || 'Гість';
    document.getElementById('sidebarUserEmail').textContent = user.email || '';

    document.getElementById('pageProfileName').value = user.name || '';
    document.getElementById('pageProfilePhone').value = user.phone || '';
}

// Mock Data Loaders
function loadMockOrders() {
    const container = document.getElementById('ordersContainer');
    
    // Check if we have recent checkout data in localStorage
    const lastCheckout = localStorage.getItem('pc-company-last-order');
    const orders = [];
    
    if (lastCheckout) {
        orders.push({
            id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
            date: new Date().toLocaleDateString('uk-UA'),
            items: 'Комплектуючі / ПК (з кошика)',
            total: JSON.parse(lastCheckout).total || '$0',
            status: 'pending',
            statusText: 'Опрацьовується'
        });
    }

    // Add some old mock orders
    orders.push(
        { id: 'ORD-9823', date: '12.04.2026', items: 'Ігровий ПК "Inferno"', total: '$999.00', status: 'completed', statusText: 'Виконано' },
        { id: 'ORD-8472', date: '05.02.2026', items: 'Ноутбук ASUS Vivo', total: '$599.00', status: 'completed', statusText: 'Виконано' }
    );

    if (orders.length === 0) {
        container.innerHTML = '<div class="empty-state">У вас ще немає замовлень.</div>';
        return;
    }

    container.innerHTML = orders.map(o => `
        <div class="history-item">
            <div class="history-info">
                <h4>Замовлення #${o.id}</h4>
                <p>${o.date} • ${o.items}</p>
                <p style="font-weight: 600; margin-top: 5px; color: var(--primary-color)">${o.total}</p>
            </div>
            <div class="history-status status-${o.status}">
                ${o.statusText}
            </div>
        </div>
    `).join('');
}

function loadMockRentals() {
    const container = document.getElementById('rentalsContainer');
    const rentals = [
        { id: 'RNT-102', item: 'Ігровий ПК "Chupik"', startDate: '01.05.2026', endDate: '01.06.2026', status: 'active', statusText: 'Активна' }
    ];

    if (rentals.length === 0) {
        container.innerHTML = '<div class="empty-state">У вас немає активних оренд.</div>';
        return;
    }

    container.innerHTML = rentals.map(r => `
        <div class="history-item">
            <div class="history-info">
                <h4>Оренда: ${r.item}</h4>
                <p>Термін: ${r.startDate} — ${r.endDate}</p>
            </div>
            <div class="history-status status-${r.status}">
                ${r.statusText}
            </div>
        </div>
    `).join('');
}

function loadStatsAndAchievements(user) {
    // Read stats from localStorage (quiz state)
    const quizState = JSON.parse(localStorage.getItem('pc-company-quiz-state') || '{}');
    const streak = quizState.streak || 0;
    const points = quizState.points || 0;
    
    document.getElementById('quizStreak').textContent = streak;
    document.getElementById('quizPoints').textContent = points + '%';
    document.getElementById('totalOrders').textContent = 3; // mock
    
    const bonusBalanceElem = document.getElementById('bonusPointsBalance');
    if (bonusBalanceElem) {
        bonusBalanceElem.textContent = (user.bonus_points || 0) + ' ₴';
    }

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
    grid.innerHTML = achievements.map(a => `
        <div class="badge-item ${a.unlocked ? 'unlocked' : ''}" title="${a.req}">
            <div class="badge-icon">${a.icon}</div>
            <div class="badge-name">${a.name}</div>
            <div class="badge-req">${a.req}</div>
            ${a.unlocked ? '<div class="badge-unlocked-mark">✓</div>' : '<div class="badge-locked-mark">🔒</div>'}
        </div>
    `).join('');

    // Load quests
    loadQuests(user, streak, points);
}

function loadQuests(user, streak, points) {
    const container = document.getElementById('questsContainer');
    if (!container) return;

    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    const dailyDone = JSON.parse(localStorage.getItem('pc-company-daily-quests') || '{}');

    // Detect daily login
    if (!dailyDone[todayKey + '_login']) {
        dailyDone[todayKey + '_login'] = true;
        localStorage.setItem('pc-company-daily-quests', JSON.stringify(dailyDone));
    }

    const quests = [
        // === ЩОДЕННІ ===
        {
            id: 'daily_login',
            category: 'daily',
            categoryLabel: '📅 Щоденне',
            icon: '🌅',
            name: 'Щоденний вхід',
            desc: 'Заходьте на сайт кожен день',
            reward: '+5 бонусних гривень',
            current: 1,
            target: 1,
            done: dailyDone[todayKey + '_login'] === true
        },
        {
            id: 'daily_quiz',
            category: 'daily',
            categoryLabel: '📅 Щоденне',
            icon: '🧩',
            name: 'Пройдіть вікторину',
            desc: 'Зіграйте у вікторину на головній сторінці',
            reward: 'Знижка до 5%',
            current: quizState ? Math.min(streak, 1) : 0,
            target: 1,
            done: streak > 0
        },
        {
            id: 'daily_browse',
            category: 'daily',
            categoryLabel: '📅 Щоденне',
            icon: '🔍',
            name: 'Перегляньте 3 товари',
            desc: 'Відкрийте сторінку 3 різних товарів',
            reward: '+2 бонусні гривні',
            current: Math.min(parseInt(localStorage.getItem('pc-company-viewed-today') || '0'), 3),
            target: 3,
            done: parseInt(localStorage.getItem('pc-company-viewed-today') || '0') >= 3
        },
        // === ПОСТІЙНІ / ПРОГРЕСИВНІ ===
        {
            id: 'quest_orders',
            category: 'ongoing',
            categoryLabel: '🎯 Постійне',
            icon: '📦',
            name: 'Колекціонер замовлень',
            desc: 'Зробіть 5 замовлень у магазині',
            reward: 'Ачівка "Постійний клієнт" + 50 бонусів',
            current: 3,
            target: 5,
            done: false
        },
        {
            id: 'quest_quiz_streak',
            category: 'ongoing',
            categoryLabel: '🎯 Постійне',
            icon: '🔥',
            name: 'Вогняний стрік',
            desc: 'Досягніть стріку 5 днів у вікторині',
            reward: 'Ачівка "Майстер вікторин"',
            current: streak,
            target: 5,
            done: streak >= 5
        },
        {
            id: 'quest_dark_mode',
            category: 'ongoing',
            categoryLabel: '🎯 Постійне',
            icon: '🌙',
            name: 'Темна сторона',
            desc: 'Увімкніть темну тему та користуйтесь нею',
            reward: 'Ачівка "Темний лицар"',
            current: localStorage.getItem('pc-company-theme') === 'dark' ? 1 : 0,
            target: 1,
            done: localStorage.getItem('pc-company-theme') === 'dark'
        },
        {
            id: 'quest_rental',
            category: 'ongoing',
            categoryLabel: '🎯 Постійне',
            icon: '⏳',
            name: 'Перша оренда',
            desc: 'Орендуйте будь-який ПК або ноутбук',
            reward: 'Ачівка "Орендар" + 30 бонусів',
            current: 1,
            target: 1,
            done: true
        },
        {
            id: 'quest_promo',
            category: 'ongoing',
            categoryLabel: '🎯 Постійне',
            icon: '🎟️',
            name: 'Мисливець за знижками',
            desc: 'Скористайтесь промокодом при замовленні',
            reward: 'Ачівка "Мисливець за знижками"',
            current: localStorage.getItem('pc-company-last-promo') ? 1 : 0,
            target: 1,
            done: !!localStorage.getItem('pc-company-last-promo')
        }
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

// Expose for external use if needed
window.loadQuests = loadQuests;
