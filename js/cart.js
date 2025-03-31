import { getAttractionById } from './attractions.js';

// Глобальна змінна для кошика
let cart = [];

// Функція для ініціалізації кошика
export function initCart() {
    loadCartFromStorage();
    updateCartCount();
    
    // Варіант 1 - додавання обробника через addEventListener
    document.getElementById('cart-btn').addEventListener('click', openCartModal);
    document.getElementById('checkout-btn').addEventListener('click', checkout);
    
    // Варіант 2 - через властивість on[event]
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        };
    });
    
    // Закриття модального вікна при кліку поза ним
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}


// Функція для завантаження кошика з локального сховища
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('aquawave_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Функція для збереження кошика в локальне сховище
function saveCartToStorage() {
    localStorage.setItem('aquawave_cart', JSON.stringify(cart));
}

// Функція для додавання атракціону до кошика
export function addToCart(attraction) {
    const existingItem = cart.find(item => item.id === attraction.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: attraction.id,
            name: attraction.name,
            price: attraction.price,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartCount();
}

// Функція для видалення атракціону з кошика
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCartToStorage();
    updateCartCount();
    displayCartItems();
}

// Функція для оновлення кількості товарів у кошику
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Функція для відображення товарів у кошику
function displayCartItems() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Ваш кошик порожній</p>';
        document.getElementById('total-price').textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const attraction = getAttractionById(item.id);
        if (!attraction) return;
        
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price} грн × ${item.quantity} = ${item.price * item.quantity} грн</p>
            </div>
            <div class="cart-item-actions">
                <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
            </div>
        `;
        container.appendChild(cartItem);
    });
    
    document.getElementById('total-price').textContent = total;
    
    // Варіант 3 - додавання обробника через слухача з функцією
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
}

// Функція для відкриття модального вікна кошика
function openCartModal() {
    displayCartItems();
    document.getElementById('cart-modal').style.display = 'block';
}

// Функція для оформлення замовлення
function checkout() {
    if (cart.length === 0) {
        alert('Ваш кошик порожній!');
        return;
    }
    
    // Тут може бути логіка відправлення замовлення на сервер
    alert('Замовлення оформлено! Дякуємо за покупку.');
    cart = [];
    saveCartToStorage();
    updateCartCount();
    displayCartItems();
    document.getElementById('cart-modal').style.display = 'none';
}