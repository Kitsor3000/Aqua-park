import { loadAttractions } from './attractions.js';
import { initCart } from './cart.js';
import { initAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    
    loadAttractions();
    initAuth();
    initCart();

   
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.hash !== "" && !this.classList.contains('no-scroll')) {
                e.preventDefault();
                const target = document.querySelector(this.hash);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
   
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });


  const burger = document.querySelector('#burger');
  const menu = document.querySelector('#menu');
    
  burger.addEventListener('click', () =>  {
    menu.classList.toggle('disp');
  });
    
        
  
  
  if (checkAuth()) {
      
      console.log('Адмін авторизований');
    }
    
});
