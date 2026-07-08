// Cart management
class Cart {
    constructor() {
        this.items = this.loadCart();
    }

    loadCart() {
        const saved = localStorage.getItem('pc-company-cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('pc-company-cart', JSON.stringify(this.items));
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            const price = parseInt(item.price) || 0;
            return total + (price * item.quantity);
        }, 0);
    }

    clear() {
        this.items = [];
        this.saveCart();
    }
}

// Initialize cart
const cart = new Cart();

// Render cart items
function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const emptyCart = document.getElementById('emptyCart');

    if (!container) return;

    if (cart.items.length === 0) {
        container.style.display = 'none';
        emptyCart.style.display = 'block';
    } else {
        container.style.display = 'block';
        emptyCart.style.display = 'none';
        container.innerHTML = '';

        cart.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    ${item.type === 'desktop' ? '🖥️' : '💻'}
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <div class="cart-item-price">${item.price}</div>
                    <div class="cart-item-controls">
                        <input 
                            type="number" 
                            class="qty-input" 
                            value="${item.quantity}" 
                            min="1"
                            onchange="updateCartItem(${item.id}, this.value)"
                        >
                        <button class="btn-remove" onclick="removeFromCart(${item.id})">Видалити</button>
                    </div>
                </div>
            `;
            container.appendChild(cartItem);
        });
    }

    updateCartSummary();
}

// Update cart item
function updateCartItem(productId, quantity) {
    cart.updateQuantity(productId, parseInt(quantity));
    renderCart();
}

// Remove from cart
function removeFromCart(productId) {
    cart.removeItem(productId);
    renderCart();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.getTotal();
    const shipping = cart.items.length > 0 ? 50 : 0;
    let discountPercent = 0;
    
    // Check for promo
    const promo = localStorage.getItem('pc-company-promo');
    if (promo) {
        discountPercent += parseInt(promo);
    }
    
    // Check for quiz discount
    const quizDiscount = localStorage.getItem('quiz_discount');
    if (quizDiscount) {
        discountPercent += parseInt(quizDiscount);
    }
    
    // Limit discount to 100%
    discountPercent = Math.min(discountPercent, 100);
    
    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    const total = subtotal - discountAmount + shipping;

    const subtotalElem = document.getElementById('subtotal');
    const shippingElem = document.getElementById('shipping');
    const totalElem = document.getElementById('total');

    if (subtotalElem) subtotalElem.textContent = `${subtotal} грн`;
    if (shippingElem) shippingElem.textContent = `${shipping} грн`;
    
    // Check if we have discount elements, if not create them if discount > 0
    let discountElem = document.getElementById('discount');
    if (discountPercent > 0) {
        if (!discountElem) {
            const summaryContainer = document.querySelector('.cart-modal-summary') || document.querySelector('.summary-box');
            if (summaryContainer) {
                const discountRow = document.createElement('div');
                discountRow.className = 'cart-summary-row discount-row summary-row';
                discountRow.innerHTML = `<span>Знижка (-${discountPercent}%):</span><span id="discount" style="color: var(--red);">-${discountAmount} грн</span>`;
                // Insert before the total row
                const totalRow = summaryContainer.querySelector('.cart-summary-row.total') || summaryContainer.querySelector('.summary-row.total');
                if (totalRow) {
                    summaryContainer.insertBefore(discountRow, totalRow);
                } else {
                    summaryContainer.appendChild(discountRow);
                }
            }
        } else {
            discountElem.textContent = `-${discountAmount} грн`;
            discountElem.parentElement.querySelector('span').textContent = `Знижка (-${discountPercent}%):`;
        }
    } else if (discountElem) {
        discountElem.parentElement.remove();
    }

    if (totalElem) totalElem.textContent = `${total} грн`;
}

// Checkout button
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.items.length === 0) {
            window.showToast('Кошик порожній!', 'warning');
            return;
        }
        window.location.href = 'checkout.html';
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

// Add to cart function (called from product pages)
function addToCart(product) {
    cart.addItem(product);
    window.showToast(`${product.name} додано до кошика!`, 'success');
}


