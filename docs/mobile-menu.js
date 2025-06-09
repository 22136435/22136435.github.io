// Функции для управления мобильным меню
document.addEventListener('DOMContentLoaded', function() {
    // Получаем все необходимые элементы
    const menuIcon = document.querySelector('.menu-icon');
    const menuClose = document.querySelector('.close-menu');
    const navMenu = document.querySelector('nav ul');
    const overlay = document.querySelector('.overlay');
    
    // Функция для открытия меню
    function openMenu() {
        navMenu.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Запрещаем прокрутку основного содержимого
    }
    
    // Функция для закрытия меню
    function closeMenu() {
        navMenu.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = ''; // Разрешаем прокрутку основного содержимого
    }
    
    // Обработчики событий
    if (menuIcon) {
        menuIcon.addEventListener('click', openMenu);
    }
    
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }
    
    // Закрываем меню при клике на любую ссылку в меню
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });
}); 