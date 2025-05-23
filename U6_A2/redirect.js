// Функция для определения мобильного устройства
function isMobileDevice() {
    // Проверяем ширину экрана
    const mobileWidth = window.innerWidth <= 768;
    
    // Проверяем юзер-агент
    const mobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent);
    
    // Также проверяем ориентацию экрана и соотношение сторон
    const isPortrait = window.innerHeight > window.innerWidth;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const isMobileRatio = aspectRatio < 1.2;
    
    // Определяем устройство как мобильное если выполняется одно из условий
    return mobileWidth || mobileAgent || (isPortrait && isMobileRatio);
}

// Функция для перенаправления на мобильную версию
function redirectToMobile() {
    if (isMobileDevice()) {
        // Получаем текущий URL
        let currentPath = window.location.pathname;
        let filename = currentPath.split('/').pop() || 'index.htm'; // Если путь пустой, считаем что это index.htm
        
        // Обрабатываем случай когда в URL нет имени файла (папка)
        if (!filename.includes('.htm')) {
            filename = 'index.htm';
        }
        
        // Проверяем, не находимся ли мы уже на мобильной версии
        if (!filename.includes('mobile_')) {
            // Определяем, какую мобильную страницу открыть
            let mobilePath = '';
            
            if (filename === '' || filename === 'index.htm') {
                mobilePath = 'mobile_index.htm';
            } else if (filename === 'index_d.htm') {
                mobilePath = 'mobile_index_d.htm';
            } else if (filename.includes('_d.htm')) {
                mobilePath = 'mobile_' + filename;
            } else {
                mobilePath = 'mobile_' + filename;
            }
            
            // Перенаправляем на мобильную версию
            window.location.href = mobilePath;
        }
    }
}

// Запускаем перенаправление при загрузке страницы
window.addEventListener('DOMContentLoaded', function() {
    // На мобильной версии не запускаем перенаправление
    if (!window.location.pathname.includes('mobile_')) {
        // На десктопной версии проверяем устройство и перенаправляем
        redirectToMobile();
    }
});

// Добавляем обработку изменения размера окна
window.addEventListener('resize', function() {
    // Проверяем только если мы не на мобильной версии
    if (!window.location.pathname.includes('mobile_')) {
        redirectToMobile();
    }
}); 