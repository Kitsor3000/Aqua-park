// Глобальна змінна для зберігання атракціонів
let attractionsData = [];

import { addToCart } from './cart.js';

// Функція для завантаження даних про атракціони
export async function loadAttractions() {
    try {
        const response = await fetch('../data/attractions.json');
        const data = await response.json();
        attractionsData = data.attractions;
        displayAttractions(attractionsData);
        displayPrices(data.prices);
        
        // Ініціалізація пошуку та сортування
        initSearch();
        initSort();
    } catch (error) {
        console.error('Помилка завантаження даних:', error);
        // Якщо не вдалося завантажити JSON, використовуємо вбудовані дані
        const fallbackData = {
            attractions: [
                {
                    "id": 1,
                    "name": "Гірка Цунамі",
                    "description": "Найвища гірка в нашому аквапарку з падінням з 25 метрів",
                    "price": 150,
                    "image": "../images/attractions/tsunami1.png",
                    "category": "екстремальні"
                }
            ],
            prices: {
                individual: [
                    {
                        "type": "Дорослий (цілий день)",
                        "price": 500
                    }
                ]
            }
        };
        attractionsData = fallbackData.attractions;
        displayAttractions(attractionsData);
        displayPrices(fallbackData.prices);
    }
}

// Функція для відображення атракціонів
function displayAttractions(attractions) {
    const container = document.getElementById('attractions-container');
    container.innerHTML = '';
    
    attractions.forEach(attraction => {
        const card = document.createElement('div');
        card.className = 'attraction-card';
        card.innerHTML = `
            <img src="${attraction.image}" alt="${attraction.name}" class="attraction-img">
            <div class="attraction-info">
                <h3>${attraction.name}</h3>
                <p>${attraction.description}</p>
                <div class="attraction-details">
                    <p>Категорія: ${attraction.category}</p>
                    ${attraction.minHeight ? `<p>Мін. зріст: ${attraction.minHeight} см</p>` : ''}
                    <p>Тривалість: ${attraction.duration}</p>
                </div>
                <div class="attraction-price">${attraction.price} грн</div>
                <button class="add-to-cart" data-id="${attraction.id}">Додати до кошика</button>
            </div>
        `;
        container.appendChild(card);
    });
    
    // Додаємо обробники подій для кнопок (варіант 1 - через addEventListener)
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCartHandler);
    });
}

// Функція для відображення цін
function displayPrices(prices) {
    const container = document.querySelector('.price-tables');
    container.innerHTML = '';
    
    for (const [type, priceList] of Object.entries(prices)) {
        const table = document.createElement('table');
        table.className = 'price-table';
        
        let caption = '';
        if (type === 'individual') caption = 'Індивідуальні ціни';
        else if (type === 'group') caption = 'Групові ціни';
        else if (type === 'season') caption = 'Сезонні абонементи';
        
        table.innerHTML = `
            <caption><h3>${caption}</h3></caption>
            <thead>
                <tr>
                    <th>Тип квитка</th>
                    <th>Ціна</th>
                    ${type !== 'individual' ? '<th>Примітка</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${priceList.map(item => `
                    <tr>
                        <td>${item.type}</td>
                        <td>${item.price} грн</td>
                        ${type !== 'individual' ? `<td>${item.note}</td>` : ''}
                    </tr>
                `).join('')}
            </tbody>
        `;
        container.appendChild(table);
    }
}

// Функція для ініціалізації пошуку
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    // Варіант 2 - через on[event] властивість
    searchBtn.onclick = function() {
        performSearch(searchInput.value);
    };
    
    // Пошук при натисканні Enter
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
}

// Функція для виконання пошуку
function performSearch(query) {
    if (!query.trim()) {
        displayAttractions(attractionsData);
        return;
    }
    
    const filtered = attractionsData.filter(attraction => 
        attraction.name.toLowerCase().includes(query.toLowerCase()) || 
        attraction.description.toLowerCase().includes(query.toLowerCase()) ||
        attraction.category.toLowerCase().includes(query.toLowerCase())
    );
    
    displayAttractions(filtered);
}

// Функція для ініціалізації сортування
function initSort() {
    const sortSelect = document.getElementById('sort-select');
    
    // Варіант 3 - через слухача подій з функцією-обробником
    sortSelect.addEventListener('change', function() {
        const value = this.value;
        let sorted = [...attractionsData];
        
        switch(value) {
            case 'price-asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Сортування за замовчуванням (як в оригінальному масиві)
                break;
        }
        
        displayAttractions(sorted);
    });
}

// Обробник додавання до кошика
function addToCartHandler(e) {
    const attractionId = parseInt(e.target.getAttribute('data-id'));
    const attraction = attractionsData.find(a => a.id === attractionId);
    
    if (attraction) {
        // Викликаємо функцію з cart.js для додавання товару
        addToCart(attraction);
        
        // Оновлюємо кількість товарів у кошику
        updateCartCount();
        
        // Показуємо сповіщення
        showNotification(`${attraction.name} додано до кошика!`);
    }
}

// Функція для показу сповіщення
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Експортуємо функції, які будуть використовуватися в інших модулях
export function getAttractionById(id) {
    return attractionsData.find(a => a.id === id);
}