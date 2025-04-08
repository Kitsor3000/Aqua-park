
let attractionsData = [];

import { addToCart } from './cart.js';


export async function loadAttractions() {
    try {
        const response = await fetch('../data/attractions.json');
        const data = await response.json();
        attractionsData = data.attractions;
        displayAttractions(attractionsData);
        displayPrices(data.prices);
        
       
        initSearch();
        initSort();
    } catch (error) {
        console.error('Помилка завантаження даних:', error);
        
        const fallbackData = {
            attractions: [
                {
                    "id": 1,
                    "name": "Гірка Цунамі",
                    "description": "Найвища гірка в нашому аквапарку з падінням з 25 метрів",
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
    
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', editAttraction);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteAttraction);
    });
    
   
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCartHandler);
    });

    
    
    
}


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


function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    
    searchBtn.onclick = function() {
        performSearch(searchInput.value);
    };
    
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
}


// пош
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


function initSort() {
    const sortSelect = document.getElementById('sort-select');
    
    
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
               
                break;
        }
        
        displayAttractions(sorted);
    });
}


// Кор
function addToCartHandler(e) {
    const attractionId = parseInt(e.target.getAttribute('data-id'));
    const attraction = attractionsData.find(a => a.id === attractionId);
    
    if (attraction) {
        
        addToCart(attraction);
        
        updateCartCount();
        
        showNotification(`${attraction.name} додано до кошика!`);
    }
}

   // смс
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


  export function getAttractionById(id) {
    return attractionsData.find(a => a.id === id);
}






function deleteAttraction(e) {
    if (!checkAuth()) {
        showNotification('Доступ заборонено', 'error');
        return;
    }
    
    if (!confirm('Ви впевнені, що хочете видалити цей атракціон?')) return;
    
    const attractionId = parseInt(e.target.getAttribute('data-id'));
    attractionsData = attractionsData.filter(a => a.id !== attractionId);
    
     
    displayAttractions(attractionsData);
    showNotification('Атракціон успішно видалено');
}


function addNewAttraction() {
    if (!checkAuth()) {
        showNotification('Доступ заборонено', 'error');
        return;
    }
    

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Додати новий атракціон</h2>
            <form id="add-attraction-form">
                <div class="form-group">
                    <label for="add-name">Назва:</label>
                    <input type="text" id="add-name" required>
                </div>
                <div class="form-group">
                    <label for="add-description">Опис:</label>
                    <textarea id="add-description" required></textarea>
                </div>
                <div class="form-group">
                    <label for="add-image">URL зображення:</label>
                    <input type="url" id="add-image">
                </div>
                <div class="form-group">
                    <label for="add-price">Ціна (грн):</label>
                    <input type="number" id="add-price" min="0" required>
                </div>
                <div class="form-group">
                    <label for="add-capacity">Місткість (осіб):</label>
                    <input type="number" id="add-capacity" min="1" required>
                </div>
                <div class="form-group">
                    <label for="add-status">Статус:</label>
                    <select id="add-status">
                        <option value="available">Доступний</option>
                        <option value="maintenance">На обслуговуванні</option>
                        <option value="closed">Закритий</option>
                    </select>
                </div>
                <button type="submit" class="btn-save">Додати атракціон</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.remove();
        }
    });

    
    document.getElementById('add-attraction-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
       
        const name = document.getElementById('add-name').value.trim();
        const description = document.getElementById('add-description').value.trim();
        const image = document.getElementById('add-image').value.trim();
        const price = parseInt(document.getElementById('add-price').value);
        const capacity = parseInt(document.getElementById('add-capacity').value);
        const status = document.getElementById('add-status').value;

        if (!name || !description) {
            showNotification('Будь ласка, заповніть обов\'язкові поля', 'error');
            return;
        }

        
        const newAttraction = {
            id: attractionsData.length > 0 ? Math.max(...attractionsData.map(a => a.id)) + 1 : 1,
            name,
            description,
            image: image || null,
            price,
            capacity,
            status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

       
        attractionsData.push(newAttraction);
        
      
        displayAttractions(attractionsData);
        showNotification('Атракціон успішно додано');
        modal.remove();
    });
}





document.getElementById('add-attraction-btn')?.addEventListener('click', addNewAttraction);