import { getAttractionById } from './attractions.js';


let cart = [];


export function initCart() {
    loadCartFromStorage();
    updateCartCount();
    
   
    document.getElementById('cart-btn').addEventListener('click', openCartModal);
    document.getElementById('checkout-btn').addEventListener('click', checkout);
    
    
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        };
    });
    
    
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}



function loadCartFromStorage() {
    const savedCart = localStorage.getItem('aquawave_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}


function saveCartToStorage() {
    localStorage.setItem('aquawave_cart', JSON.stringify(cart));
}


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

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCartToStorage();
    updateCartCount();
    displayCartItems();
}


function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}


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
    
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
}

function openCartModal() {
    displayCartItems();
    document.getElementById('cart-modal').style.display = 'block';
}


function checkout() {
    if (cart.length === 0) {
        alert('Ваш кошик порожній!');
        return;
    }
    
    
    alert('Замовлення оформлено! Дякуємо за покупку.');
    cart = [];
    saveCartToStorage();
    updateCartCount();
    displayCartItems();
    document.getElementById('cart-modal').style.display = 'none';
}