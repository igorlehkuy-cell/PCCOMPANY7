// Rental data
const rentalOptions = [
    {
        id: 1,
        name: 'Посуденева оренда',
        price: '50 грн/день',
        features: ['Комп\'ютер в комплекті', 'Технічна підтримка', 'Безкоштовна доставка']
    },
    {
        id: 2,
        name: 'Тижневий пакет',
        price: '300 грн/тиждень',
        features: ['Комп\'ютер + монітор', 'Пріоритетна підтримка', 'Безкоштовна установка']
    },
    {
        id: 3,
        name: 'Місячний пакет',
        price: '1000 грн/місяць',
        features: ['Повна конфігурація', '24/7 підтримка', 'Безкоштовна заміна']
    },
    {
        id: 4,
        name: 'Корпоративний',
        price: 'За запитом',
        features: ['Кастомна конфігурація', 'Менеджер проекту', 'Гнучкі умови']
    }
];

// Generate rental cards
function generateRentalCard(rental) {
    const card = document.createElement('div');
    card.className = 'rental-card';
    card.innerHTML = `
        <div class="rental-content">
            <h3 class="rental-title">${rental.name}</h3>
            <div class="rental-price">${rental.price}</div>
            <ul class="rental-features">
                ${rental.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <button class="rental-btn" onclick="selectRental('${rental.name}', '${rental.price}')">Вибрати</button>
        </div>
    `;
    return card;
}

// Render rental cards
function renderRental() {
    const rentalGrid = document.getElementById('rentalGrid');
    if (rentalGrid) {
        rentalGrid.innerHTML = '';
        rentalOptions.forEach(rental => {
            const card = generateRentalCard(rental);
            rentalGrid.appendChild(card);
        });
    }
}

// Select rental function
function selectRental(name, price) {
    alert(`Обрано: ${name} - ${price}\n\nДля оформлення оренди зв'яжіться з нами:\n📞 +380 (68) 956-31-02\n📧 igorlehkuy@gmail.com`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderRental();

    // Setup cart button
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }
});

