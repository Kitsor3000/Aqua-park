
const ADMIN_CREDENTIALS = {
    email: "admin@aquawave.com",
    password: "1111"
};


export function checkAuth() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}


function login(email, password) {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        return true;
    }
    return false;
}


function logout() {
    localStorage.removeItem('adminLoggedIn');
}


export function initAuth() {
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const closeBtn = loginModal.querySelector('.close');
    const logoutBtn = document.getElementById('logout-btn');
    const addAttractionBtn = document.getElementById('add-attraction-btn');

    loginBtn.addEventListener('click', function(e) {
        e.preventDefault(); 
        e.stopPropagation(); 
        
        if (checkAuth()) {
            logout();
            updateAuthUI();
            showNotification('Ви вийшли з системи');
        } else {
            loginModal.style.display = 'block';
        }
    });

    
    closeBtn.addEventListener('click', function() {
        loginModal.style.display = 'none';
    });

   
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (login(email, password)) {
            loginModal.style.display = 'none';
            updateAuthUI();
            showNotification('Вітаємо, адміне!');
        } else {
            alert('Невірний email або пароль');
        }
    });

    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
            updateAuthUI();
            showNotification('Ви вийшли з системи');
        });
    }

    
    updateAuthUI();
}


function updateAuthUI() {
    const isLoggedIn = checkAuth();
    const loginBtn = document.getElementById('login-btn');
    const adminPanel = document.querySelector('.admin-panel');
    
    if (loginBtn) {
        loginBtn.textContent = isLoggedIn ? 'ВИЙТИ' : 'УВІЙТИ';
    }
    
    if (adminPanel) {
        adminPanel.style.display = isLoggedIn ? 'block' : 'none';
    }
}


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