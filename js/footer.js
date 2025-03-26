
function handleFooterScroll() {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });
}

// Ініціалізація функції при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    handleFooterScroll();
});